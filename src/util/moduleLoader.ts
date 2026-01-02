import { Bot } from "mineflayer"
import * as fs from "node:fs"
import { Dirent } from "node:fs"
import path from "path"

export default class ModuleLoader {
    static async loadModules(bot: Bot, disabledModuleNames: string[]) {
        //get all modules
        const modules = this.recursiveReadDirSync("module")

        //get all disabled modules from env variable
        const disabledModules = modules.filter(module => disabledModuleNames.includes(module.name.split(".")[0]))

        console.log(`[ModuleLoader] Disabling modules: ${disabledModules.map(module => module.name).join(", ")}`)

        //get all enabled modules by subtracting disabled modules from all modules
        const enabledModules = modules.filter(module => !disabledModules.includes(module))

        //import and validate modules
        const validModules: Dirent[] = []
        for (const module of enabledModules) {
            const mod = await import(`../${module.parentPath}`)
            if (!mod.default) continue
            if (typeof mod.default !== "function" || mod.default.prototype) continue
            validModules.push(module)
        }

        console.log(`[ModuleLoader] Enabling modules: ${validModules.map(module => module.name).join(", ")}`)

        //load all valid modules sequentially
        for (const module of validModules) {
            const mod = await import(`../${module.parentPath}`)
            mod.default(bot)
        }
    }

    private static recursiveReadDirSync(dirPath: string) {
        const dirEntries: Dirent[] = []

        fs.readdirSync(dirPath, { withFileTypes: true }).forEach(file => {
            //avoid symbolic links to prevent infinite loops
            if (file.isSymbolicLink()) return

            else if (file.isDirectory()) dirEntries.push(...this.recursiveReadDirSync(path.join(dirPath, file.name)))
            else if (file.isFile()) {
                file.parentPath = path.join(dirPath, file.name)
                dirEntries.push(file)
            }
        })

        return dirEntries
    }
}