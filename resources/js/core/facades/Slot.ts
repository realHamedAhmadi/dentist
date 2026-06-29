import React from "react";
import { getApp } from "@/core/platform/application/appInstance";
import { SlotRegistry } from "@/core/platform/slot/SlotRegistry";
import {
    ISlotRenderer,
    SlotExtension,
} from "@/core/platform/slot/types";
import {SLOT_RENDERER} from "@/core/platform/tokens/slot";

/**
 * Facade for slot registry and slot rendering operations.
 */
export class Slot {
    /**
     * Resolve the slot registry from the application container.
     */
    private static registry(): SlotRegistry {
        // Resolve the registry from the container to keep lifecycle controlled by DI.
        return getApp().make<SlotRegistry>(SlotRegistry);
    }

    /**
     * Resolve the slot renderer from the application container.
     */
    private static renderer<TProps = Record<string, unknown>>(): ISlotRenderer<TProps, React.ReactNode[]> {
        // Resolve the renderer from the container to keep rendering adapter replaceable.
        return getApp().make<ISlotRenderer<TProps, React.ReactNode[]>>(SLOT_RENDERER);
    }

    /**
     * Register a slot if it does not exist.
     */
    public static register(slotId: string): void {
        // Delegate slot registration to the registry service.
        this.registry().register(slotId);
    }

    /**
     * Add or override an extension in a slot.
     */
    public static extend(slotId: string, extension: SlotExtension): void {
        // Delegate extension registration to the registry service.
        this.registry().extend(slotId, extension);
    }

    /**
     * Return sorted extensions of a slot.
     */
    public static get(slotId: string): SlotExtension[] {
        // Delegate sorted extension retrieval to the registry service.
        return this.registry().get(slotId);
    }

    /**
     * Render a slot as React nodes.
     */
    public static render<TProps = Record<string, unknown>>(
        slotId: string,
        props?: TProps
    ): React.ReactNode[] {
        // Delegate slot rendering to the active renderer adapter.
        return this.renderer<TProps>().render(slotId, props);
    }
}
