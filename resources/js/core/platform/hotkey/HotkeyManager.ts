import {buildKeyCombo} from "./KeyCombo"
import {EventBus} from "@/core/platform/event/EventBus"
import {HotkeyEvents} from "@/core/platform/tokens/hotkey"
import {PipelineFactory} from "@/core/pipeline/PipelineFactory";
import {HotkeyActionInvoker} from "@/core/platform/hotkey/HotkeyActionInvoker";
import {HotkeyPipelineContext} from "@/core/platform/hotkey/contracts/HotkeyPipelineContext";
import {SequenceTimeoutExecutePayload, SequenceUpdatePayload} from "@/core/platform/hotkey/contracts/HotkeyEvent";
import {IEvent} from "@/core/platform/event/Event";
import {DevLogger} from "@/core/facades/DevLogger";
import {HotkeyHintService} from "@/core/platform/hotkey/HotkeyHintService";

/**
 * Orchestrates the global hotkey workflow through user-defined pipeline stages.
 *
 * Responsibilities:
 * - capture and normalize keyboard events
 * - propagate interaction state through the pipeline
 * - react to plugin-registered sequence timeouts
 * - delegate executable invocation to HotkeyActionInvoker
 */
export class HotkeyManager {

    private initialized = false

    private interactionId = 0

    constructor(
        private readonly eventBus: EventBus,
        private readonly pipelineFactory: PipelineFactory<HotkeyPipelineContext, void>,
        private readonly actionInvoker: HotkeyActionInvoker,
        private readonly hintService: HotkeyHintService
    ) {
    }

    /**
     * Initialize keyboard listeners and event subscriptions
     */
    init(): void {
        if (this.initialized) return

        window.addEventListener("keydown", this.handleKeyDown, {passive: false})
        this.eventBus.on(HotkeyEvents.SequenceTimeoutExecute, this.handleSequenceTimeout)
        this.eventBus.on(HotkeyEvents.SequenceUpdate, this.handleSequenceUpdate)
        this.eventBus.on(HotkeyEvents.SequenceExecuted, this.handleSequenceExecuted)

        this.initialized = true
        DevLogger.channel('HotKey').info('HotKey manager initialized.')
    }

    destroy(): void {
        if (!this.initialized) return

        window.removeEventListener("keydown", this.handleKeyDown)
        this.eventBus.off(HotkeyEvents.SequenceTimeoutExecute, this.handleSequenceTimeout)
        this.eventBus.off(HotkeyEvents.SequenceUpdate, this.handleSequenceUpdate)
        this.eventBus.off(HotkeyEvents.SequenceExecuted, this.handleSequenceExecuted)
        this.initialized = false
        DevLogger.channel('HotKey').info('HotKey manager destroy.')
    }

    registerMiddleware(middleware): void {
        this.pipelineFactory.register(middleware)
    }

    private handleKeyDown = (event: KeyboardEvent): void => {
        const combo = buildKeyCombo(event)

        const context: HotkeyPipelineContext = {
            event,
            combo,
            interactionId: ++this.interactionId,
            sequence: [],
            sequenceState: "idle",
            sequenceExecutable: null,
            singleExecutable: null,
            executed: false
        }

        void this.pipelineFactory
            .create()
            .send(context)
            .then(async () => undefined)
    }

    private handleSequenceTimeout = (event: IEvent): void => {
        const payload = event.payload as SequenceTimeoutExecutePayload;
        if (payload.interactionId !== this.interactionId) return
        void this.actionInvoker.invoke(payload.executable, {
            combo: "",
            sequence: [],
            interactionId: payload.interactionId
        })
    }

    /**
     * Forward sequence updates to  Hint service (UX)
     */
    private handleSequenceUpdate = (
        event: IEvent
    ): void => {
        const payload = event.payload as SequenceUpdatePayload
        const interactionId = payload.interactionId;
        this.hintService.showHints(payload.sequence)
        DevLogger.channel("Hotkey").info("Show hints called.", {payload, __location__})
    }

    private handleSequenceExecuted = (
        event:IEvent
    ): void => {
        this.hintService.hideHints();
    }
}
