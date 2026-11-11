import { Bot } from "mineflayer"
import { readdirSync } from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

//resolved relative to this file (dist/util/) rather than the working directory
const MODULE_DIR = path.join(import.meta.dirname, "..", "module")

type ModuleEntry = (bot: Bot) => unknown

interface LoadedModule {
    name: string
    run: ModuleEntry
}

export default class ModuleLoader {
    static async loadModules(bot: Bot) {
        //get all module files (recursive readdir does not follow symbolic links)
        const files = readdirSync(MODULE_DIR, { withFileTypes: true, recursive: true })
            .filter(file => file.isFile() && file.name.endsWith(".js"))

        //get all disabled modules
        const isDisabled = (fileName: string) => bot.disabledModules.includes(fileName.split(".")[0])
        console.log(`[ModuleLoader] Disabling modules: ${files.filter(file => isDisabled(file.name)).map(file => file.name).join(", ")}`)

        //validate enabled modules
        const validModules: LoadedModule[] = []
        for (const file of files) {
            if (isDisabled(file.name)) continue

            const mod = await import(pathToFileURL(path.join(file.parentPath, file.name)).href)

            //skip modules without a default export function (e.g. helpers like simpleChatTracker), or exporting a class
            if (typeof mod.default !== "function" || /^class\s/.test(Function.prototype.toString.call(mod.default))) continue

            validModules.push({ name: file.name, run: mod.default })
        }

        console.log(`[ModuleLoader] Enabling modules: ${validModules.map(module => module.name).join(", ")}`)

        //start all valid modules sequentially (not awaited, as modules like stay run for the bot's whole lifetime)
        for (const module of validModules) {
            Promise.resolve()
                .then(() => module.run(bot))
                .catch(err => bot.log(`Module ${module.name} failed: ${err instanceof Error ? err.stack : err}`))
        }
    }
}
