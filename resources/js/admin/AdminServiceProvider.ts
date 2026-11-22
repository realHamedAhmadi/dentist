import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";

export default class AdminServiceProvider extends ServiceProvider {
    register(): void {

    }

    async boot() {
        const i18nService=await this.app.make(ServiceTokens.I18N_SERVICE);
        i18nService.registerModuleNamespace({
            module:'admin',
            namespace:'sidebar',
            basePath:'http://localhost:5173/dist/app/admin/1.0.0/'
        })
    }
}
