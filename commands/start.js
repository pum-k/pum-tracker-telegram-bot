const Expense = require('../models/Expense')
const { getState, setState, clearState } = require('../utils/stateManager')

module.exports = (bot, msg) => {
  const chatId = msg.chat.id
  const text = msg.text

  // Bỏ qua nếu tin nhắn là lệnh
  if (text.startsWith('/')) return

  // Kiểm tra trạng thái hiện tại
  let state = getState(chatId)

  // Nếu chưa có trạng thái, coi tin nhắn là tên món ăn và hỏi giá
  if (!state) {
    setState(chatId, { step: 'askAmount', item: text }) // Lưu tên món và chuyển sang bước hỏi giá
    bot.sendMessage(chatId, `Anh mới mua "${text}" hả?. Hết bao nhiêu tiền dị?`)
    return
  }

  // Nếu đang ở bước hỏi số tiền
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
        clearState(chatId) // Xóa trạng thái sau khi hoàn tất
      })
      .catch((error) => {
        bot.sendMessage(chatId, 'Có lỗi xảy ra khi lưu dữ liệu.')
        console.error('Error saving expense:', error)
      })
  }
}
