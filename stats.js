const fs = require("fs")

module.exports = class Stats {
    static default = {
        "allowance": 0,
        "interest": 0
    }

    constructor() {
        //create file if it doesnt exist
        if (!fs.existsSync("stats.json")) fs.writeFileSync("stats.json", JSON.stringify(Stats.default))

        //fill this object
        Object.entries(JSON.parse(fs.readFileSync("stats.json"))).forEach(([key, value]) => this[key] = value)

        //add what is missing in default
        Object.entries(Stats.default).forEach(([key, value]) => { if (!this[key]) this[key] = value })

        //setup save hooks
        Object.keys(this).forEach(key => {
            Object.defineProperty(this, key, {
                set: (val) => {
                    this["_" + key] = val

                    //remove hook values
                    const toSave = structuredClone(this)
                    Object.keys(toSave).forEach(key => { if (key.startsWith("_")) delete toSave[key] })

                    //save
                    fs.writeFileSync("stats.json", JSON.stringify(toSave))
                },
                get: () => this["_" + key]
            })
        })
    }
}