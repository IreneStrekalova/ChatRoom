const Message = require('../models/message');

module.exports = {
    async getMessages(page = 0, perPage = 10) {
        return await Message.find().limit(perPage).skip(page*perPage).exec();
    },

    async getMessage(id) {console.log(mongoose.Types.ObjectId.isValid(id))
        return await Message.findById(id);
    },

    async createMessage(body) {
        return await Message.create({
            email: body.email,
            message: body.message,
            createDate: Date.now()
        });
    },

    async updateMessage(id, query) {
        return await Message.findByIdAndUpdate(id, query);
    },

    async deleteMessage(id) {
        return await Message.findByIdAndDelete(id);
    }
}