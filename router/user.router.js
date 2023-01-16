const router = require ('express').Router();

const controller = require('../controller/user.controller');
const middleware = require('../middleware/user.middleware')

router.get(
    '/',
    middleware.checkAccessToken,
    controller.getUsers
);


router.post(
    '/register',
    controller.register
);

router.post(
    '/login',
    middleware.getUserDynamically('userName'),
    controller.login
);

router.put(
    '/update',
    middleware.checkAccessToken,
    controller.changeBoss
);


module.exports = router;
