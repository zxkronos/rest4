
const { Router } = require('express');

const { itemGet, buscarEnvio, prueba, modificarCantidad,addstock, modificarSku , disponibilidadStock, refrescarCantidad} = require('../controllers/items');

const router = Router();


router.get('/:mlc', itemGet );
router.get('/envio/:id', buscarEnvio );
router.post('/prueba', prueba );
router.put('/stockupdate/:id', modificarCantidad );
router.put('/addstock/:id', addstock );
router.put('/updatesku/:id', modificarSku);
router.put('/dispstock/:id', disponibilidadStock );
router.post('/refrescar/:mlc', refrescarCantidad );


module.exports = router;