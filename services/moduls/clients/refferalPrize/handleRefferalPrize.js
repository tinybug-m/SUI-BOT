import { getUser } from "../../../../database/index.js";

const handleRefferalPrize = async (userId, paymentId) => {
    try {
        const purchaser = await getUser(userId);
        if (!purchaser) throw new Error('Purchaser not found');

        const inviterID = purchaser.inviterID;
        const purchaseVolume = purchaser.payments.find(p => p.id == paymentId)?.plan;

        if (purchaser.firstPay !== true && inviterID && purchaseVolume) {
            const inviterCommission = purchaseVolume / (process.env.PRIZE_PERCENT || 1);
            const inviter = await getUser(inviterID);

            if (inviter?.subscriptions?.length) {
                return {
                    inviterSubscriptionName: inviter.subscriptions[0],
                    inviterCommission,
                    inviterID
                };
            }
            return false;
        }
    } catch (error) {
        console.error('Error in handleRefferalPrize:', error.message);
        return null;
    }
};


export default handleRefferalPrize