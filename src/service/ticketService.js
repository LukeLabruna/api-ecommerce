const TicketModel = require("../models/ticket.model.js")

class TicketService {
  async createTicket(ticket) {
    try {
      const newTicket = new TicketModel(ticket)
      newTicket.save()
      return newTicket
    } catch (error) {
      throw error
    }
  }
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id)
      if (!ticket) {
        throw new Error(`Ticket not exist`)
      }
      return ticket
    } catch (error) {
      throw error
    }
  }
}

module.exports = TicketService