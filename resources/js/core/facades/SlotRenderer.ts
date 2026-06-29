import { Facade } from "@/core/facades/Facade";
import { SLOT_RENDERER } from "@/core/platform/tokens/slot";

export class SlotRenderer extends Facade {

    protected static getToken() {
        return SLOT_RENDERER;
    }

    static render(slotId: string, props?: any) {

        return this.resolve().render(slotId, props);
    }
}
