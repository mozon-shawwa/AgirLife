const Contact = require('../models/Contact');
const createError = require('http-errors');
const { returnJson } = require('../my-modules/json-response');

const createMessage = async (req, res, next) => {
  try {
    const { name, email, phone,company, message } = req.body;

    if (!name || !email || !message  ) {
      return next(createError(400, 'Name, email, and message are required.'));
    }

    const contact = new Contact({ name, email, phone,company, message });
    await contact.save();

    returnJson(res, 201, true, contact, 'Message sent successfully.');
  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in sending message.'));
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort('-createdAt');
    returnJson(res, 200, true, messages, 'Fetched all contact messages.');
  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in fetching contact messages.'));
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return next(createError(404, 'Message not found.'));
    }

    if (!message.isRead){
        await message.updateOne({ isRead: true });
    } 

    returnJson(res, 200, true, message, 'Fetched message successfully.');
  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error in fetching message.'));
  }
};

module.exports = { createMessage, getAllMessages, getMessageById };
