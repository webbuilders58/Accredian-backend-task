export const createReferralId = (userId) => {
    const date = new Date();
    const referralId = `${userId}${date.getTime()}`;
    return referralId;
};
