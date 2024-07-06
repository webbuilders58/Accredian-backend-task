var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { google } from 'googleapis';
import credentials from './cred.json' with { type: "json" };
import tokens from './token.json' with { type: 'json' };
import MailComposer from 'nodemailer/lib/mail-composer/index.js';
const getGmailService = () => {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    return gmail;
};
const encodeMessage = (message) => {
    return Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};
const createMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const mailComposer = new MailComposer(options);
    const message = yield mailComposer.compile().build();
    return encodeMessage(message);
});
export const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = getGmailService();
    const rawMessage = yield createMail(options);
    //@ts-ignore
    const resp = yield gmail.users.messages.send({
        userId: 'me',
        resource: {
            raw: rawMessage,
        },
    });
    return resp;
});
