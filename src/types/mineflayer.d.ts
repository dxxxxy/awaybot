import "mineflayer"

declare module "mineflayer" {
    interface Bot {
        inSkyblock: boolean;
        inIsland: boolean;
        online: boolean;
        log: (msg: string) => void;
    }
}