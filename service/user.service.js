const OAuth = require('../dataBase/OAuth');
const User = require('../dataBase/User');
const Relation = require('../dataBase/Relation');


module.exports = {
    create: async (userInfo) => {
        return User.create(userInfo)
    },
    createRelation: async (boss, users) => {
        return Relation.create({ boss, users })
    },

    getUsers: async (filter = {}) =>  {
        return User.find(filter);
    },

    getUsersRelation: async  (userID) => {
    const userRes = await Relation.aggregate([
        {
            $match: {
                users: userID
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'users',
                foreignField: '_id',
                as: 'subUsers'
            }
        }
    ]);
    return userRes;
},
    findUserByToken: async (userID) => {
        const res = await OAuth.aggregate([
            {
                $match: {
                    _user_id: userID
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_user_id',
                    foreignField: '_id',
                    as: 'usersByToken'
                }
            }
        ]);
        return res[0];
    },

    updateOne: async (userID, newUserInfo) => {
        return Relation.findOneAndUpdate(userID, newUserInfo, { new:true });
    },

}