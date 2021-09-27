import 'dotenv/config'

import { Client } from 'discord.js'
import { handlers } from './commands'

const queues = new Map()

try {
    const client = new Client({})
    
    client.login(process.env.BOT_TOKEN)

    client.once('ready', () => {
        console.log('Ready!')
    })
    
    client.on('message', async message => {
        if(message.author.bot) return
    
        if(!message.content.startsWith(process.env.PREFIX)) return
        
        let valid = false

        for (const command in handlers) {
            if(message.content.startsWith(handlers[command].trigger)) {
                handlers[command].run(message, queues)
                valid = true
            }
        }
        
        if (!valid) {
            message.channel.send('You need to enter a valid command!')
        }
    })
} catch (error) {
    console.log(error)
}
