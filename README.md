# awaybot
A fully-modular mineflayer bot for staying AFK in a smart manner on Hypixel Skyblock.

> Note: This project now uses a patched version of mineflayer to be compatible with Hypixel on 26.1. You have nothing to do, the patches apply when you install dependencies. See [patches](#patches).

[![](https://img.shields.io/github/v/tag/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=github&label=version)](https://github.com/dxxxxy/awaybot/pkgs/container/awaybot)
[![](https://img.shields.io/github/actions/workflow/status/dxxxxy/awaybot/release.yml?style=for-the-badge&color=9cf&logo=docker&label=image)](https://github.com/dxxxxy/awaybot/actions/workflows/release.yml)
[![Discord](https://img.shields.io/discord/1197794960985043034?style=for-the-badge&label=Discord&color=rgb(88%2C%20101%2C%20242)%20)](https://discord.gg/aBkBCBtFVQ)

## Features
- Tracks various coin or bits gains.
- Lightweight in terms of CPU and RAM usage.
- Supports multi-account setups out of the box.
- Always ensures the player is on private island.
- Automatically logs any changes to stat variables in a JSON file.
- Fully modular and easy to control (see *disabledModules* in [Configuration](#configuration)).
- Visualization of the bot's world is available at http://localhost:3007 (incremented by 1 for each account beyond the first) for debugging purposes.

## Modules
<table>
    <thead>
        <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=2>Presence</td>
            <td>Stay</td>
            <td>Ensures the bot is always in Skyblock on the Private Island.</td>
        </tr>
        <tr>
            <td>Hibernate (requires apiKey)</td>
            <td>Joins the server when the user leaves and leaves the server when the user joins.</td>
        </tr>
        <tr>
            <td rowspan=4>Tracking</td>
            <td>Allowance</td>
            <td>Tracks daily allowance coin gains.</td>
        </tr>
        <tr>
            <td>Bits</td>
            <td>Tracks bit gains.</td>
        </tr>
        <tr>
            <td>Interest</td>
            <td>Tracks bank interest coin gains.</td>
        </tr>
        <tr>
            <td>Fundraising</td>
            <td>Tracks fundraising coin gains.</td>
        </tr>
    </tbody>
</table>

### More Modules
You can create your own modules by creating a new TypeScript file in the `module/` directory. The module loader will run the following function with the bot instance as a parameter:
```
export default (bot: Bot) => {
    // Your code here
}
```

## Configuration
You can configure the bot by creating an `accounts.json` file in the root directory. The file should contain an array of account objects with the following properties:
```json
[
    {
        "email": "xxx@xxx.xxx",
        "uuid": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "apiKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "disabledModules": [
            "hibernate"
        ]
    },
    {
        "email": "xxx@xxx.xxx",
        "uuid": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "apiKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "disabledModules": []
    }
]
```
> You can disable an account by adding `"disabled": true` to the account object.

## Docker
You can run the bot using Docker provided you have created an `accounts.json` configuration file in the repository you are executing the command. 
The image is published to the GitHub Container Registry for `linux/amd64` and `linux/arm64`.

```shell
docker run --name awaybot --pull=always --detach -v ${pwd}/accounts.json:/awaybot/accounts.json:ro -v awaybot-data:/awaybot/data ghcr.io/dxxxxy/awaybot
```
> Note: the image used to be published as `dxxxxy/awaybot` on Docker Hub, which is no longer updated.

> Note: docker volume mounts require absolute path. Adjust `${pwd}`, default for powershell,  accordingly for your OS.

The `awaybot-data` volume keeps the tracked stats (`stats.json`) and the Microsoft login tokens, so they survive updating or recreating the container.
Outside Docker, the locations can be changed with the `STATS_FILE` and `AUTH_CACHE_DIR` environment variables.

Afterward, you can view and follow (`-f`) the logs with `docker logs awaybot -f` to view instructions on how to log into your Minecraft Account.

## Patches
- `mineflayer`: fixes resource pack responses being sent with an all-zero UUID (mineflayer passes a `uuid-1345` object to a serializer expecting a string).

Hypixel Skyblock servers send a resource pack while transferring and hold the configuration phase open until that exact pack is acknowledged, so without this the bot hangs on `/play sb` until the server closes the connection.
Patch answers with the UUID string the server sent.

The same patch adds two behaviours of the vanilla client that mineflayer is missing: a `client_tick_end` packet at the end of every client tick (sent by vanilla since 1.21.2; minecraft-data already flags it as `sendsClientTickEndPacket`), and answering server pings at the start of the next client tick instead of immediately, as vanilla does.
Without them, Hypixel's Skyblock servers remove the bot about 20 seconds after it arrives ("We have detected badly behaving modifications being used on your account").

- `minecraft-protocol`: no longer patched. The configuration handshake fix (https://github.com/PrismarineJS/mineflayer/issues/3623) is included upstream since `minecraft-protocol@1.68.0`.

- `prismarine-nbt`: https://github.com/PrismarineJS/mineflayer/issues/3787#issue-3731375650

Fixes an issue in the nbt parsing of custom/invalid tags on custom servers like Hypixel which causes the bot to crash.
Patch ignores the custom/invalid tags.

## Disclaimer
This is for educational purposes only. I am not responsible for any damage caused by this tool.

## License
GPLv3 © dxxxxy
