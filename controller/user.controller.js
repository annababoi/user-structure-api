const userService = require('../service/user.service');
const authService = require('../service/auth.service');
const OAuth = require('../dataBase/OAuth');
const Relation = require('../dataBase/Relation');
const User = require('../dataBase/User');
const Roles = require('../config/role.enum')

module.exports = {
    register: async (req, res, next) => {
        try {
            const {body} = req;

            const hashPassword = await authService.hashPassword(body.password);
            const user = await userService.create({...body, password: hashPassword});

            const record = await Relation.findOneAndUpdate({boss: user._id}, {
                boss: user._id,
                users: body.sub_users
            });

            if (body.boss) {
                const record2 = await Relation.findOneAndUpdate({boss: body.boss}, {
                    boss: body.boss,
                    users: user._id
                });
            }

            if (!record) {
                await userService.createRelation(user._id, body.sub_users)
                await userService.createRelation(body.boss, user._id)
            }

            res.json('Created');
        } catch (e) {
            next(e)
        }
    },
    login: async (req, res, next) => {
        try {
            const {user, body} = req;

            await authService.comparePassword(user.password, body.password);
            const tokenPair = authService.generateAccessTokenPair({id: user._id});

            await OAuth.create({...tokenPair, _user_id: user._id, _user_role: user.role})

            res.json({user, tokenPair});

        } catch (e) {
            next(e)
        }
    },
    getUsers: async (req, res, next) => {
        try {
            const {tokenInfo} = req;
            if (tokenInfo._user_role === Roles.ADMIN) {
                const users = await userService.getUsers();
                res.json(users);

            } else if (tokenInfo._user_role === Roles.BOSS) {
                const user = await userService.findUserByToken(tokenInfo._user_id);
                const users = await userService.getUsersRelation(tokenInfo._user_id);
                res.json({user, users});

            } else if (tokenInfo._user_role === Roles.USER) {
                const user = await userService.findUserByToken(tokenInfo._user_id);
                res.json(user)
            }
        } catch (e) {
            next(e)
        }
    },
    changeBoss: async (req, res, next) => {
        try {
            const {tokenInfo} = req;
            const newBossId = req.body;

            if (tokenInfo._user_role === Roles.BOSS) {
                const user = await userService.findUserByToken(tokenInfo._user_id);
                const subUsers = await userService.getUsersRelation(user.usersByToken[0]._id);

                if (subUsers.length === 1) {
                    await userService.updateOne(user.usersByToken[0]._id, newBossId)
                } else await userService.createRelation(newBossId, subUsers);
            }
            res.json('Updated')
        } catch (e) {
            next(e)
        }

    },

}
