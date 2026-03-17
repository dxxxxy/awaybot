# awaybot
A fully-modular mineflayer bot for staying AFK in a smart manner on Hypixel Skyblock.

> Note: This project now uses a patched version of mineflayer to be compatible with Hypixel on 1.21+. You have nothing to do, the patches apply when you install dependencies. See [patches](#patches).

![](https://img.shields.io/docker/image-size/dxxxxy/awaybot/latest?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/pulls/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/stars/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)
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

```shell
docker run --name awaybot --pull=always --detach -v ${pwd}/accounts.json:/awaybot/accounts.json:ro dxxxxy/awaybot
```
> Note: docker volume mounts require absolute path. Adjust `${pwd}`, default for powershell,  accordingly for your OS.

Afterward, you can view and follow (`-f`) the logs with `docker logs awaybot -f` to view instructions on how to log into your Minecraft Account.

## Patches
- `minecraft-protocol`: https://github.com/PrismarineJS/mineflayer/issues/3623#issuecomment-2816938153

Fixes an issue in the configuration handshake on custom servers like Hypixel which causes the bot to not be able to connect.
Patch sends a manual configuration packet.

- `prismarine-nbt`: https://github.com/PrismarineJS/mineflayer/issues/3787#issue-3731375650

Fixes an issue in the nbt parsing of custom/invalid tags on custom servers like Hypixel which causes the bot to crash.
Patch ignores the custom/invalid tags.

## Disclaimer
This is for educational purposes only. I am not responsible for any damage caused by this tool.

## License
GPLv3 © dxxxxy
