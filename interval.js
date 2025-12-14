const { gettoken } = require('./controllers/token');
const Notificacion = require('./models/notis');
const Token = require('./models/token');
const axios = require('axios');
let tokenGlobal = '';

const actualizarOrden = async(items, envios)=>{
  await getToken1();
  for (const item of items) {

  }
  for (const envio of envios) {
    
  }
}


async function miFuncion() {
  await getToken1();
        try {
            console.log("ejecutando intervalo");

            //const tokenID = await getToken();
            //console.log(tokenID);
          // Obtener todas las notificaciones no revisadas
    //const notificaciones = await Notificacion.find({ $and: [{ revisado: false }, {topico: 'orders_v2'}]});

    // Agrupar las notificaciones por recurso
    const gruposNotificaciones = await Notificacion.aggregate([
      {
        $match: { revisado: false, // Condición 1: revisado es false
        topico: "orders_v2" // Condición 2: topico es 'orders_v2' 
      } // Filtrar las notificaciones no revisadas
      },
      {
        $group: {
          _id: "$recurso", // Agrupar por recurso
          notificaciones: { $push: "$$ROOT" } // Guardar todas las notificaciones en un array
        }
      }
    ]);

 
     for (const grupo of gruposNotificaciones) {
      if (grupo.notificaciones.length === 1) {
        const notificacionUnica = grupo.notificaciones[0]; //notificacionUnica es la notificacion de ML en Mongo
        //console.log('desde lengh 1 ', notificacionUnica.recurso);
        // Actualizar la notificación única si cumple las condiciones
        //console.log(notificacionUnica.estado);
        orden = await revisarOrden(notificacionUnica.recurso);//se revisa la venta en ML
        if (orden.estado === "paid" || orden.estado === "cancelled") {
          if (notificacionUnica.estado != orden.estado){ //el estado está vacío en caso de ser primera vez, luego revisa si cambió a cancelado.
            
            await enviarOrdenDataverse(orden);
            //console.log("recurso ",recurso);
            /*let recurso = '/shipments/'+orden.id_envio
            console.log("recurso ",recurso);
            let envio='';
            if(orden.id_envio != ''){
            envio = await revisarEnvio(recurso); 
            //console.log(envio);
            
            await enviarEnvioDataverse(envio);*/
            }
            //await enviarItemDataverse(orden.mlc,orden.id_orden);//envio mlc a powerapps para crear o actualizar publicaciones
            await Notificacion.findByIdAndUpdate(notificacionUnica._id, { $set: { estado: orden.estado, revisado: true } });
            console.log('entro');
          }else{
            console.log('no entro ya que ambos estados son iguales no hay necesidad de evaluarlos');
          }
        }
        else if (grupo.notificaciones.length > 1) {
        // Ordenar las notificaciones por fecha y hora (de más antigua a más reciente)
        grupo.notificaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        // Dejar la primera notificación y eliminar las demás
        const notificacionesEliminar = grupo.notificaciones.slice(1);
        const notificacionNoEliminar = grupo.notificaciones[0];
        //console.log('desde lengh 2 ', notificacionNoEliminar.recurso);
        
        // Actualizar la notificación que no se eliminará si cumple las condiciones
        orden = await revisarOrden(notificacionNoEliminar.recurso);
        if (orden.estado === "paid" || orden.estado === "cancelled" ) {
          if (notificacionNoEliminar.estado != orden.estado){
            
            await enviarOrdenDataverse(orden);//envio orden a PowerApps para crear o actualizar venta
            let recurso = '/shipments/'+orden.id_envio
            //console.log("recurso ",recurso);
            let envio = '';
            if(orden.id_envio != ''){
           // envio = await revisarEnvio(recurso); //nueva actualizacion comentado
            //console.log(envio);
            
            //await enviarEnvioDataverse(envio); //nueva actualizacion comentado
            }
            //await enviarItemDataverse(orden.mlc,orden.id_orden);//envio mlc a powerapps para crear o actualizar publicaciones //nueva actualizacion comentado
            await Notificacion.findByIdAndUpdate(notificacionNoEliminar._id, { $set: { estado: orden.estado, revisado: true } });
            console.log('entro en 2');
        }else{
          console.log('no entro en 2');
        }
        }
    
        // Eliminar las notificaciones
        await Promise.all(
          notificacionesEliminar.map(notificacion =>
            Notificacion.deleteOne({ _id: notificacion._id })
          )
        );
      }
    }

    const gruposNotiEnvios = await Notificacion.aggregate([
      {
        $match: { revisado: false, // Condición 1: revisado es false
        topico: "shipments" // Condición 2: topico es 'orders_v2' 
      } // Filtrar las notificaciones no revisadas
      },
      {
        $group: {
          _id: "$recurso", // Agrupar por recurso
          notificaciones: { $push: "$$ROOT" } // Guardar todas las notificaciones en un array
        }
      }
    ]);

    for (const grupo of gruposNotiEnvios) {
      //const notificacionUnica = grupo.notificaciones[0]
      //console.log(notificacionUnica);
      if (grupo.notificaciones.length === 1) {
        console.log('in1');
        const notificacionUnica = grupo.notificaciones[0]; //notificacionUnica es la notificacion de ML en Mongo
        //console.log('a ', notificacionUnica.recurso);
        //console.log('desde lengh 1 ', notificacionUnica.recurso);
        // Actualizar la notificación única si cumple las condiciones
        //console.log(notificacionUnica.estado);
        envio = await revisarEnvio(notificacionUnica.recurso);//se revisa la venta en ML
        //console.log(envio);
        //console.log('envio '+envio);
        
        if (notificacionUnica.estado != envio.estado_envio || notificacionUnica.subestado_envio != envio.subestado_envio){ //el estado está vacío en caso de ser primera vez, luego revisa si cambió a cancelado.
          //console.log("1 ",envio.recurso);
          await enviarEnvioDataverse(envio);
          
          await Notificacion.findByIdAndUpdate(notificacionUnica._id, { $set: { estado_envio: envio.estado_envio, subestado_envio: envio.subestado_envio, revisado:true  } });
          console.log('entro envio');
        }
        
      } else if (grupo.notificaciones.length > 1) {
        console.log('in2');
        // Ordenar las notificaciones por fecha y hora (de más antigua a más reciente)
        grupo.notificaciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
        // Dejar la primera notificación y eliminar las demás
        const notificacionesEliminar = grupo.notificaciones.slice(1);
        const notificacionNoEliminar = grupo.notificaciones[0];
        //console.log('desde lengh 2 ', notificacionNoEliminar.recurso);
        
        // Actualizar la notificación que no se eliminará si cumple las condiciones
        envio = await revisarEnvio(notificacionNoEliminar.recurso);
        //console.log(envio);
          if (notificacionNoEliminar.estado != envio.estado_envio || notificacionNoEliminar.subestado_envio != envio.subestado_envio){
            //console.log("2 ",envio.recurso);
            await enviarEnvioDataverse(envio);
          
          await Notificacion.findByIdAndUpdate(notificacionNoEliminar._id, { $set: { estado_envio: envio.estado_envio, subestado_envio: envio.subestado_envio , revisado:true } });
            console.log('entro en 2 envio');
        }
        
    
        // Eliminar las notificaciones
        await Promise.all(
          notificacionesEliminar.map(notificacion =>
            Notificacion.deleteOne({ _id: notificacion._id })
          )
        );
      }
    }

  }catch (error) {
        console.error(error);
        //console.log('error');
           }
    const fechaHoraActual = new Date().toString();

    console.log("ejecución terminada ",fechaHoraActual);

  
    }
    const revisarEnvio = async (id_envio) => {

      //console.log('ide envio '+id_envio);
      let getEnvio = 'https://api.mercadolibre.com'+id_envio;
        const config = { 
            headers: { Authorization: `Bearer ${tokenGlobal}` }
      };
        
      const resp_envio = await axios.get(getEnvio,config);
    
      estado_envio = resp_envio.data.status;
      subestado_envio = resp_envio.data.substatus;
      id_orden = resp_envio.data.order_id;
      let logistica = resp_envio.data.logistic_type;
      let tipo_envio = '';
      if(typeof logistica !== 'undefined'){
        if(logistica === 'self_service'){
          tipo_envio = "Flex";
      }else if (logistica === 'cross_docking'){
          tipo_envio = "Colecta";
      }
      }else{
      tipo_envio = "Entrega en persona";
      }
      direccion = resp_envio.data.receiver_address.address_line;
      ciudad_region = resp_envio.data.receiver_address.city.name+', '+resp_envio.data.receiver_address.state.name;
      referencia = resp_envio.data.receiver_address.comment ?? '';
      nombre = resp_envio.data.receiver_address.receiver_name ?? '';
      //region = resp_envio.data.receiver_address.state.name;
      //recibe = resp_envio.data.receiver_address.receiver_name;
      let id_envio2 = resp_envio.data.id.toString();
      let envio = {
        id_envio:id_envio2,
        id_orden: id_orden,
        estado_envio:estado_envio,
        subestado_envio:subestado_envio ?? '',
        tipo_envio: tipo_envio,
        direccion: direccion,
        ciudad_region: ciudad_region,
        referencia: referencia,
        nombre: nombre,
        date_shipped: resp_envio.data.status_history.date_shipped ?? '',
        date_returned: resp_envio.data.status_history.date_returned ?? '',
        date_delivered: resp_envio.data.status_history.date_returned ?? '',
        date_first_visit: resp_envio.data.status_history.date_first_visit ?? '',
        date_not_delivered: resp_envio.data.status_history.date_not_delivered ?? '',
        date_cancelled: resp_envio.data.status_history.date_cancelled ?? ''
      }
      //console.log(envio);
      return envio;
    }    
  
  const enviarEnvioDataverse = async(envio)=>{
    //await getToken1();
    //id_envio = '/shipments/42326030342';
    
    //envio = await revisarEnvio(id_envio);

    await axios.post('https://prod-21.brazilsouth.logic.azure.com:443/workflows/a88dd518be4a42ccbecb4370346f94fa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3qwrDJxIng_U26DlfW5jCJjVkbBERgzXDb9JxEh6vvU', 
    {
        envio
    })
    //console.log(envio);
  }
  setInterval(miFuncion, 10 * 60 * 500);

  const enviarItemDataverse = async (id_item,id_orden) => {
    //await getToken1();
    //await enviarOrdenDataverse(2000004491106395);
    //id_orden = 2000004491106395; 
    item = await getItem(id_item,id_orden);
    //item = await getItem('MLC1035044708','2000005767023070');
    
    //console.log(item);
    //orden= await revisarOrden('/orders/2000005329692650')
    //console.log(orden);
    resultado = await axios.post('https://prod-28.brazilsouth.logic.azure.com:443/workflows/52cc751afc4340cc807b6d025e95bb54/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=DO1gwCQCNcdGSAzbXllx2dTXMfddX7a3V6vlJFD627Q', 
    {
        item: item.articulo
    })
    //console.log('resultado ', resultado);
  }


  const enviarOrdenDataverse = async (orden) => {
    //await getToken1();
    //orden = await revisarOrden("/orders/2000005653346558");
    //console.log(orden);
     await axios.post('https://prod-08.brazilsouth.logic.azure.com:443/workflows/875c139c7b944307969236128033538d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5bC0c2LhWPY_UfjylxKfS7rPjRq7zwr76i7nRE5fcpc', 
     {
         orden 
    })
    
}

