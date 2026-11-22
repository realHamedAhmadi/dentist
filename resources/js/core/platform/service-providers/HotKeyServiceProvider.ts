import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {HotkeyContextStack} from "@/core/platform/hotkey/HotkeyContextStack";
import {HotkeyScopeStack} from "@/core/platform/hotkey/HotkeyScopeStack";
import {HotkeyRegistry} from "@/core/platform/hotkey/HotkeyRegistry";
import {DefaultHotkeys} from "@/core/platform/hotkey/DefaultHotkeys";
import {HotkeyManager} from "@/core/platform/hotkey/HotkeyManager";
import {CommandBus} from "@/core/platform/command/CommandBus";
import {HotkeyResolver} from "@/core/platform/hotkey/HotkeyResolver";
import {HotkeySequenceEngine} from "@/core/platform/hotkey/HotkeySequenceEngine";
import {HotkeyRecordingEngine} from "@/core/platform/hotkey/HotkeyRecordingEngine";
import {EventBus} from "@/core/platform/event/EventBus";
import {IgnoreEditableMiddleware} from "@/core/platform/hotkey/middlewares/IgnoreEditableMiddleware";
import {RecordingMiddleware} from "@/core/platform/hotkey/middlewares/RecordingMiddleware";
import {IHotkeyPolicy} from "@/core/platform/hotkey/contracts/HotkeyPolicy";
import {SequenceMiddleware} from "@/core/platform/hotkey/middlewares/SequenceMiddleware";
import {SingleHotkeyMiddleware} from "@/core/platform/hotkey/middlewares/SingleHotkeyMiddleware";
import {ExecuteMiddleware} from "@/core/platform/hotkey/middlewares/ExecuteMiddleware";
import {HotkeyActionInvoker} from "@/core/platform/hotkey/HotkeyActionInvoker";
import {HotkeyHintService} from "@/core/platform/hotkey/HotkeyHintService";
import {HotkeyHintEngine} from "@/core/platform/hotkey/HotkeyHintEngine";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";

export class HotKeyServiceProvider extends ServiceProvider {
    private hotKeyPolicy: IHotkeyPolicy = {
        preventDefaultOnPartial: true,
        preventDefaultOnFull: true,
        preventDefaultOnSingle: true,
        preventDefaultOnRecording: true,
        executeFallbackOnTimeout: true
    }

    register(): void {

        this.app.singleton(HotkeyContextStack,HotkeyContextStack);
        this.app.singleton(HotkeyScopeStack,HotkeyScopeStack);
        this.app.singleton(HotkeyActionInvoker,()=>
            new HotkeyActionInvoker(
                this.app.make(ServiceTokens.COMMAND_BUS),
                this.app.make(ServiceTokens.EVENT_BUS),
                this.app
            )
        )
        this.app.singleton(HotkeyRegistry,()=>new HotkeyRegistry());
        this.app.make(HotkeyRegistry).load(DefaultHotkeys);
        this.app.singleton(HotkeyHintService,()=>
            new HotkeyHintService(
                new HotkeyHintEngine(this.app.make(HotkeyRegistry)),
                this.app.make(ServiceTokens.EVENT_BUS)
            )
        )
        this.app.singleton(HotkeyResolver,()=>
            new HotkeyResolver(this.app.make(HotkeyRegistry))
        )
        this.app.singleton(HotkeySequenceEngine,()=>
            new HotkeySequenceEngine(
                this.app.make(HotkeyRegistry),
                this.app.make(ServiceTokens.EVENT_BUS)
            )
        );
        this.app.singleton(HotkeyRecordingEngine,()=>
            new HotkeyRecordingEngine(
                this.app.make(ServiceTokens.EVENT_BUS)
            )
        );
        this.app.singleton(HotkeyManager,()=>{
            const manager=new HotkeyManager(
                this.app.make(ServiceTokens.EVENT_BUS),
                this.app.make(ServiceTokens.PIPELINE_FACTORY),
                this.app.make(HotkeyActionInvoker),
                this.app.make(HotkeyHintService),
            )
            this.setMiddlewares(manager)
            return manager;
        });
        this.app.make(HotkeyManager).init();
    }

    setMiddlewares(manager: HotkeyManager) {
        manager.registerMiddleware(new IgnoreEditableMiddleware())
        manager.registerMiddleware(
            new RecordingMiddleware(
                this.app.make(HotkeyRecordingEngine),
                this.app.make(HotkeySequenceEngine),
                this.hotKeyPolicy
            )
        )
        manager.registerMiddleware(
            new SequenceMiddleware(this.app.make(HotkeySequenceEngine), this.hotKeyPolicy)
        )
        manager.registerMiddleware(
            new SingleHotkeyMiddleware(
                this.app.make(HotkeyResolver),
                this.app.make(HotkeyContextStack),
                this.app.make(HotkeyScopeStack),
                this.hotKeyPolicy
            )
        )
        manager.registerMiddleware(
            new ExecuteMiddleware(this.app.make(HotkeyActionInvoker))
        )
    }

}
