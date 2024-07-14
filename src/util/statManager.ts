import { existsSync, readFileSync, writeFileSync } from "fs"

export default class StatManager {
    static allowance: number = 0
    static interest: number = 0
    static bits: number = 0

    static init() {
        //prefill ghost values
        Object.keys(this).forEach(key => this["_" + key] = this[key])

        //setup get/set hooks for auto save with ghost values
        Object.keys(this).forEach(key => {
            if (key.startsWith("_")) return
            Object.defineProperty(this, key, {
                set: (val) => {
                    this["_" + key] = val

                    //save
                    this.save()
                },
                get: () => this["_" + key]
            })
        })

        //load previous values if they exist
        if (existsSync("stats.json")) Object.entries(this.read()).forEach(([key, value]) => this[key] = value)
    }

    private static read() {
        return JSON.parse(readFileSync("stats.json", "utf8"))
    }

    private static save() {
        const object = Object.entries(this)
            .filter(([key]) => key.startsWith("_"))
            .map(([key, value]) => [key.replace("_", ""), value])

        writeFileSync("stats.json", JSON.stringify(Object.fromEntries(object), null, 4))
    }
}