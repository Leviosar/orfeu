import Winston from "winston"

export class Logger {
    protected songLogger: Winston.Logger
    protected errorLogger: Winston.Logger
    protected commandLogger: Winston.Logger

    protected channels: {
        song: Winston.Logger,
        error: Winston.Logger,
        command: Winston.Logger,
        info: Winston.Logger
    }

    constructor() {
        this.channels = {
            song: Winston.createLogger({
                levels: {
                    song: 0
                },
                transports: [
                    new Winston.transports.File({ filename: "logs/songs.log", level: "song" }),
                ],
                exitOnError: false
            }),

            command: Winston.createLogger({
                levels: {
                    command: 0
                },
                transports: [
                    new Winston.transports.File({ filename: "logs/comma.log", level: "command" }),
                ],
                exitOnError: false
            }),
    
            error: Winston.createLogger({
                level: "error",
                transports: [
                    new Winston.transports.File({ filename: "logs/error.log", level: "error" }),
                ],
                exitOnError: false
            }),
    
            info: Winston.createLogger({
                level: "info",
                transports: [
                    new Winston.transports.File({ filename: "logs/info.log", level: "info" }),
                ],
                exitOnError: false
            })
        }
        
    }

    song(message: string): void {
        this.channels.song.log("song", message)
    }

    command(message: string): void {
        this.channels.command.log("command", message)
    }

    error(message: string): void {
        this.channels.error.log("error", message)
    }

    info(message: string): void {
        this.channels.info.log("info", message)
    }
}

export default new Logger();
