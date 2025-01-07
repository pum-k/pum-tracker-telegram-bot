const Expense = require('../models/Expense')
const { getStartEndDate } = require('../utils/dateHelper')

module.exports = (bot, msg, match) => {
  const chatId = msg.chat.id
  const args = match?.[1]?.split(' ')
  const command = args?.[0]

  if (!args) {
    bot.sendMessage(chatId, 'Anh thêm 1 trong mấy option này sau chữ report dùm em: today, week, month, range YYYY-MM-DD YYYY-MM-DD')
    return
  }

  const { startDate, endDate } = getStartEndDate(command, args)

  Expense.find({
    userId: chatId,
    date: { $gte: startDate, $lte: endDate },
  })
    .then((expenses) => {
      if (expenses.length === 0) {
        bot.sendMessage(chatId, 'Anh có mua gì đâu?!.')
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