const eliminarRegistros = async () => {
  // Seleccionar los primeros 800 registros
const documentos = await Notificacion.find({}).limit(8000);

// Obtener los IDs de los documentos seleccionados
const idsDocumentos = documentos.map(doc => doc._id);

// Eliminar los documentos seleccionados
await Notificacion.deleteMany({ _id: { $in: idsDocumentos } });
}



const revisarOrden = async (orden_id) =>{
    
    //orden_id = '/orders/2000005329692650'; 
    
    
    let getOrden = 'https://api.mercadolibre.com'+orden_id;
    const config = { 
        headers: { Authorization: `Bearer ${tokenGlobal}` }
    };
    
     
    const resp_orden = await axios.get(getOrden,config);
    //console.log(resp_orden);
    //console.log(resp_orden.data.order_items[0].item.id);
//console.log(resp_orden.data.tags);

    //let envio = '';
    let id_envio = ''
    if(resp_orden.data.shipping.id){
    id_envio = resp_orden.data.shipping.id.toString();
  
  }
    /*for (tag in resp_orden.data.tags) {
      //console.log(resp_orden.data.tags[tag]);
      if (resp_orden.data.tags[tag] === "not_delivered"){
        envio = resp_orden.data.tags[tag];
      }else if (resp_orden.data.tags[tag] === "delivered"){
        envio = resp_orden.data.tags[tag];
      }

    }*/
    

    let orden = {
      id_orden: resp_orden.data.id, 
      mlc: resp_orden.data.order_items[0].item.id,
      titulo: resp_orden.data.order_items[0].item.title,
      sku: resp_orden.data.order_items[0].item.seller_sku ?? '',
      monto_venta: resp_orden.data.total_amount,
      cargo_venta: resp_orden.data.order_items[0].sale_fee*resp_orden.data.order_items[0].quantity,
      cantidad: resp_orden.data.order_items[0].quantity,
      estado: resp_orden.data.status,
      id_envio: id_envio,
      canal_venta: resp_orden.data.context.channel,
      fecha_creacion: resp_orden.data.date_closed,
      nickname: resp_orden.data.buyer.nickname,
      nombre: resp_orden.data.buyer.first_name+' '+resp_orden.data.buyer.last_name,
      pack_id: resp_orden.data.pack_id ?? '',
      token: tokenGlobal
    }
    //console.log(orden);
    return orden;
}

  const getToken1 = async () =>{
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
      //tokenID = await  Token.find({})[0].token;
      //const token = await Token.findOne();
      //const tokenID = token ? token.token : null;
      //console.log('hola');  
      //console.log("token[0] ", token[0]);
      //tokenID =  token[0].token;
       
        
    }else{
      const token = await  Token.find({});
      //console.log("token[0] ", token[0]);
      tokenGlobal =  token[0].token;
    }
    console.log("tokenid ",tokenGlobal);
    //return tokenID;

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
    tokenGlobal = response.data.access_token;
    //console.log('desde refrescar ', tokenML);
    const tokenBD = new Token({
      token: tokenML 
  });
  
  tokenBD.save(); 
  
})
  .then(() => { 
      console.log('Registro guardado exitosamente');
      
    })
    .catch((error) => {
      console.error('Error al guardar el registro', error);
    });

  };
  
  

