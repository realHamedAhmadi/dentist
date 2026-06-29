import {CommandBus} from "@/core/platform/command/CommandBus"
import {buildKeyCombo} from "./KeyCombo"
import {HotkeyResolver} from "./HotkeyResolver"
import {HotkeySequenceEngine} from "./HotkeySequenceEngine"
import {HotkeyContextStack} from "./HotkeyContextStack"
import {HotkeyScopeStack} from "./HotkeyScopeStack"
import {HotkeyRecordingEngine} from "@/core/platform/hotkey/HotkeyRecordingEngine"
import {DevLogger} from "@/core/facades/DevLogger"
import {EventBus} from "@/core/platform/event/EventBus"
import {HotkeyEvents} from "@/core/platform/tokens/hotkey"
import {IEvent} from "@/core/platform/event/Event";

/**
 * Central keyboard hotkey manager
 *
 * Responsibilities:
 * - capture global keyboard events
 * - delegate to sequence engine
 * - delegate to resolver
 * - handle recording mode
 * - dispatch commands via CommandBus
 */
export class HotkeyManager {

    private initialized = false

    constructor(
        private readonly commandBus: CommandBus,
        private readonly eventBus: EventBus,
        private readonly contextStack: HotkeyContextStack,
        private readonly scopeStack: HotkeyScopeStack,
        private readonly sequenceEngine: HotkeySequenceEngine,
        private readonly recordingEngine: HotkeyRecordingEngine,
        private readonly resolver: HotkeyResolver,
    ) {
    }

    /**
     * Initialize keyboard listeners and event subscriptions
     */
    init(): void {

        if (this.initialized) return

        window.addEventListener("keydown", this.handleKeyDown)

        // Subscribe to internal event bus events
        this.eventBus.on(
            HotkeyEvents.SequenceTimeoutExecute,
            this.handleSequenceTimeout
        )

        this.eventBus.on(
            HotkeyEvents.SequenceUpdate,
            this.handleSequenceUpdate
        )

        DevLogger.channel("Core").info("Hot key manager is initialized...")

        this.initialized = true

    }

    /**
     * Cleanup listeners
     */
    destroy(): void {

        if (!this.initialized) return

        window.removeEventListener("keydown", this.handleKeyDown)

        this.eventBus.off(
            HotkeyEvents.SequenceTimeoutExecute,
            this.handleSequenceTimeout
        )

        this.eventBus.off(
            HotkeyEvents.SequenceUpdate,
            this.handleSequenceUpdate
        )

        DevLogger.channel("Core").warn("Hot key manager destroyed.")

        this.initialized = false

    }

    /**
     * Main keyboard pipeline
     */
    private handleKeyDown = (event: KeyboardEvent): void => {

        if (this.shouldIgnoreEvent(event)) return
        //this.startRecording();
        const combo = buildKeyCombo(event)

        // Step 1: let sequence engine process it
        const sequenceCommand = this.sequenceEngine.handle(combo)

        // Step 2: if recording mode active → stop pipeline here
        if (this.handleRecordingMode(event)) return

        // Step 3: if sequence resolved command → execute
        if (sequenceCommand) {

            this.executeCommand(event, sequenceCommand)
            return

        }

        // Step 4: fallback to single hotkey resolver
        const resolvedCommand = this.resolveSingle(combo)

        if (!resolvedCommand) return

        this.executeCommand(event, resolvedCommand)

    }

    /**
     * Handle recording mode logic
     */
    private handleRecordingMode(event: KeyboardEvent): boolean {

        if (!this.recordingEngine.isRecording()) return false

        event.preventDefault()

        this.recordingEngine.recordStep(
            this.sequenceEngine.getCurrentSequence()
        )

        return true

    }

    /**
     * Resolve single hotkey (non-sequence)
     */
    private resolveSingle(combo: string): string | null {

        return this.resolver.resolve(
            combo,
            this.contextStack.getStack(),
            this.scopeStack.getStack()
        )

    }

    /**
     * Execute command safely
     */
    private executeCommand(
        event: KeyboardEvent,
        command: string
    ): void {

        event.preventDefault()

        this.commandBus.execute(command)

    }

    /**
     * Handle delayed execution from sequence engine
     */
    private handleSequenceTimeout = (
        event: IEvent
    ): void => {

        const command = event.payload as string;
        if (!command) return

        this.commandBus.execute(command)

        DevLogger.channel("Hotkey")
            .debug(`Command "${command}" executed from sequence timeout.`, __location__)

    }

    /**
     * Forward sequence updates to recording engine (UX)
     */
    private handleSequenceUpdate = (
        event: IEvent
    ): void => {
        const sequence = event.payload as []
        this.recordingEngine.showHints(sequence)

        DevLogger.channel("Hotkey")
            .info("Show hints called.", {sequence, __location__})

    }

    /**
     * Determine if keyboard event should be ignored
     */
    private shouldIgnoreEvent(event: KeyboardEvent): boolean {

        const target = event.target as HTMLElement | null

        if (!target) return false

        const tag = target.tagName

        return (
            tag === "INPUT" ||
            tag === "TEXTAREA" ||
            target.isContentEditable
        )

    }

    /**
     * Start shortcut recording mode
     */
    startRecording(): void {

        this.recordingEngine.startRecording()

    }
}
