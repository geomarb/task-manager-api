const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const msgType = {
    welcome: {
        subject: 'Thanks for joining in!',
        text(name) {
            return `Welcome to the app, ${name}. Let me know how you get along with the app.`
        }
    },
    cancelation: {
        subject: 'Sorry to see you go',
        text(name) {
            return `Goodbye, ${name}. I hope to see you back sometime soon.`
        }
    }
}
const sendEmail = (type, email, name) => {
    sgMail.send({
        to: email,
        from: 'gtcbrs@gmail.com',
        subject: msgType[type].subject,
        text: msgType[type].text(name)
    })
}

module.exports = sendEmail