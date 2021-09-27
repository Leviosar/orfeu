import 'dotenv/config'

import { Client } from 'discord.js'
import { ExecuteCommand } from './commands/execute'
import { SkipCommand } from './commands/skip'
import { LeaveCommand } from './commands/leave'
import { StopCommand } from './commands/stop'
import { QueueCommand } from './commands/queue'
import { BaseCommand } from './commands/base/base-command'

const queues = new Map()

const commands: BaseCommand[] = [
    new ExecuteCommand(),
    new SkipCommand(),
    new LeaveCommand(),
    new StopCommand(),
    new QueueCommand()
]

try {
    const client = new Client({intents: []})
    
    client.login(process.env.BOT_TOKEN)

    client.once('ready', () => {
        console.log('Ready!')
    })
    
    client.on('message', async message => {
        if(message.author.bot) return
    
        if(!message.content.startsWith(process.env.PREFIX)) return
        
        let valid = false

        for (const command of commands) {
            if(message.content.startsWith(command.trigger)) {
                command.run(message, queues)
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
