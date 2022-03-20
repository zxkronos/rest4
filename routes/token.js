
const { Router } = require('express');

const { getcode, gettoken, tokenrefresh } = require('../controllers/token');

const router = Router();


router.get('/getcode', getcode );
router.get('/gettoken', gettoken );
router.get('/tokenrefresh', tokenrefresh );



module.exports = router;