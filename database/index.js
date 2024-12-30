import Datastore from 'nedb';

const DEFAULT_STATUS = 'pending';

const db = new Datastore({ filename: 'dbfile', autoload: true });

// Utility functions
export const readDb = async () => {
    return new Promise((resolve, reject) => {
        db.find({}, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        });
    });
};


// Reusable function to find a user
const findUser = async (userId, inviterID) => {
    const users = await readDb();
    let user = users.find(u => u.id == userId);
    if (!user) {
        user = await createUser(userId, inviterID);
    }
    return user;
};

// Reusable function to generate unique payment IDs
const generatePaymentId = (user) => {
    const maxId = user.payments.reduce((max, payment) => Math.max(max, payment.id), -1);
    return maxId + 1;
};



// Create a new user
export const createUser = async (userId, inviterID = 0) => {
    const users = await readDb();


    // Check if user with the given ID already exists
    if (users.find(user => user.id == userId)) {
        throw new Error(`User with ID ${userId} already exists.`);
    }

    const newUser = {
        id: userId,
        payments: [],
        subscriptions: [],
        inviterID: inviterID,
        firstPay: false
    };

    // Insert the new user into the database
    db.insert(newUser, (err, newDoc) => {
        if (err) throw new Error(`Error inserting user: ${err}`);
    });

    return newUser;
};

export const getUser = async (userId, inviterID) => {
    const user = await findUser(userId, inviterID);
    return user;
};
export const setUserFirstPay = async (userId) => {
    const user = await findUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found.`);

    return new Promise((resolve, reject) => {
        db.update(
            { id: userId },          // Query: Find user by ID
            { $set: { firstPay: true } }, // Update: Set firstPay to true
            {},                      // Options: Update one document
            (err) => {  // Callback function
                if (err) {
                    console.error(`Error updating user: ${err}`);
                    reject(new Error(`Error updating user: ${err}`));
                }  else {
                    console.log(`User with ID ${userId} successfully updated.`);
                    resolve(true);
                }
            }
        );
    });

}



// Add a payment to a user
export const addPayment = async (userId, plan, config = '') => {
    const user = await findUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found.`);

    const now = new Date()
    const newPayment = {
        id: generatePaymentId(user),
        plan,
        status: DEFAULT_STATUS,
        config,
        time: now.toDateString()
    };

    user.payments.push(newPayment);
    db.update({ id: userId }, { $set: { payments: user.payments } }, {}, (err) => {
        if (err) throw new Error(`Error updating payments: ${err}`);
    });

    return newPayment.id;
};

// Update payment status
export const updatePaymentStatus = async (userId, paymentId, status) => {
    const user = await findUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found.`);

    const payment = user.payments.find(p => p.id == paymentId);
    if (!payment) throw new Error(`Payment with ID ${paymentId} not found for user ${userId}.`);

    payment.status = status;

    db.update({ id: userId }, { $set: { payments: user.payments } }, {}, (err) => {
        if (err) throw new Error(`Error updating payment status: ${err}`);
    });
};

// Get the volume of a specific payment
export const getPayment = async (userId, paymentId) => {
    const user = await findUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found.`);

    const payment = user.payments.find(p => p.id == paymentId);
    if (!payment) throw new Error(`Payment with ID ${paymentId} not found.`);

    return payment;
};

// // Get the volume of a specific payment
// export const getPaymentVolume = async (userId, paymentId) => {
//     const user = await findUser(userId);
//     if (!user) throw new Error(`User with ID ${userId} not found.`);

//     const payment = user.payments.find(p => p.id == paymentId);
//     if (!payment) throw new Error(`Payment with ID ${paymentId} not found.`);

//     return payment.plan;
// };

// Add config to user
export const addConfigToUser = async (userId, config) => {
    const user = await findUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found.`);

    const configExists = user.subscriptions.includes(config);
    if (configExists) return `Config "${config}" already exists for user`;

    user.subscriptions.push(config);

    db.update({ id: userId }, { $set: { subscriptions: user.subscriptions } }, {}, (err) => {
        if (err) throw new Error(`Error adding config: ${err}`);
    });

    return `Config "${config}" successfully added to user`;
};

// Update payment status
export const updateSubscriptionNotif = async (userId, username, status) => {
    const user = await findUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found.`);

    const subscription = user.subscriptions.find(s => s.username == username);
    if (!subscription) throw new Error(`subscription with Username ${username} not found for user ${userId}.`);

    subscription.notif = status;

    db.update({ id: userId }, { $set: { subscriptions: user.subscriptions } }, {}, (err) => {
        if (err) throw new Error(`Error updating payment status: ${err}`);
    });
};

// Get List of configs from user
export const getUserConfigs = async (userId) => {
    const user = await findUser(userId);
    if (!user) throw new Error(`User with ID ${userId} not found.`);

    return user.subscriptions;
};
