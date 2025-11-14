import { Bot } from "mineflayer"
import * as fs from "node:fs"
import { Dirent } from "node:fs"
import path from "path"

const disabledModules = process.env.DISABLED_MODULES

export default class ModuleLoader {
    static async loadModules(bot: Bot) {
        //get all modules
        const modules = this.recursiveReadDirSync("module")

        //get all enabled modules
        const enabledModules = modules.filter(module => {
            if (disabledModules) return !disabledModules.split(",").includes(module.name.split(".")[0])
            return true
        })
        console.log(`[ModuleLoader] Found ${enabledModules.length}/${modules.length} enabled modules`)

        //load all enabled modules sequentially
        for (const module of enabledModules) {
            const mod = await import(`../${module.parentPath}`)
            if (!mod.default) {
                console.warn(`[ModuleLoader:${module.name}] Module has no default export! Skipping...`)
                continue
            }
            mod.default(bot)
            console.log(`[ModuleLoader:${module.name}] OK`)
        }
    }

    private static recursiveReadDirSync(dirPath: string) {
        const dirEntries = Array.of<Dirent>()

        fs.readdirSync(dirPath, { withFileTypes: true }).forEach(file => {
            if (file.isDirectory()) dirEntries.push(...this.recursiveReadDirSync(path.join(dirPath, file.name)))
            if (file.isFile()) {
                file.parentPath = path.join(dirPath, file.name)
                dirEntries.push(file)
            }
        })

        return dirEntries
    }
}