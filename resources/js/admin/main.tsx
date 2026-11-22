import {
    __federation_method_setRemote,
    __federation_method_getRemote,
    __federation_method_unwrapDefault
} from "virtual:__federation__";

import React from 'react'
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import {PersistGate} from 'redux-persist/integration/react'
import {I18nextProvider} from "react-i18next";
import {store, persistor} from "@/core/shared/store";
import App from './App'
import {Spinner, RememberMeHandler} from "@/core/shared/components";
import {i18n} from '@/core/shared/providers';
import {useAppStore} from "@/core/shared/store/useAppStore";

import {Application} from "@/core/platform/application/Application";


// Expose to global scope for core package to use
(window as any).__federation__ = {
    setRemote: __federation_method_setRemote,
    getRemote: __federation_method_getRemote,
    unwrapDefault:__federation_method_unwrapDefault
};
async function startApp() {

    await i18n.changeLanguage('fa')

    // show temporary spinner
    const rootElement = document.getElementById('admin-root')!;
    const root = createRoot(rootElement);
    root.render(<Spinner/>);
    const app=new Application('admin');
    await app.bootstrap();
    useAppStore.getState().setApp(app);

    root.render(
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={<Spinner/>}>
                    <I18nextProvider i18n={i18n}>
                        <RememberMeHandler/>
                       <App/>
                    </I18nextProvider>
            </PersistGate>
        </Provider>
    );
}

//const start=performance.now();
//console.info('App started')
startApp();
//console.info(`App completed in ${performance.now() - start}`)
