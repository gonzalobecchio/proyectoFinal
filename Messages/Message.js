import * as dotenv from 'dotenv'
dotenv.config()

import twilio from 'twilio'
// const client = twilio('AC3fc30dcfcd8c407d5bd7d2fb62a7978e', '89446e7d98e4e9cd698ee75dfdb0ed3a')
const client = twilio(process.env.ACCOUNT_ID, process.env.AUTH_TOKEN)


class Message {
    constructor(options){
        this.options = options
    }

    sendWhatsapp() {
        client.messages
            .create({
                from: `whatsapp:${process.env.PHONE_WSP}`,
                body: this.options.body,
                to: `whatsapp:${this.options.to}`
            })
            .then(message => console.log(message.sid))
            .catch(err => console.log(err))
    }

    async sendSMS() {
        try {
            const message = await client.messages.create({
                body: `Su pedido fue RECIBIDO y se encuentra en PROCESO`,
                from: process.env.PHONE_SMS ,
                to: '+543385431980',
            })
            console.log(message)
        } catch (error) {
            console.log(error)
        }
    }
}

export default Message