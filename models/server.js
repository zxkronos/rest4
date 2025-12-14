const express = require('express');
const cors = require('cors');
const body_parser = require("body-parser");

class Server {

    constructor() {
        this.app  = express().use(body_parser.json());;
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.itemsPath = '/api/items';
        this.meliPath = '/api/meli';
        this.wspPath = '/api/wsp';
        this.notifPath = '/api/notif';
        this.horarioPath = '/api/horario';
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

    }

    routes() {
        this.app.use( this.usuariosPath, require('../routes/usuarios'));
        this.app.use( this.itemsPath, require('../routes/items'));
        this.app.use( this.meliPath, require('../routes/token'));
        this.app.use( this.wspPath, require('../routes/wasap'));
        this.app.use( this.notifPath, require('../routes/notificaciones'));
        this.app.use( this.horarioPath, require('../routes/horario'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
