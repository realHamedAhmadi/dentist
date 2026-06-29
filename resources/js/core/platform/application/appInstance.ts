import {IApplication} from "@/core/platform/application/types";

let appInstance: IApplication | null = null;

export function setApp(app: IApplication) {
    appInstance = app;
}

export function getApp(): IApplication {
    if (!appInstance) throw new Error("App has not been set");
    return appInstance;
}
