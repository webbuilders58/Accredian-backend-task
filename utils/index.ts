export const createReferralId = (userId: number):string => {
  const date = new Date()
  const referralId = `${userId}${date.getTime()}`
  return referralId
}