const getItem = async (mlc,id_orden) =>{
  
    let pictures_url = []  
    const config = {
        headers: { Authorization: `Bearer ${tokenGlobal}` }
    };

    //const { mlc } = req.params;
    let getItem = 'https://api.mercadolibre.com/items/'
    // const config = {
    //     headers: { Authorization: `Bearer ${tokens[0].token}` }
    // };


    testMouseM170Catalogo = 'MLC605369288'
    testMouseM170Normal = 'MLC487543221'
    testMlc = testMouseM170Normal;
    getItem += mlc+'?include_attributes=all' //item con variaciones
    estatus = 200; 
    const resp_item = await axios.get(getItem, config);

    if(resp_item.data.seller_id = 345930669){
        userCorrecto = true
    }else{
        userCorrecto = false
    }
    //console.log(resp_item.data);

    //esfalso = false
    if (estatus == 200 && userCorrecto) {
    let sku = '';
    let gtin = '';
    let color = '';
    let catalog_id = '';
    let tieneVariacion =false;
    let variaciones = []
    let tipo_envio = '';
    let disponibilidad_stock = 0;
    let item_relation = '';
    let cantidad_vendida = 0;
    let modelo = '';
    // let fotos_var = [];

    //  sin variaciones, entran también publicaciones en catalogo
    

    cantidad_vendida= resp_item.data.sold_quantity;
    //console.log(cantidad_vendida);
    for (tag in resp_item.data.shipping.tags) {
        if (resp_item.data.shipping.tags[tag] == 'self_service_out'){
            tipo_envio = 'colecta';
        }else if (resp_item.data.shipping.tags[tag] == 'self_service_in'){
            tipo_envio = 'flex';
        }
    }
    if (tipo_envio == ''){
        for(sale_term in resp_item.data.sale_terms){
            if (resp_item.data.sale_terms[sale_term].id == 'MANUFACTURING_TIME'){
                disponibilidad_stock = resp_item.data.sale_terms[sale_term].value_name;
            }
        }
        tipo_envio = 'colecta';
    }


    // let getCategoria = 'https://api.mercadolibre.com/categories/'
    // getCategoria += resp_item.data.category_id;
    // let resp_cat = await axios.get(getCategoria);

    if (resp_item.data.variations.length > 0) {
        tieneVariacion = true;
        

        for (atrib in resp_item.data.attributes) {
            
            if (resp_item.data.attributes[atrib].id == 'BRAND') {
                marca = resp_item.data.attributes[atrib].value_name;
            }
            
            if(resp_item.data.attributes[atrib].id == 'MODEL'){
                modelo = resp_item.data.attributes[atrib].value_name;
            }
           
    
            
        }

        for (variation in resp_item.data.variations) {
            let pictures_url = []
            id_variacion = resp_item.data.variations[variation].id;
            id_variacion = id_variacion.toString();
            cantidad_vendida = resp_item.data.variations[variation].sold_quantity;
            // color = resp_item.data.variations[0].attribute_combinations[0].value_name;   
            
            cantidad = resp_item.data.variations[variation].available_quantity;
            for(atrib in resp_item.data.variations[variation].attributes){
                if(resp_item.data.variations[variation].attributes[atrib].id == 'SELLER_SKU'){

                    sku = resp_item.data.variations[variation].attributes[atrib].value_name; 
                }else if(resp_item.data.variations[variation].attributes[atrib].id == 'GTIN'){

                    gtin = resp_item.data.variations[variation].attributes[atrib].value_name; 
                }
                else if(resp_item.data.variations[variation].attributes[atrib].id == 'MAIN_COLOR'){

                    color = resp_item.data.variations[variation].attributes[atrib].value_name; 
                }
                else if(resp_item.data.variations[variation].attributes[atrib].id == 'COLOR'){

                    color = resp_item.data.variations[variation].attributes[atrib].value_name; 
                }
                
                
            }
            for(atrib in resp_item.data.variations[variation].attribute_combinations){
                if(resp_item.data.variations[variation].attribute_combinations[atrib].id == 'COLOR'){
                    color = resp_item.data.variations[variation].attribute_combinations[atrib].value_name;
                }
            }



           /* for (picture in resp_item.data.variations[variation].picture_ids) {
                picture = resp_item.data.variations[variation].picture_ids[picture]
                
                pictures_url.push(picture);
            }*/
        
            if( resp_item.data.variations[variation].item_relations?.length >0){
                item_relation = resp_item.data.variations[variation].item_relations[0].id;
            }

            if (resp_item.data.variations[variation].catalog_product_id){
                catalog_id = resp_item.data.variations[variation].catalog_product_id;
            }

            if(gtin == null){
                gtin = ''
            }

            variaciones.push({
                'id': id_variacion,
                'sku': sku,
                'gtin': gtin,
                'color': color,
                'cantidad': cantidad,
                'catalog_id': catalog_id, //id de la publicacion en catalogo de mercado libre
                //'pictures_url': pictures_url,
                'item_relation': item_relation

            });

    }
    /*sku ='';
    gtin = '';
    color = '';
    catalog_id = '';
    cantidad = '';*/
    
    
    
    }else{
        tieneVariacion = false;
        for (atrib in resp_item.data.attributes) {
            // console.log('atrib');
            if (resp_item.data.attributes[atrib].id == 'SELLER_SKU') { //sacara el sku y gtin en caso que no tenga variaciones
                sku = resp_item.data.attributes[atrib].value_name;
            }
            if (resp_item.data.attributes[atrib].id == 'BRAND') {
                marca = resp_item.data.attributes[atrib].value_name;
            }
            
            if(resp_item.data.attributes[atrib].id == 'MODEL'){
                modelo = resp_item.data.attributes[atrib].value_name;
            }
            if(resp_item.data.attributes[atrib].id == 'GTIN'){ //codigo universal de producto
                gtin = resp_item.data.attributes[atrib].value_name;
            }
            if(resp_item.data.attributes[atrib].id == 'COLOR'){
                color = resp_item.data.attributes[atrib].value_name;
            }
    
            
        }
        
        if (resp_item.data.catalog_product_id){
            catalog_id = resp_item.data.catalog_product_id;
        }
 
        if(resp_item.data.item_relations?.length > 0){
            // console.log('in en sin variacion');
            item_relation = resp_item.data.item_relations[0].id;
        }

        /*for (picture in resp_item.data.pictures) {
            picture = resp_item.data.pictures[picture].id
            
            pictures_url.push(picture);
        }*/
    
    }
    if (disponibilidad_stock != 0){
      disponibilidad_stock = disponibilidad_stock.substring(0,1);
      //console.log(disponibilidad_stock[0]);
    }

    titulo = resp_item.data.title;
    if(titulo.length > 100){
      titulo = titulo.slice(0,100);
    }
    let thumbnail = "https://http2.mlstatic.com/D_"+resp_item.data.thumbnail_id+"-I.jpg"
    let item = {
        articulo: {
          'id': resp_item.data.id,
          'titulo': titulo,
          'thumbnail': thumbnail,
          'sku': sku,
          'marca': marca ?? '',
          'modelo': modelo ?? '',
          'gtin': gtin,
          'categoria': resp_item.data.category_id,
          'cantidad': resp_item.data.available_quantity,
          'precio': resp_item.data.price,
          'color': color,
          'fecha_creacion': resp_item.data.date_created,
          'fecha_actualizacion': resp_item.data.last_updated,
          'estatus': resp_item.data.status,
          'condicion': resp_item.data.condition,
          'catalog_id': catalog_id,
          'tieneVariacion': tieneVariacion,
          'catalog_listing': resp_item.data.catalog_listing, //si es catalogo o no
          'disponibilidad_stock': disponibilidad_stock,
          'tipo_envio': tipo_envio,
          'item_relation': item_relation,
          'sold_quantity': cantidad_vendida,
          'id_orden': id_orden,
          'variaciones': variaciones 
        }
        //'pictures': pictures_url,
        
        

        // 'fotos': resp_item.data.pictures
    }
    return item;
  }



}

