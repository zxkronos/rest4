
const { Router } = require('express');

const { notif, noti} = require('../controllers/notificaciones');

const router = Router();


router.post('/', notif );
router.post('/notis', noti );




module.exports = router;