const mongoose = require('mongoose')
const Expense = require('../models/Expense')
const { getState, clearState } = require('../utils/stateManager')

module.exports = (bot, msg) => {
  const chatId = msg.chat.id
  const text = msg.text.trim()

  // Kiểm tra trạng thái hiện tại
  const state = getState(chatId)
  if (!state || state.step !== 'remove') {
    bot.sendMessage(chatId, 'Vui lòng nhập lệnh /remove trước khi nhập ID.')
    return
  }

  // Kiểm tra nếu ID không hợp lệ
  if (!mongoose.Types.ObjectId.isValid(text)) {
    bot.sendMessage(chatId, 'ID không hợp lệ. Vui lòng nhập đúng ID từ danh sách.')
    return
  }

  // Xóa chi tiêu với ID đã nhập
  Expense.findByIdAndDelete(text)
    .then((deletedExpense) => {
      if (deletedExpense) {
        bot.sendMessage(chatId, `Đã xóa chi tiêu: ${deletedExpense.item} - ${deletedExpense.amount} VND`)
      } else {
        bot.sendMessage(chatId, 'Không tìm thấy chi tiêu với ID đã nhập.')
      }
      clearState(chatId) // Xóa trạng thái sau khi hoàn tất
    })
    .catch((error) => {
      bot.sendMessage(chatId, 'Có lỗi xảy ra khi xóa chi tiêu.')
      console.error('Error deleting expense:', error)
    })
}
