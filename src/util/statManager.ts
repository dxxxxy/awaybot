import { existsSync, readFileSync, writeFileSync } from "fs"

const FILE_NAME = "../stats.json"

export default class StatManager {
    static init() {
        //if a previous stat file exists, register and load
        if (existsSync(FILE_NAME)) {
            Object.entries(JSON.parse(readFileSync(FILE_NAME, "utf8"))).forEach(([key, value]) => {
                StatManager.register(key);
                this[key] = value
            })
        }

        console.log("[StatManager] OK")
    }

    static register(key: string) {
        if (this[key]) return
        this[`_${key}`] = this[key] = 0
        Object.defineProperty(this, key, {
            set: (val) => {
                this["_" + key] = val

                const object = Object.entries(this)
                    .filter(([key]) => key.startsWith("_"))
                    .map(([key, value]) => [key.replace("_", ""), value])

                writeFileSync(FILE_NAME, JSON.stringify(Object.fromEntries(object), null, 4))
            },
            get: () => this["_" + key]
        })
    }
}