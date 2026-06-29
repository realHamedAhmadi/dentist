import React from "react";
import { SlotRegistry } from "@/core/platform/slot/SlotRegistry";
import { ISlotRenderer, ReactSlotExtension } from "@/core/platform/slot/types";

/**
 * React adapter for slot rendering.
 */
export class ReactSlotRenderer<TProps = Record<string, unknown>>
    implements ISlotRenderer<TProps, React.ReactNode[]> {

    constructor(private readonly registry: SlotRegistry) {}

    /**
     * Render a slot as an array of React nodes.
     */
    render(slotId: string, props?: TProps): React.ReactNode[] {
        return this.registry.get(slotId).map((ext) => {
            const extension = ext as ReactSlotExtension<TProps>;

            return React.createElement(extension.Component, {
                key: extension.id,
                ...props,
            });
        });
    }
}
