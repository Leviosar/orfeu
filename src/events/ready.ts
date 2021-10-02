import { Client } from "discord.js";
import BotEvent from "../models/bot-event";

export default {
    name: 'ready',
    once: true,
    execute (client: Client) {
        console.log(`Ready! Logged in as ${client.user.tag}`)
    }
} as BotEvent