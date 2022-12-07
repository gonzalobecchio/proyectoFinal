import { createTransport } from 'nodemailer'

class NodeMailer {
    constructor(options) {
        this.options = options
        this.transporter = createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'marty88@ethereal.email',
                pass: 'uSjyMNcpd9bv7NcHwr'
            }
        });
    }

    async send() {
        try {
            let info = await this.transporter.sendMail(this.options)
            console.log(info)
        } catch (error) {
            console.log(error)
        }
    }

}

export default NodeMailer