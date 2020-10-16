const nodemailer = require('nodemailer')
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const Mustache = require('mustache')

const templateDir = path.resolve(basedir, '../templates/email')


sendEmailAWS = ({ to, subject, message }) => {
    const SESConfig = {
        apiVersion: '2010-12-01',
        accessKeyId: Configuration.AWS_SES_ACCESS_KEY_ID,
        secretAccessKey: Configuration.AWS_SES_SECRET_ACCESS_KEY,
        region: Configuration.AWS_SES_REGION
    }

    let params = {
        Source: 'noreply@fllair.com',
        Destination: {
            ToAddresses: [
                to
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: message
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        }
    }

    new AWS.SES(SESConfig).sendEmail(params).promise().then((res) => {
        console.log(res)
    })
}

sendEmailGoogle = ({ to, subject, message }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secureConnection: false,
        port: 587,
        tls: {
            ciphers: 'SSLv3'
        },
        requireTLS: true,
        service: 'gmail',
        auth: {
            user: Configuration.GMAIL_USER,
            pass: Configuration.GMAIL_PASS
        }
    })

    const mailOptions = {
        from: 'no-reply@fllair.com',
        to: to,
        subject: subject,
        html: message
    }
    //console.log(mailOptions)
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {console.log(err)}
        else {console.log('Email is sent!')}
    })
}


module.exports = EmailHelper = {
    sendEmail: (template, object, mailOptions) => {
        fs.readFile(templateDir + '/' + template + '.mustache', { encoding: 'UTF-8' }, (error, data) => {
            if (error) console.log(error)
            else {
                const { to, subject } = mailOptions

                let rendered = Mustache.render(data, object)
                switch (Configuration.MAILING_TYPE.toString().toLowerCase()) {
                    case 'aws':
                        sendEmailAWS({ to, subject, message: rendered})
                        break
                   case 'google':
                        sendEmailGoogle({ to, subject, message: rendered })
                        break
                }
            }
        })
    }
}