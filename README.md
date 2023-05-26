# awaybot
A mineflayer bot for staying afk in a smart manner on Hypixel Skyblock.

## Installing

### Git
> You are expected to have Node.js and the typescript package installed globally.
1. Clone this repo.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in the required values.
4. Run the bot with `npm start`.

#### PM2
> If you want the take-over feature to work (and automatic restart on crash), you need to have the pm2 package installed globally.

Run the following command in the cloned directory:
```bash
pm2 start "npm start" --name "awaybot"
```

### Docker 
> You are expected to have Docker installed.

Run the following command, replacing the environment variables with your own values:
```bash
docker run --name awaybot --detach -e EMAIL=example@dreamys.studio -e UUID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -e API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx dxxxxy/awaybot
```

Afterward, you can view the logs with `docker logs awaybot` to view instructions on how to log into your Minecraft Microsoft Account.

## Features
- Always ensures it is on your private island.
- Lightweight in terms of CPU and RAM usage.
- Logs gains such as coins (allowance, interest) and bits in a JSON file.
- Takes over your place when you leave and gives it back when you join.
- Colorful and detailed console output *(set FORCE_COLOR=1 if color doesn't show)*.

## Disclaimer
This is for educational purposes only. I am not responsible for any damage caused by this tool.

## License
GPLv3 © dxxxxy