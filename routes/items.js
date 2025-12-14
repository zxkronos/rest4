
const { Router } = require('express');

const { itemGet, buscarEnvio, prueba, modificarCantidad,addstock, modificarSku , 
    disponibilidadStock, refrescarCantidad, modificarPrecio, updateOrden,
     updateOrdenEnvio, updateOrdenItem,getOrderItem, getPackId,revisarUnaOrden} = require('../controllers/items');

const router = Router();

router.post('/orderitem',getOrderItem);
router.post('/updateordenitem',updateOrdenItem);
router.post('/updateordenenvio',updateOrdenEnvio);
router.post('/updateorden', updateOrden);
router.put('/revisarorden/:orden_id',revisarUnaOrden);
router.get('/:mlc', itemGet );
router.get('/envio/:id', buscarEnvio );
router.post('/prueba', prueba );
router.put('/stockupdate/:id', modificarCantidad );
router.put('/addstock/:id', addstock );
router.put('/updatesku/:id', modificarSku);
router.put('/dispstock/:id', disponibilidadStock );
router.post('/refrescar/:mlc', refrescarCantidad );
router.put('/updateprecio/:id', modificarPrecio);
router.get('/packid/:id', getPackId);





module.exports = router;