const getStartEndDate = (command, args) => {
  let startDate, endDate

  switch (command) {
    case 'today':
      startDate = new Date()
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date()
      break
    case 'week':
      startDate = new Date()
      startDate.setDate(startDate.getDate() - startDate.getDay())
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date()
      break
    case 'month':
      startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      endDate = new Date()
      break
    case 'range':
      if (args.length !== 3) {
        return {}
      }
      startDate = new Date(args[1])
      endDate = new Date(args[2])
      break
    default:
      return {}
  }

  return { startDate, endDate }
}

module.exports = { getStartEndDate }
