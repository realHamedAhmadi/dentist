import React from "react";

export interface SlotExtension {

    // Unique identifier of the extension inside the slot.
    // Used for conflict detection, replacement, and debugging.
    // Example: "order.menu"
    id: string

    // UI component or handler attached to the slot.
    // For UI slots this is usually a React/Vue component.
    // For non‑UI slots it could be any executable function/module.
    Component?: React.ComponentType<any>

    // Determines visual or logical ordering inside the slot.
    // Lower numbers appear first.
    // Example: order: 10 will render before order: 20.
    order?: number

    // Priority used when resolving conflicts between extensions
    // that share the same id. Higher priority wins.
    // Useful when a plugin wants to override another plugin's extension.
    priority?: number

    // Explicit flag indicating that this extension is allowed
    // to replace an existing extension with the same id.
    // If false and a duplicate id exists, a conflict error is thrown.
    override?: boolean

    // Arbitrary properties passed to the component or handler
    // when the slot is rendered or executed.
    // Useful for configuration or contextual data.
    props?: Record<string, any>

}

export interface ISlotRenderer<TProps = unknown, TOutput = unknown> {
    render(slotId: string, props?: TProps): TOutput;
    supports?(extension: SlotExtension): boolean;
}

type ReactSlotExtension<TProps> = SlotExtension & {
    Component: React.ComponentType<TProps>;
};
