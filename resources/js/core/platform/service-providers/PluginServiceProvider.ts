import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import str from "@/core/shared/utils/string"

export class PluginServiceProvider extends ServiceProvider {

     async register(): Promise<void> {
         //await this.discovery();
        const modules = import.meta.glob(
            `@/plugins/**/Plugin*ServiceProvider.ts`,
            { eager: true }
        );
        for (const path in modules) {
            // Filter by panel type (admin/client)
            if (!path.includes(`/${this.app.type}/`)) {
                continue;
            }
            // Dynamically import module
            const module: any = modules[path];
            const provider =
                module.default ??
                Object.values(module)[0];
            this.app.register(provider);
        }

        //await this.app.plugins.bootPlugins('eager');
    }

    protected async discovery() {
         const plugins=[];

         const manifest={}
         for (const plugin in plugins){
             this.app.plugins.register(manifest);
         }
    }
}
