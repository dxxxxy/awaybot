# awaybot
A fully-modular mineflayer bot for staying afk in a smart manner on Hypixel Skyblock.

![](https://img.shields.io/docker/image-size/dxxxxy/awaybot/latest?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/pulls/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)
![](https://img.shields.io/docker/stars/dxxxxy/awaybot?style=for-the-badge&color=9cf&logo=docker)

## Features
- Always ensures it is on skyblock and a private/visit island.
- Lightweight in terms of CPU and RAM usage.
- Fully modular and easy to control *(set DISABLED_MODULES in .env)*.
- Logs gains such as coins (allowance, interest) and bits in a JSON file.
- Hibernates/takes-over your place when you leave and gives you control back when you join.
- Colorful and detailed console output *(set FORCE_COLOR=1 if color doesn't show)*.

## Installing
You have two choices.

### 1. Git (clone)
> You are expected to have Node.js installed. If faced with any issues, try using `v18.16.0`.
1. Clone this repo.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in the required values.
4. Run the bot with `npm start` or `npm run pm2-start` (see [pm2](#pm2)).

#### PM2
pm2 is a process manager for Node.js applications and here it is used for the hibernate/take-over feature.
The bot will enter this phase when it gets kicked from the server due to someone else logging in.
It will continuously poll the hypixel api using the api key to check if the player is offline and if so, pm2 will restart the bot, and it will take over the player's place.

Start the bot with `npm run pm2-start` and stop it with `pm2 delete awaybot`.

### 2. Docker 
> You are expected to have Docker installed.

Run the following command, replacing the environment variables from `.example.env` with your own values:
```bash
docker run --name awaybot --pull=always --detach -e EMAIL=x@x.x -e UUID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -e API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx dxxxxy/awaybot
```

Afterward, you can view and follow (`-f`) the logs with `docker logs awaybot -f` to view instructions on how to log into your Minecraft Microsoft Account.

## Disclaimer
This is for educational purposes only. I am not responsible for any damage caused by this tool.

## License
GPLv3 © dxxxxy
