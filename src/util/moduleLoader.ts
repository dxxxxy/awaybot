import * as fs from "node:fs"
import { Dirent } from "node:fs"
import { oraPromise } from "ora"
import path from "path"
import { importModule } from "../app.js"
import { debug, debugMessage } from "./utils.js"

const { DISABLED_MODULES } = process.env

export default class ModuleLoader {
    static async loadModules() {
        //get all modules
        const modules = this.recursiveReadDirSync("module")

        //get all enabled modules
        const enabledModules = modules.filter(this.excludeDisabledModules)
        debug(`Found ${enabledModules.length}/${modules.length} enabled modules`)

        //load all enabled modules sequentially
        for (const module of enabledModules) {
            await oraPromise(() => importModule(module.parentPath), {
                color: "magenta",
                spinner: "sand",
                text: debugMessage(`Loading module: ${module.name}`),
                successText: debugMessage(`Loaded module: ${module.name}`),
                failText: debugMessage(`Failed to load module: ${module.name}`)
            })
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

    private static excludeDisabledModules(module: Dirent): boolean {
        if (DISABLED_MODULES) return !DISABLED_MODULES.split(",").includes(module.name.split(".")[0])
        return true
    }
}