import "mineflayer"
import State from "../util/state.js"

declare module "mineflayer" {
    interface Bot {
        uuid: string;
        apiKey: string;
        state: State;
        log: (msg: string) => void;
    }
}