import i18n,{InitOptions} from "i18next";

import {initReactI18next} from "react-i18next";
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const options:InitOptions={
    fallbackLng:'en',
    debug:true,
    supportedLngs:['en','fa'],
    load:'languageOnly',
    defaultNs:'common',
    ns:['common'],
    interpolation:{
        escapeValue:false //react already escapes
    },
    backend:{
        loadPath:'/locales/{{lng}}/{{ns}}.json'
    },
    detection:{
        order:['localStorage','navigator'],
        caches:['localStorage']
    }
}
i18n.use(HttpBackend).use(LanguageDetector).use(initReactI18next).init(options)

export default i18n
