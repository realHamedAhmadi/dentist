import {I18nNamespaceLoadFailedPayload} from "@/core/i18n/types";

export const I18N='I18N';

export const I18nEvents={
    I18nLangChanged:'i18n.language.changed',
    I18nNamespaceRegistered:'i18n.namespace.registered',
    I18nNamespaceLoadFailed:'i18n.namespace.loadFailed',
} as const
