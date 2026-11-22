import {useTranslation} from "@/core/shared/hooks/translation/useTranslation";
import {UseTranslationOptions} from "@/core/i18n/types";

export function usePluginTranslation(signature: string, options?:UseTranslationOptions) {
    return useTranslation(`admin@client:${signature}`,options);
}
