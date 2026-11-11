import { EventEmitter } from "events"
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
        //added by prismarine-viewer once the viewer is started
        viewer?: EventEmitter & { close: () => void };
    }
}
