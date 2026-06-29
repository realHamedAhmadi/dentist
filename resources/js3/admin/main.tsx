import React from 'react'
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import {I18nextProvider} from "react-i18next";
import {store,persistor} from "@/shared/store";
import App from './App'
import {Spinner,RememberMeHandler} from "@/shared/components";
import {i18n} from '@/shared/providers';
import loadConfig from "@/config/configLoader";

i18n.changeLanguage('fa')

createRoot( document.getElementById('admin-root')).render(
    <Provider store={store}>
        <PersistGate persistor={persistor} loading={<Spinner/>}>
            <I18nextProvider i18n={i18n}>
                <RememberMeHandler/>
                <App/>
            </I18nextProvider>
        </PersistGate>
    </Provider>
)
