import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {Router} from "@app/core";

import routes from "@/plugins/client/admin/routes";
import {clientAdminSidebar} from "@/plugins/client/admin/extensions/clientAdminSidebar";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";

export default class PluginAdminServiceProvider extends ServiceProvider {
    register(): void {

    }

    async boot() {
        Router.addRoutes(routes)
        this.app.make(ServiceTokens.SLOT_REGISTRY).extend('admin.sidebar',clientAdminSidebar)

        this.app.make(ServiceTokens.COMMAND_BUS).register('entity.create',()=>{
            console.log('command is handler..........................................')
        })

        const i18nService=await this.app.make(ServiceTokens.I18N_SERVICE);
        i18nService.registerModuleNamespace({
            module:'admin@client',
            namespace:'sidebar',
            basePath:'http://localhost:8000/dist/plugins/client/admin/1.0.0/'
        })
    }
}
