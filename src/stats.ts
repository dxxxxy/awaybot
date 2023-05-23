import { existsSync, readFileSync, writeFileSync } from "fs"

export default class Stats {
    static default = {
        "allowance": 0,
        "interest": 0,
        "bits": 0,
    }

    constructor() {
        //create file if it doesn't exist
        if (!existsSync("stats.json")) writeFileSync("stats.json", JSON.stringify(Stats.default))

        //load defaults
        Object.entries(Stats.default).forEach(([key, value]) => { this[key] = value })

        //setup getters & setters for auto save
        Object.keys(this).forEach(key => {
            Object.defineProperty(this, key, {
                set: (val) => {
                    this["_" + key] = val

                    //quick switch
                    const toSave = structuredClone(this)
                    Object.keys(toSave).forEach(key => {
                        if (key.startsWith("_")) {
                            const newKey = key.replace("_", "")
                            toSave[newKey] = toSave[key]
                            delete toSave[key]
                        } else delete toSave[key]
                    })

                    //save
                    writeFileSync("stats.json", JSON.stringify(toSave))
                },
                get: () => this["_" + key]
            })
        })

        //load actual values
        Object.entries(JSON.parse(readFileSync("stats.json", "utf8"))).forEach(([key, value]) => this[key] = value)

        //save
        writeFileSync("stats.json", JSON.stringify(this))
    }
}

export interface IStats {
    allowance?: number
    interest?: number,
    bits?: number
}