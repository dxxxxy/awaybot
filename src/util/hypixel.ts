import { bot } from "./botHandler.js"

export const visitIsland = () => {
    if (!process.env.VISIT_NAME) return bot.chat("/is")

    bot.chat("/visit " + process.env.VISIT_NAME)

    bot.once("windowOpen", window => {
        window.requiresConfirmation = false
        if (window.title == `{"italic":false,"extra":[{"text":"Visit ${process.env.VISIT_NAME}"}],"text":""}`) {
            // noinspection JSIgnoredPromiseFromCall
            bot.clickWindow(11, 0, 0)
        }
    })
}