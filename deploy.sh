# Send weather summary via text every day at 8am
# API keys and other sensitive info should be set in local .SMS_REMINDER_KEYS file
wt cron create --secrets-file ~/.SMS_REMINDER_KEYS send-sms.js --schedule "0 8 * * *" --tz America/New_York
