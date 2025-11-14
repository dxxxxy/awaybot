# awaybot
A fully-modular mineflayer bot for staying afk in a smart manner on Hypixel Skyblock.

WARNING: Docker remote image is severely out of date.

![](https://img.shields.io/docker/image-size/dxxxxy/awaybot/latest?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/pulls/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/stars/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)

## Features
- Always ensures it is on private island.
- Lightweight in terms of CPU and RAM usage.
- Fully modular and easy to control *(set DISABLED_MODULES in .env)*.
- Automatically logs any changes to stat variables in a JSON file.

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
            <td rowspan=1>Presence</td>
            <td>Hibernate</td>
            <td>Joins the server when the user leaves and leaves the server when the user joins.</td>
        </tr>
        <tr>
            <td rowspan=3>Tracking</td>
            <td>Allowance</td>
            <td>Tracks daily coin allowance gains.</td>
        </tr>
        <tr>
            <td>Bits</td>
            <td>Tracks bit gains.</td>
        </tr>
        <tr>
            <td>Interest</td>
            <td>Tracks bank interest gains.</td>
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

## Docker
Run the following command, replacing the environment variables from `.example.env` with your own values:

```bash
docker run --name awaybot --pull=always --detach -e EMAIL=x@x.x -e UUID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -e API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx dxxxxy/awaybot
```

Afterward, you can view and follow (`-f`) the logs with `docker logs awaybot -f` to view instructions on how to log into your Minecraft Account.

## Disclaimer
This is for educational purposes only. I am not responsible for any damage caused by this tool.

## License
GPLv3 © dxxxxy
