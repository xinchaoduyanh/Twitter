import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { config } from 'dotenv'
import fs from 'fs'
config()
// Create SES service object.
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  }
})
const verifyEmailTemplate = fs.readFileSync('./src/template/verify-email.html', 'utf-8')
const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

export const sendVerifyEmail = async (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS as string,
    toAddresses: toAddress,
    body,
    subject
  })

  return sesClient.send(sendEmailCommand)
}

export const sendRegisterVerifyEmail = async (
  toAddress: string,
  email_verify_token: string,
  template: string = verifyEmailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    'Verify your email',
    template
      .replace('{{title}}', 'Please verify your email')
      .replace('{{content}}', 'Click the button below to verify your email address.')
      .replace('{{link}}', `${process.env.CILENT_URL}/verify-email?token=${email_verify_token}`)
      .replace('{{titleLink}}', 'Verify your email')
  )
}

export const sendForgotPasswordEmail = async (
  toAddress: string,
  forgotPasswordToken: string,
  template: string = verifyEmailTemplate
) => {
  console.log('dm cuoc doi')

  return sendVerifyEmail(
    toAddress,
    'Forgot password',
    template
      .replace('{{title}}', 'Please create a new password')
      .replace('{{content}}', 'Click the button below to create a new password')
      .replace('{{link}}', `${process.env.CILENT_URL}/forgot-password?token=${forgotPasswordToken}`)
      .replace('{{titleLink}}', 'Create a new password')
  )
}
// sendVerifyEmail('anhduc8823@gmail.com', 'Tiêu đề email', '<h1>Nội dung email đc gửi từ duy anh nè hí hí</h1>')
