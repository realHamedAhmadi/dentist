import {useTranslation} from "@/core/shared/hooks/translation/useTranslation";

export function useClientTranslation(signature: string) {
    return useTranslation(`client:${signature}`);
}
