import pino from 'pino'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

class Logger{
    constructor(options){
        this.options = options
    }

    getLogger(file = null){
        if (file) {
            return pino(this.options, pino.destination(`${__dirname}/${file}`))
        }
        return(pino(this.options))
    }
}

export default Logger