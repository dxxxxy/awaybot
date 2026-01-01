import { existsSync, readFileSync, writeFileSync } from "fs"

const FILE_NAME = "../stats.json"

export default class StatManager {
    static init() {
        //if a previous stat file exists, register key value pairs
        if (existsSync(FILE_NAME)) {
            Object.entries(JSON.parse(readFileSync(FILE_NAME, "utf8"))).forEach(([key, value]) => StatManager.register(key, value))
        }
    }

    static register(key: string, value: any = 0) {
        //avoid reregistering keys
        if (this[key]) return

        //setup variables (the ghost _variable stores the actual value, while the real variable is the custom getter/setter)
        this[`_${key}`] = this[key] = value

        //define getter and setter
        Object.defineProperty(this, key, {
            set: (val) => {
                //update ghost value
                this["_" + key] = val

                //create object with ghost keys stripped of _ to reflect real stat names
                const object = Object.entries(this)
                    .filter(([key]) => key.startsWith("_"))
                    .map(([key, value]) => [key.replace("_", ""), value])

                //write object with all stats to file
                writeFileSync(FILE_NAME, JSON.stringify(Object.fromEntries(object), null, 4))
            },
            get: () => this["_" + key]
        })
    }
}