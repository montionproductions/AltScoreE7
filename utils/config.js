require('dotenv').config()

const PORT = process.env.PORT || 3001
const ALT_SCORE_API_BASE_URL = process.env.ALT_SCORE_API_BASE_URL || 'https://makers-challenge.altscore.ai'

module.exports = {
  PORT,
  ALT_SCORE_API_BASE_URL
}