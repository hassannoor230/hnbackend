import nodemailer from 'nodemailer'
import { env } from './env.js'

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  if (!env.email.host || !env.email.user || !env.email.pass) {
    console.warn('Email transport not configured. Skipping email notifications.')
    return null
  }
  transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port,
    secure: env.email.port === 465,
    auth: { user: env.email.user, pass: env.email.pass },
  })
  return transporter
}

export async function sendMail({ to, subject, html, text }) {
  const t = getTransporter()
  if (!t) return false
  try {
    await t.sendMail({
      from: env.email.from,
      to,
      subject,
      html,
      text,
    })
    return true
  } catch (err) {
    console.error('sendMail error:', err.message)
    return false
  }
}

export default { sendMail }