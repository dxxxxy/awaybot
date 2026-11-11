import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import path from "path"

//STATS_FILE overrides the location (the Docker image points it into a volume)
//default is relative to the working directory (dist/ when started via npm start, so this resolves to the project root)
const FILE_NAME = process.env.STATS_FILE || "../stats.json"

export default class StatManager {
    private static stats: Record<string, number> = {}

    static init() {
        //if a previous stat file exists, load its key value pairs
        if (!existsSync(FILE_NAME)) return

        try {
            const saved: unknown = JSON.parse(readFileSync(FILE_NAME, "utf8"))
            if (typeof saved !== "object" || saved === null) return

            for (const [key, value] of Object.entries(saved)) {
                if (typeof value === "number") this.stats[key] = value
            }
        } catch (err) {
            console.log(`[StatManager] Could not read ${FILE_NAME}, starting from scratch:`, err)
        }
    }

    static register(key: string) {
        //avoid resetting keys that are already known (e.g. loaded from file or registered by another bot)
        if (key in this.stats) return

        this.stats[key] = 0
        this.save()
    }

    static get(key: string) {
        return this.stats[key] ?? 0
    }

    //adds amount to a stat, persists all stats and returns the new total
    static add(key: string, amount: number) {
        this.stats[key] = this.get(key) + amount
        this.save()
        return this.stats[key]
    }

    private static save() {
        mkdirSync(path.dirname(FILE_NAME), { recursive: true })
        writeFileSync(FILE_NAME, JSON.stringify(this.stats, null, 4))
    }
}
