import {useTranslation} from "@/core/shared/hooks/translation/useTranslation";

export function useCoreTranslation(signature: string) {
    return useTranslation(`core:${signature}`);
}