const updateItem =async(id_orden, mlc) => {
  
    const config = {
        headers: { Authorization: `Bearer ${tokenGlobal}` }
    };

    
    let getItem = 'https://api.mercadolibre.com/items/'
    


    testMouseM170Catalogo = 'MLC605369288'
    testMouseM170Normal = 'MLC487543221'
    testMlc = testMouseM170Normal;
    getItem += mlc+'?include_attributes=all' //item con variaciones
    estatus = 200; 
    const resp_item = await axios.get(getItem, config);

    if(resp_item.data.seller_id = 345930669){
        userCorrecto = true
    }else{
        userCorrecto = false
    }
    
    if (estatus == 200 && userCorrecto) {
    
    let color = '';
    
    let tieneVariacion =false;
    
    let modelo = '';
    
    
    
    if (resp_item.data.variations.length > 0) {
        tieneVariacion = true;
        

        for (atrib in resp_item.data.attributes) {
           
            if(resp_item.data.attributes[atrib].id == 'MODEL'){
                modelo = resp_item.data.attributes[atrib].value_name;
            }
        }

        for (variation in resp_item.data.variations) {
        
            // color = resp_item.data.variations[0].attribute_combinations[0].value_name;   
            
            cantidad = resp_item.data.variations[variation].available_quantity;
            for(atrib in resp_item.data.variations[variation].attributes){
                
                if(resp_item.data.variations[variation].attributes[atrib].id == 'COLOR'){

                    color = resp_item.data.variations[variation].attributes[atrib].value_name; 
                }
                
                
            }
            for(atrib in resp_item.data.variations[variation].attribute_combinations){
                if(resp_item.data.variations[variation].attribute_combinations[atrib].id == 'COLOR'){
                    color = resp_item.data.variations[variation].attribute_combinations[atrib].value_name;
                }
            }
        
            
            

    }
    
    }else{
        tieneVariacion = false;
        for (atrib in resp_item.data.attributes) {
            
            if(resp_item.data.attributes[atrib].id == 'MODEL'){
                modelo = resp_item.data.attributes[atrib].value_name;
            }
            if(resp_item.data.attributes[atrib].id == 'COLOR'){
                color = resp_item.data.attributes[atrib].value_name;
            }
    
            
        }
        
        
 
    
    }
    let thumbnail = "https://http2.mlstatic.com/D_"+resp_item.data.thumbnail_id+"-I.jpg"
    let item = {
        articulo: {
          'id': resp_item.data.id,
          'thumbnail': thumbnail,
          'modelo': modelo,
          'color': color,
          'condicion': resp_item.data.condition,
          'id_orden': id_orden,
        }
    }

    return item;

}
}

  module.exports = {
    start: miFuncion,
    revisarOrden: revisarOrden,
    eliminarRegistros: eliminarRegistros,
    enviarOrdenDataverse: enviarOrdenDataverse,
    enviarItemDataverse: enviarItemDataverse,
    enviarEnvioDataverse: enviarEnvioDataverse,
    actualizarOrden:actualizarOrden
  }