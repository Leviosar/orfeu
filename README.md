<style>
    div.logo-wrapper {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.logo-wrapper > img {
        height: 150px;
    }
</style>

<div class="logo-wrapper">
    <img src="./src/assets/icon_letters.png">
</div>

Discord music bot built with Typescript and greek fire.

## Usage

### Installing dependencies

First you'll need to install FFmpeg for audio streaming, you can get official distributions at their [website](https://www.ffmpeg.org).

Now, you can install npm dependencies:

```
npm install
```

### Creating a bot inside Discord

There are many tutorials on how you can create a Discord application, I'll link one [here](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) but you can use any tutorial. The important is to get the bot's token and make the bot join your server with Discord's oAuth2 flux.

### Setting enviroment variables

This project uses [dotenv](https://www.npmjs.com/package/dotenv) to manage environment variables, check the `.env.example` file and fill all variables on a new `.env` file.

### Running the bot

Since there's no open connection with the bot's server, you can run it in a machine without public IP. All you need to do is run the `npm run start` command. If you wish to run it in background, you can use a `&` after the command. However, i recommend you to use a process manager, i'm using [pm2](https://pm2.keymetrics.io) but any other will do just fine.

## Commands

| Name  | Usage                       | Description                                       |
| ----- | --------------------------- | ------------------------------------------------- |
| Play  | `!play [query / video_url]` | Plays a song in the user's current voice channel. |
| Stop  | `!stop`                     | Stop the queue.                                   |
| Skip  | `!skip`                     | Skips current song.                               |
| Queue | `!queue`                    | Display current queue.                            |
| Leave | `!leave`                    | Orfeu will leave the channel.                     |