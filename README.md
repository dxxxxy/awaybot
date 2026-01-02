# awaybot
A fully-modular mineflayer bot for staying AFK in a smart manner on Hypixel Skyblock.

WARNING: Docker remote image is severely out of date.

![](https://img.shields.io/docker/image-size/dxxxxy/awaybot/latest?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/pulls/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/stars/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)

## Features
- Tracks various coin or bits gains.
- Lightweight in terms of CPU and RAM usage.
- Supports multi-account setups out of the box.
- Always ensures the player is on private island.
- Automatically logs any changes to stat variables in a JSON file.
- Fully modular and easy to control (see disabledModules in [Configuration](#configuration)).

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

## Disclaimer
This is for educational purposes only. I am not responsible for any damage caused by this tool.

## License
GPLv3 © dxxxxy
