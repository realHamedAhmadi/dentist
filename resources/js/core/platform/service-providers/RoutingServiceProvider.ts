import {ServiceProvider} from "@/core/platform/service-providers/ServiceProvider";
import str from "@/core/shared/utils/string"
import {Router} from "@/core/platform/router/Router";
import {ServiceTokens} from "@/core/platform/tokens/ServiceToken";

export class RoutingServiceProvider extends ServiceProvider {

    register(): void {
        this.app.singleton(ServiceTokens.ROUTER, Router);
        /*const router = this.app.make(Router);

        const modules = import.meta.glob(
            `@/Plugins/!**!/routes.ts`,
            {eager: true}
        );
        for (const path in modules) {
            // Filter by panel type (admin/client)
            if (!path.includes(`/${this.app.type}/`)) {
                continue;
            }
            // Dynamically import module
            const module: any = modules[path];
            const routes =
                module.default ??
                Object.values(module)[0];
            router.addRoutes(routes)
        }*/
    }

    boot() {

    }
}
