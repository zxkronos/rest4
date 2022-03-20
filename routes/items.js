
const { Router } = require('express');

const { itemGet, buscarEnvio } = require('../controllers/items');

const router = Router();


router.get('/:mlc', itemGet );
router.get('/envio/:id', buscarEnvio );



module.exports = router;