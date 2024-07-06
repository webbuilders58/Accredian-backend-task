var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '../prisma/index.js';
import { createReferralId } from '../utils/index.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import { sendReferralMail } from '../utils/email/index.js';
// * @desc    Register new referral code
// * @route   POST /programme/refer
// * @access  Public
export function createReferralProgram(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, refereeName, refereeEmail, programme } = req.body;
        const referrerId = new Date().getTime(); //! user id iskept as today in seconds set user id to real user id in production
        if (!name || !refereeName || !refereeEmail || !programme) {
            return res.status(400).json({ message: null, error: 'Missing fields' });
        }
        const referralId = createReferralId(referrerId);
        try {
            yield prisma.user_referral.create({
                data: {
                    refer_count: 0,
                    user_id: "" + referrerId,
                    referral_id: referralId,
                },
            });
        }
        catch (error) {
            console.log(error);
            return res
                .status(201)
                .json({ message: null, error: 'Something went wrong. invalid' });
        }
        try {
            const userId = new Date().getTime(); //! user id is kept as today in seconds set user id to real user id in production
            yield sendReferralMail(refereeEmail, name, '' + referralId, '' + userId);
            return res.status(201).json({ message: 'Success', error: null });
        }
        catch (error) {
            return res.status(400).json({ message: null, error });
        }
    });
}
// * @desc    Join with a  referral code
// * @route   POST /programme/:userId/:referralId
// * @access  Public
export function joinWithReferralCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { referralId, userId } = req.params;
        if (!referralId || !userId) {
            return res.status(400).json({ message: null, error: 'Missing fields' });
        }
        try {
            const isAlreadyreffered = yield prisma.referral.findFirst({
                where: {
                    joiner_userid: userId,
                },
            });
            console.log("Here it is: ", isAlreadyreffered);
            if (isAlreadyreffered !== null) {
                return res.status(400).json({
                    message: null,
                    error: 'You have already joined by a referral code',
                });
            }
            const Updatedreferrer = yield prisma.user_referral.update({
                where: {
                    referral_id: referralId,
                },
                data: {
                    refer_count: {
                        increment: 1,
                    },
                },
            });
            yield prisma.referral.create({
                data: {
                    joiner_userid: userId,
                    referrerId: Updatedreferrer.id,
                },
            });
            return res
                .status(201)
                .json({ message: 'succesfully referred', error: null });
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError &&
                error.code === 'P2025') {
                return res
                    .status(400)
                    .json({ message: null, error: 'Invalid Referral Code' });
            }
            return res.status(400).json({ message: null, error: error });
        }
    });
}
