const Expense = require('../models/Expense')
const { getStartEndDate } = require('../utils/dateHelper')

module.exports = (bot, msg, match) => {
  const chatId = msg.chat.id
  const args = match[1].split(' ')
  const command = args[0]

  const { startDate, endDate } = getStartEndDate(command, args)

  if (!startDate || !endDate) {
    bot.sendMessage(chatId, 'Báo cáo cho anh như thế nào đây ạ?: today, week, month, range YYYY-MM-DD YYYY-MM-DD')
    return
  }

  Expense.find({
    userId: chatId,
    date: { $gte: startDate, $lte: endDate },
  })
    .then((expenses) => {
      if (expenses.length === 0) {
        bot.sendMessage(chatId, 'Anh có mua gì vào lúc đó đâu?!.')
        return
      }

      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
      const report = expenses
        .map((expense) => `${expense.date.toLocaleDateString()} - ${expense.item}: ${expense.amount} VND`)
        .join('\n')

      bot.sendMessage(chatId, `Dạ báo cáo anh nè:\n${report}\n\nTổng: ${total} VND`)
    })
    .catch((error) => {
      bot.sendMessage(chatId, 'Có lỗi xảy ra khi lấy báo cáo.')
      console.error('Error fetching report:', error)
    })
}
