const superagent = require('superagent');
const { response, request } = require('express');
const axios = require('axios');
const Notificacion = require('../models/notis');
const Token = require('../models/token');

var meli = require('mercadolibre-nodejs-sdk');
let apiInstance = new meli.OAuth20Api();




const notif = async (req, res = response) => {

    let body = req.body;
    let tokenVacio;
    let tokenBD; 
    let tokenID;
    const count = await Token.countDocuments({});
    console.log(`Número de documentos en la colección: ${count}`);
    
    if(count === 0){
      console.log('La colección está vacía');
      tokenVacio = true;
      //console.log(tokenVacio);
    } else {
      console.log('La colección no está vacía');
      tokenVacio = false;
    }
    if(!tokenVacio){
      const token = await  Token.find({});
      const now = new Date();
      const diff = now - token[0].fecha;
      const hours = diff / 1000 / 60 / 60;
      
      if (hours > 5) {
        modificarToken = true;
        console.log("es mayor a 5 ",hours);
        await Token.deleteOne({ _id: token[0]._id });
        console.log("token antiguo eliminado");
      }else{
        modificarToken= false
      }
    }

  
    if (tokenVacio || modificarToken){


      await refrescarToken();
      const token = await  Token.find({});
      tokenID =  token[0].token;
      
        
    }else{
      const token = await  Token.find({});
      tokenID =  token[0].token;
    }

    const notific = new Notificacion({
        recurso: body.resource,
        id_usuario: body.user_id,
        topico: body.topic,
        intentos: body.attempts
      });

      if (body.topic == 'items') {

        let link = `${urlml+notific.recurso}?access_token=${tokenID}`
        console.log(`hola ${link}`);

        axios.get('https://api.mercadolibre.com/items/' + codProd)
            .then((response) => {
                console.log(response.data);
                // for (const dato of response.data) {
                //     console.log(dato.title);
                // }
            })
            .catch(function(error) {
                // handle error
                console.log(error);
            });

    }else if (body.topic == 'shipments'){

    }
      
      await noti.save()
        .then(() => {
          console.log('Registro guardado exitosamente');
        })
        .catch((error) => {
          console.error('Error al guardar el registro', error);
        });
        res.json({
            'id': 'hola notifx'
        });
}

const refrescarToken = async () =>{
  let opts = {
    grant_type: "refresh_token", // String |
    client_id: process.env.CLIENTID, // String |
    client_secret: process.env.CLIENTSECRET, // String |
    refresh_token: process.env.REFRESH_TOKEN, // String |
  };


const url = 'https://api.mercadolibre.com/oauth/token';

const config = {
  headers: {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
},
};


await axios.post(url, new URLSearchParams(opts).toString(), config)
.then((response) => {
 
tokenML = response.data.access_token
  //console.log(resp.slice(17, -155))
  //let token = resp.slice(17, -155)
// console.log('aquiii token ' + token);
  //let tokenRefresh = resp.slice(207, -2)

  
  const tokenBD = new Token({
    token: tokenML
});

tokenBD.save().then(() => { 
    console.log('Registro guardado exitosamente');
  })
  .catch((error) => {
    console.error('Error al guardar el registro', error);
  });
  
})
.catch((error) => {
  console.log(error);
});


}


const noti = async (req, res = response) => {

let body = req.body;

  const notific = new Notificacion({
    recurso: body.resource,
    id_usuario: body.user_id,
    topico: body.topic,
    intentos: body.attempts
  });
  
  await notific.save();

  res.sendStatus(200);
    // } else {
    //   await Token.findOne({})
    //     .then((documento) => {
    //       console.log(documento);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }
    // await axios.post('https://prod-08.brazilsouth.logic.azure.com:443/workflows/875c139c7b944307969236128033538d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5bC0c2LhWPY_UfjylxKfS7rPjRq7zwr76i7nRE5fcpc', 
    // {
    //     'id': 'chao'
    // })
    // res.json({
    //     'id': 'hola'
    // });
}


// app.post('/usuario', function(req, res) {

//     cargarDB();
//     let body = req.body;
//     //document.write('Hola');

//     historial.push({
//         recurso: body.resource,
//         id_usuario: body.user_id,
//         topico: body.topic,
//         intentos: body.attempts
//     });
//     //?access_token=${tokenml}

//     if (body.topic == 'items') {

//         let link = `${urlml}/items/MLC533979462?access_token=${tokens[0].token}`
//         console.log(`hola ${link}`);

//         axios.get('https://api.mercadolibre.com/items/' + codProd)
//             .then((response) => {
//                 console.log(response.data);
//                 // for (const dato of response.data) {
//                 //     console.log(dato.title);
//                 // }
//             })
//             .catch(function(error) {
//                 // handle error
//                 console.log(error);
//             });

//     }

//     guardarDB();

//     res.status(200).json({
//         ok: true,
//         mensaje: body.topic,
//         saludos: body
//     });

//     console.log(body);
// });


module.exports = {
    notif,
    noti
}