const Expense = require('../models/Expense')
const { setState } = require('../utils/stateManager')

module.exports = (bot, msg) => {
  const chatId = msg.chat.id

  // Lấy 5 chi tiêu gần nhất từ MongoDB
  Expense.find({ userId: chatId })
    .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
    .limit(5) // Giới hạn 5 bản ghi
    .then((expenses) => {
      if (expenses.length === 0) {
        bot.sendMessage(chatId, 'Không có chi tiêu nào để xóa.')
        return
      }

      // Tạo danh sách chi tiêu hiển thị cho người dùng
      const expenseList = expenses
        .map((expense, index) => `${index + 1}. ${expense.item} - ${expense.amount} VND (ID: ${expense._id})`)
        .join('\n')

      bot.sendMessage(chatId, `Các chi tiêu gần đây:\n${expenseList}\n\nVui lòng nhập ID của chi tiêu bạn muốn xóa.`)

      // Lưu trạng thái để biết rằng người dùng đang ở bước xóa chi tiêu
      setState(chatId, { step: 'remove' })
    })
    .catch((error) => {
      bot.sendMessage(chatId, 'Có lỗi xảy ra khi lấy danh sách chi tiêu.')
      console.error('Error fetching expenses:', error)
    })
}
