import { ServiceProvider } from "./ServiceProvider";
import { IApplication } from "@/core/platform/application/types";

/**
 * Service provider class constructor type
 */
export type ServiceProviderConstructor =
    new (app: IApplication) => ServiceProvider;
