
const { Router } = require('express');

const { getHorario} = require('../controllers/horario');

const router = Router();


router.get('/horario', getHorario);



module.exports = router;