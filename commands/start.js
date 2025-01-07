const Expense = require('../models/Expense')
const { getState, setState, clearState } = require('../utils/stateManager')

module.exports = (bot, msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  if (text.startsWith('/')) {
    return
  }

  let state = getState(chatId)

  if (!state) {
    setState(chatId, { step: 'askAmount', item: text })
    bot.sendMessage(chatId, `Anh mới mua "${text}" hả?. Hết bao nhiêu tiền dị?`)
    return
  }

  if (state.step === 'askAmount') {
    const amount = parseFloat(text)
    if (isNaN(amount)) {
      bot.sendMessage(chatId, 'Giá tiền nào mà kì vậy chời?.')
      return
    }

    const expense = new Expense({
      userId: chatId,
      item: state.item,
      amount,
    })

    expense
      .save()
      .then(() => {
        bot.sendMessage(chatId, `Got it, anh yêu mua ${state.item} hết ${amount} đồng. Đã he!`)
        clearState(chatId)
      })
      .catch((error) => {
        bot.sendMessage(chatId, 'Có lỗi xảy ra khi lưu dữ liệu.')
        console.error('Error saving expense:', error)
      })
  }
}
