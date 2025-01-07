module.exports = (bot, msg) => {
  const chatId = msg.chat.id
  const helpMessage = `
Danh sách các lệnh khả dụng:
/help - Hiển thị danh sách các lệnh
/cancel - Hủy tiến trình hiện tại
/report today - Báo cáo chi tiêu hôm nay
/report week - Báo cáo chi tiêu tuần này
/report month - Báo cáo chi tiêu tháng này
/report range YYYY-MM-DD YYYY-MM-DD - Báo cáo chi tiêu trong khoảng thời gian cụ thể
`
  bot.sendMessage(chatId, helpMessage)
}
