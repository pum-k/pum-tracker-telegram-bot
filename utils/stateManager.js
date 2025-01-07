const currentStep = {} // Object lưu trạng thái cho từng người dùng

// Lấy trạng thái hiện tại của người dùng
const getState = (chatId) => currentStep[chatId]

// Cập nhật trạng thái cho người dùng
const setState = (chatId, state) => {
  currentStep[chatId] = state
}

// Xóa trạng thái của người dùng
const clearState = (chatId) => {
  delete currentStep[chatId]
}

module.exports = {
  getState,
  setState,
  clearState,
}
