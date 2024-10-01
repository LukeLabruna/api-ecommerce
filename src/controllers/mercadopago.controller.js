const { MercadoPagoConfig, Preference } = require("mercadopago")
const configObj = require("../config/env.config.js")
const { ACCESS_TOKEN_MP } = configObj

const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN_MP })

const preference = new Preference(client)

class MercadoPagoController {
    async createPreference(req, res) {
        const { orderData } = req.body
        try {
            const body = {
                items: [
                    {
                        title: orderData.title,
                        quantity: Number(orderData.quantity),
                        unit_price: Number(orderData.price),
                        currency_id: "ARS"
                    }
                ],
                back_urls: {
                    success: "https://www.google.com",
                    failure: "https://www.google.com",
                    pending: "https://www.google.com"
                },
                auto_return: "approved"
            }

            const result = await preference.create({body})
            res.status(200).json({status: "success", message: "Preference created correctly", data: result})
        } catch (error) {
            console.log(error)
            res.json({status: "error", data: error})
        }
    }
}

module.exports = MercadoPagoController