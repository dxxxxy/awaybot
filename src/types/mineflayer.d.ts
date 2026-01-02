import "mineflayer"
import State from "../util/state.js"

declare module "mineflayer" {
    interface Bot {
        email: string;
        state: State;
        log: (msg: string) => void;
    }
}