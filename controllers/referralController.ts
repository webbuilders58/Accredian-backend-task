import { Request, Response } from 'express'
import { prisma } from '../prisma/index.js'
import { createReferralId } from '../utils/index.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'
import { sendReferralMail } from '../utils/email/index.js'

// * @desc    Register new referral code
// * @route   POST /programme/refer
// * @access  Public
export async function createReferralProgram(req: Request, res: Response) {
  const { name, refereeName, refereeEmail, programme } = req.body
  const referrerId = new Date().getTime() //! user id iskept as today in seconds set user id to real user id in production

  if (!name || !refereeName || !refereeEmail || !programme) {
    return res.status(400).json({ message: null, error: 'Missing fields' })
  }
  const referralId = createReferralId(referrerId)
  try {
    await prisma.user_referral.create({
      data: {
        refer_count: 0,
        user_id: ""+referrerId,
        referral_id: referralId,
      },
    })
  } catch (error) {
    console.log(error)
    return res
      .status(201)
      .json({ message: null, error: 'Something went wrong. invalid' })
  }
  try {
    const userId = new Date().getTime() //! user id is kept as today in seconds set user id to real user id in production
    await sendReferralMail(
      refereeEmail,
      name,
      '' + referralId,
      '' + userId,
    )
    return res.status(201).json({ message: 'Success', error: null })
  } catch (error) {
    return res.status(400).json({ message: null, error })
  }
}

// * @desc    Join with a  referral code
// * @route   POST /programme/:userId/:referralId
// * @access  Public
export async function joinWithReferralCode(req: Request, res: Response) {
  const { referralId, userId } = req.params

  if (!referralId || !userId) {
    return res.status(400).json({ message: null, error: 'Missing fields' })
  }
  try {
    const isAlreadyreffered = await prisma.referral.findFirst({
      where: {
        joiner_userid: userId,
      },
    })
    console.log("Here it is: ",isAlreadyreffered)
    
    if (isAlreadyreffered !== null) {
      return res.status(400).json({
        message: null,
        error: 'You have already joined by a referral code',
      })
    }

    const Updatedreferrer = await prisma.user_referral.update({
      where: {
        referral_id: referralId,
      },
      data: {
        refer_count: {
          increment: 1,
        },
      },
    })

    await prisma.referral.create({
      data: {
        joiner_userid: userId,
        referrerId: Updatedreferrer.id,
      },
    })

    return res
      .status(201)
      .json({ message: 'succesfully referred', error: null })
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res
        .status(400)
        .json({ message: null, error: 'Invalid Referral Code' })
    }
    return res.status(400).json({ message: null, error: error })
  }
}
