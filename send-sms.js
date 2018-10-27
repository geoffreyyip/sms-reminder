const twilio = require('twilio')
const axios = require('axios')

/**
 * Extract plaintext string with relevant info from JSON response
 */
const summarizeWeather = weatherData => {
  let {
    temperatureHigh: tempHigh,
    temperatureLow: tempLow,
    summary
  } = weatherData.daily.data[0]

  tempHigh = Math.round(tempHigh)
  tempLow = Math.round(tempLow)

  return `${summary} High of ${tempHigh}F and low of ${tempLow}F.`
}

const fetchWeather = (lat, long, apiKey) => {
  return axios.get(`https://api.darksky.net/forecast/${apiKey}/${lat},${long}`)
    .then(resp => resp.data)
}

const fetchWeatherSummary = (lat, long, apiKey) => {
  return fetchWeather(lat, long, apiKey)
    .then(data => summarizeWeather(data))
}

module.exports = (context, cb) => {
  const {
    LAT: lat,
    LONG: long,
    DARK_SKY_API_KEY: darkSkyKey,
  } = context.secrets

  const {
    TWILIO_SID: accountSid,
    TWILIO_AUTH_TOKEN: authToken,
    TWILIO_TO_NUM: to,
    TWILIO_FROM_NUM: from,
  } = context.secrets

  const client = new twilio(accountSid, authToken)

  fetchWeatherSummary(lat, long, darkSkyKey)
    .then(mssg => client.messages.create({
      body: mssg,
      to,
      from,
    }))
    .then(message => cb(null, message))
    .catch(err => cb(err))
}
