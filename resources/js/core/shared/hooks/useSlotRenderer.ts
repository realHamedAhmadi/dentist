import { useMemo } from "react";
import { getApp } from "@/core/shared/store/useAppStore";
import { SLOT_RENDERER } from "@/core/platform/tokens/slot";
import type { ISlotRenderer } from "@/core/platform/slot/types";

export function useSlotRenderer(): ISlotRenderer {
    const app = getApp();
    return useMemo(() => app.make<ISlotRenderer>(SLOT_RENDERER), [app]);
}
