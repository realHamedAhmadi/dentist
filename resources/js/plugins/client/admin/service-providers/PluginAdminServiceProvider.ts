import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {Router} from "@/core/facades/Router";
import routes from "@/plugins/client/admin/routes";
import {SlotRegistry} from "@/core/platform/slot/SlotRegistry";
import {clientAdminSidebar} from "@/plugins/client/admin/extensions/clientAdminSidebar";
import {CommandBus} from "@/core/platform/command/CommandBus";
import {I18nService} from "@/core/i18n/I18nService";

export default class PluginAdminServiceProvider extends ServiceProvider {
    register(): void {

    }

    async boot() {
        console.log(SlotRegistry,CommandBus,I18nService)
        Router.addRoutes(routes)
        this.app.make(SlotRegistry).extend('admin.sidebar',clientAdminSidebar)

        this.app.make(CommandBus).register('entity.create',()=>{
            console.log('command is handler..........................................')
        })
        const i18nService=await this.app.make(I18nService);
        i18nService.registerModuleNamespace({
            module:'client',
            namespace:'common',
            basePath:'http://localhost:5173/dist/app/1.0.0/'
        })
    }
}
