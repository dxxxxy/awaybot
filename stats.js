class Stats {
    default = {
        "allowance": 0,
        "interest": 0
    }

    constructor() {
        //create file if it doesnt exist
        if (!fs.existsSync("stats.json")) fs.writeFileSync("stats.json", JSON.stringify(this.default))

        //fill this object
        Object.entries(JSON.parse(fs.readFileSync("stats.json"))).forEach(([key, value]) => this[key] = value)

        //add what is missing in default
        Object.entries(this.default).forEach(([key, value]) => { if (!this[key]) this[key] = value })
    }

    save() {
        //write
        fs.writeFileSync("stats.json", JSON.stringify(this))
    }
}