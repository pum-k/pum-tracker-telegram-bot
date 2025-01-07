const Expense = require('../models/Expense')

module.exports = (bot, msg) => {
  const chatId = msg.chat.id

  Expense.find({ userId: chatId })
    .sort({ date: -1 }) // Sắp xếp theo ngày giảm dần
    .limit(5) // Giới hạn 5 bản ghi
    .then((expenses) => {
      if (expenses.length === 0) {
        bot.sendMessage(chatId, 'Gần đây anh không có mua gì cả.')
        return
      }

      const expenseList = expenses
        .map((expense, index) => `${index + 1}. ${expense.item} - ${expense.amount} VND (ID: ${expense._id})`)
        .join('\n')

      bot.sendMessage(chatId, `Anh mới mua mấy cái này nè:\n${expenseList}\n\nMuốn xoá cái nào thì đưa ID cho em.`)

      bot.once('message', (response) => {
        const expenseId = response.text.trim()

        Expense.findByIdAndDelete(expenseId)
          .then((deletedExpense) => {
            if (deletedExpense) {
              bot.sendMessage(chatId, `Xoá ${deletedExpense.item} giá ${deletedExpense.amount} đồng rồi á nhaa`)
            } else {
              bot.sendMessage(chatId, 'Quýnh giờ, cái ID tào lao')
            }
          })
          .catch((error) => {
            bot.sendMessage(chatId, 'Có lỗi xảy ra khi xóa chi tiêu.')
            console.error('Error deleting expense:', error)
          })
      })
    })
    .catch((error) => {
      bot.sendMessage(chatId, 'Có lỗi xảy ra khi lấy danh sách chi tiêu.')
      console.error('Error fetching expenses:', error)
    })
}
