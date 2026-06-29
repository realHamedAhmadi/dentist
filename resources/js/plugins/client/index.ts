import { PluginContext } from "@core/platform/plugin/PluginContext"
import {Plugin} from "@core/platform/plugin/types";

export default class ClientPlugin implements Plugin{

    setup(ctx: PluginContext) {

        console.log("order plugin activated")

    }

    start(ctx: PluginContext){

    }

}
