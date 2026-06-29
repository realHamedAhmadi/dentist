import {DEV_LOGGER} from "@/core/platform/tokens/logger";
import {Logger} from "@/core/facades/Logger";

export class DevLogger extends Logger {
    protected static getToken() {
        return DEV_LOGGER
    }
}
