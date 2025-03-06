import Message from "#models/message";

class MessageService {
  static Model = Message;

  static async get(id, filter) {
    if (!id) {
      return await this.Model.findById(id);
    }
    return await this.Model.findAll();
  }

  static async deleteDoc(id) {
    const document = await this.Model.findById(id);
    await document.deleteOne();
  }
}

export default MessageService;
