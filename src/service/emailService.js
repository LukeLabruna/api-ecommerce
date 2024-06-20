const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "lucaspablolabruna@gmail.com",
                pass: "ocqd quut msrg mbyo"
            }
        })
    }

    async sendEmailPurchase(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "E-commerce <lucaspablolabruna@gmail.com>",
                to: email,
                subject: 'Confirmación de compra',
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `
            }

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error)
        }
    }

    async sendMailResetPassword(email, first_name, token) {
        try {
            const mailOptions = {
                from: 'E-commerce <lucaspablolabruna@gmail.com>',
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/user/resetpassword">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            }

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email:", error)
            throw new Error("Error sending email")
        }
    }
}

module.exports = EmailService