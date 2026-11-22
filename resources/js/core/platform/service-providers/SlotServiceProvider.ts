import '@/core/libs/reflect-metadata.js';
import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {SlotRegistry} from "@/core/platform/slot/SlotRegistry";
import {ReactSlotRenderer} from "@/core/platform/slot/ReactSlotRenderer";
import {SLOT_RENDERER} from '@/core/platform/tokens/slot'
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";

export class SlotServiceProvider extends ServiceProvider {
    register(): void {
        this.app.singleton(ServiceTokens.SLOT_REGISTRY,SlotRegistry);
        this.app.singleton(SLOT_RENDERER,new ReactSlotRenderer(this.app.make(ServiceTokens.SLOT_REGISTRY)))
    }
}
