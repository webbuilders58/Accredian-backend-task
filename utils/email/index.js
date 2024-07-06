var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendMail } from './gmail.js';
export const sendReferralMail = (to, userName, referralId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            to: to,
            replyTo: 'anudeepsvka@gmail.com',
            subject: 'Thanks for joining our Referral program',
            text: 'Test email for accredian referral programme',
            html: `<p> This is a <b>test email</b> from Accredian.</p>  <p>You have been referred by ${userName}<p>\nNow you can join our program with your referral link to get benefits: <a href="${process.env.FRONTEND_URL}/${userId}/${referralId}">${process.env.FRONTEND_URL}/${userId}/${referralId}</a>`,
            textEncoding: 'base64',
        };
        const messageId = yield sendMail(options);
    }
    catch (error) {
        console.log(error);
        throw new Error('Something went wrong');
    }
});
