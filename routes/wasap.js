
const { Router } = require('express');

const {testWasap, webhook  } = require('../controllers/wasap');

const router = Router();

router.get('/test', testWasap );
router.post('/webhook', webhook );

module.exports = router;