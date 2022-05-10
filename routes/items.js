
const { Router } = require('express');

const { itemGet, buscarEnvio, prueba } = require('../controllers/items');

const router = Router();


router.get('/:mlc', itemGet );
router.get('/envio/:id', buscarEnvio );
router.post('/prueba', prueba );


module.exports = router;