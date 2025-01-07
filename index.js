require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const {connectDB} = require('./config/database')
const {getState} = require('./utils/stateManager')

// Import các command
const helpCommand = require('./commands/help')
const cancelCommand = require('./commands/cancel')
const reportCommand = require('./commands/report')
const startCommand = require('./commands/start')
const removeCommand = require('./commands/remove')
const removeHandler = require('./commands/removeHandler')

const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new TelegramBot(BOT_TOKEN, {polling: true})

connectDB()

bot.onText(/\/help/, (msg) => helpCommand(bot, msg))
bot.onText(/\/cancel/, (msg) => cancelCommand(bot, msg))
bot.onText(/\/report(?: (.+))?/, (msg, match) => reportCommand(bot, msg, match))
bot.onText(/\/remove/, (msg) => removeCommand(bot, msg))

bot.on('message', (msg) => {
  const chatId = msg.chat.id
  const state = getState(chatId)

  // Nếu đang ở bước xóa, xử lý việc xóa
  if (state && state.step === 'remove') {
    removeHandler(bot, msg)
    return
  }

  // Nếu không ở bước đặc biệt nào, xử lý thêm chi tiêu
  startCommand(bot, msg)
})

bot.on('polling_error', (error) => {
  console.error(error)
})