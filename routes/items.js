
const { Router } = require('express');

const { itemGet } = require('../controllers/items');

const router = Router();


router.get('/:mlc', itemGet );



module.exports = router;