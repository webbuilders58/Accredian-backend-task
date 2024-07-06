import { sendMail } from './gmail.js'

export const sendReferralMail = async (
  to: string,
  userName: string,
  referralId: string,
  userId: string,
) => {
  try {
    const options = {
      to: to,
      replyTo: 'anudeepsvka@gmail.com',
      subject: 'Thanks for joining our Referral program',
      text: 'Test email for accredian referral programme',
      html: `<p> This is a <b>test email</b> from Accredian.</p>  <p>You have been referred by ${userName}<p>\nNow you can join our program with your referral link to get benefits: <a href="${process.env.FRONTEND_URL}/${userId}/${referralId}">${process.env.FRONTEND_URL}/${userId}/${referralId}</a>`,
      textEncoding: 'base64',
    }

    const messageId = await sendMail(options)
  } catch (error) {
    console.log(error)

    throw new Error('Something went wrong')
  }
}
