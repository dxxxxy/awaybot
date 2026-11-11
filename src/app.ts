import { readFileSync } from "fs"
import { start } from "./bot.js"
import StatManager from "./util/statManager.js"

interface AccountConfig {
    email: string
    uuid: string
    apiKey?: string
    disabledModules?: string[]
    disabled?: boolean
}

StatManager.init()

const accounts: AccountConfig[] = JSON.parse(readFileSync("accounts.json", "utf8"))

for (const [index, account] of accounts.entries()) {
    if (account.disabled) continue

    start(index, {
        email: account.email,
        uuid: account.uuid,
        apiKey: account.apiKey ?? "",
        disabledModules: account.disabledModules ?? []
    })
}
