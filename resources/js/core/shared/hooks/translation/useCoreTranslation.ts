import {useTranslation} from "@/core/shared/hooks/translation/useTranslation";
import {UseTranslationOptions} from "@/core/i18n/types";

export function useCoreTranslation(signature: string,options?:UseTranslationOptions) {
    return useTranslation(`core:${signature}`,options);
}
