import "dotenv/config"

import BotHandler from "./util/botHandler.js"
import ModuleLoader from "./util/moduleLoader.js"
import StatManager from "./util/statManager.js"

export const importModule = async (path: string) => {
    await import(`./${path.replace(/\\/g, "/")}`)
}

StatManager.init()
BotHandler.start()
ModuleLoader.loadModules()