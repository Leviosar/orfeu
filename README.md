# Orfeu

Discord music bot built with JS

# Usage

## Install dependencies

First you'll need to install FFmpeg for audio streaming, you can get official distributions at their [website](https://www.ffmpeg.org).

Now, you can install npm dependencies:

```
npm install
```

## Creating a bot inside Discord

There are many tutorials on how you can create a Discord application, I'll link one [here](https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/) but you can use any tutorial. The important is to get the bot's token and make the bot join your server with Discord's oAuth2 flux.

## Enviroment variables

This project uses [dotenv](https://www.npmjs.com/package/dotenv) to manage environment variables, check the `.env.example` file and fill all variables on a new `.env` file.

## Running

Since there's no open connection with the bot's server, you can run it in a machine without public IP. All you need to do is run the `npm run start` command.

# Commands

## Play

Plays a song in the user's current voice channel. For now we support only URL search.

`!play [video_url]`

## Stop

`!stop`

Stop the queue.

## Skip

`!skip`

Skips current song.