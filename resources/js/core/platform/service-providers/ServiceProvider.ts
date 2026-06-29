import {IApplication} from "@/core/platform/application/types";

export abstract class ServiceProvider {

    constructor(protected app:IApplication) {

    }
    /**
     * Register any application services.
     *
     * @return void
     */
    abstract register():void

    abstract boot?():void
}
