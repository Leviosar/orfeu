import 'dotenv/config'

import { Client, Intents } from 'discord.js'
import ReadyEvent from './events/ready.js'
import MessageEvent from './events/message.js'
import BotEvent from './models/bot-event.js'

const events = [
    ReadyEvent,
    MessageEvent
] as BotEvent[]

try {
    const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]})
    
    await client.login(process.env.BOT_TOKEN)

    for (const event of events) {
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }

        console.log(`Event ${event.name} was registered`)
    }
} catch (error) {
    console.log(error)
}
