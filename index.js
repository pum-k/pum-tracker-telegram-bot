require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { connectDB } = require('./config/database')

// Import các command
const helpCommand = require('./commands/help')
const cancelCommand = require('./commands/cancel')
const reportCommand = require('./commands/report')
const startCommand = require('./commands/start')
const removeCommand = require('./commands/remove')

const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new TelegramBot(BOT_TOKEN, { polling: true })

connectDB()

bot.onText(/\/help/, (msg) => helpCommand(bot, msg))
bot.onText(/\/cancel/, (msg) => cancelCommand(bot, msg))
bot.onText(/\/report (.+)/, (msg, match) => reportCommand(bot, msg, match))
bot.onText(/\/remove/, (msg) => removeCommand(bot, msg))
bot.on('message', (msg) => startCommand(bot, msg))
