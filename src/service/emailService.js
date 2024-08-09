const nodemailer = require("nodemailer")
const configObj = require("../config/env.config.js")
const { BASE_URL } = configObj

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
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
                subject: "Confirmación de compra",
                html: `
                    <div style="text-align: center;
                                margin: 0 auto;
                                padding: 3rem;
                                border-radius: 0.5rem;
                                border: solid 1px black;
                                box-shadow: 0 0 1rem rgb(212, 212, 212);">
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                    <div/>
                `
            }

            await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.error("Error sending email:", error)
        }
    }

    async sendMailResetPassword(email, first_name, token) {
        try {
            const mailOptions = {
                from: "E-commerce <lucaspablolabruna@gmail.com>",
                to: email,
                subject: "Restablecimiento de Contraseña",
                html: `
                <div style="text-align: center;
                            margin: 0 auto;
                            padding: 3rem;
                            border-radius: 0.5rem;
                            border: solid 1px black;
                            box-shadow: 0 0 1rem rgb(212, 212, 212);">
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="${BASE_URL}/user/resetpassword">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                    <div/>
                `
            }

            await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.error("Error sending email:", error)
            throw new Error("Error sending email")
        }
    }

    async sendEmailDeleteUser(email, first_name) {
        try {
            const mailOptions = {
                from: "E-commerce <lucaspablolabruna@gmail.com>",
                to: email,
                subject: "Cuenta eliminada",
                html: `
                <div style="text-align: center;
                            margin: 0 auto;
                            padding: 3rem;
                            border-radius: 0.5rem;
                            border: solid 1px black;
                            box-shadow: 0 0 1rem rgb(212, 212, 212);">
                    <h1>Cuenta eliminada</h1>
                    <p>Hola ${first_name},</p>
                    <p>Tu cuenta ha sido eliminada por falta de acceso</p>
                    <p>En caso de querer recuperarla contactese a soporte</p>
                    <a href="${BASE_URL}/user/support">Soporte tecnico</a>
                    <div/>
                `
            }

            await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.error("Error sending email:", error)
            throw new Error("Error sending email")
        }
    }

    async sendEmailDeleteProduct(email, title) {
        try {
            const mailOptions = {
                from: "E-commerce <lucaspablolabruna@gmail.com>",
                to: email,
                subject: "Producto eliminado",
                html: `
                <div style="text-align: center;
                            margin: 0 auto;
                            padding: 3rem;
                            border-radius: 0.5rem;
                            border: solid 1px black;
                            box-shadow: 0 0 1rem rgb(212, 212, 212);">
                    <h1>Producto eliminado.</h1>
                    <p>Hola!</p>
                    <p>El producto, ${title}, ha sido eliminado de nuestra base de datos.</p>
                    <p>En caso de querer recuperar la venta de este produco contactese a soporte.</p>
                    <a href="${BASE_URL}/user/support" style="color: blue;">Soporte tecnico</a>
                    <div/>
                `
            }

            await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.error("Error sending email:", error)
            throw new Error("Error sending email")
        }
    }
}

module.exports = EmailService