import {useTranslation} from "@/core/shared/hooks/translation/useTranslation";

export function useAdminTranslation(signature: string) {
    return useTranslation(`admin:${signature}`);
}
