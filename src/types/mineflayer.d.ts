import "mineflayer"
import State from "../util/state.js"

declare module "mineflayer" {
    interface Bot {
        index: number;
        email: string;
        uuid: string;
        apiKey: string;
        disabledModules: string[];
        state: State;
        log: (msg: string) => void;
    }
}