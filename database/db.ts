import Datastore from 'nedb';

const DEFAULT_STATUS = 'pending';

const db = new Datastore({ filename: 'dbfile', autoload: true });

// Utility functions
const readDb = async () => {
    return new Promise((resolve, reject) => {
        db.find({}, (err, docs) => {
            if (err) reject(err);
            resolve(docs);
        });
    });
};

