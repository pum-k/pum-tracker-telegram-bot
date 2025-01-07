const { getState, clearState } = require('../utils/stateManager')

module.exports = (bot, msg) => {
  const chatId = msg.chat.id

  if (getState(chatId)) {
    clearState(chatId)
    bot.sendMessage(chatId, 'Dị thì thoyy.')
  } else {
    bot.sendMessage(chatId, 'Có nhắn gì đâu mà kêu em huỷ?! Khùng hả.')
  }
}
