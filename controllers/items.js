const { response, request } = require('express');
const axios = require('axios');


const itemGet =  async (req, res = response) => {

    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    let pictures_url = []   
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const { mlc } = req.params;
    let getItem = 'https://api.mercadolibre.com/items/'
    // const config = {
    //     headers: { Authorization: `Bearer ${tokens[0].token}` }
    // };


    testMouseM170Catalogo = 'MLC605369288'
    testMouseM170Normal = 'MLC487543221'
    testMlc = testMouseM170Normal;
    getItem += mlc+'?include_attributes=all' //item con variaciones
    estatus = 200; 
    const resp_item = await axios.get(getItem, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
        
    });

    if(resp_item.data.seller_id = 345930669){
        userCorrecto = true
    }else{
        userCorrecto = false
    }
    console.log(resp_item.data);

    //esfalso = false
    if (estatus == 200 && userCorrecto) {
    let sku = '';
    let gtin = '';
    let color = '';
    let catalog_id = '';
    let tieneVariacion =false;
    let variaciones = []
    let tipo_envio = '';
    let disponibilidad_stock = '';
    let item_relation = '';
    // let fotos_var = [];

    //  sin variaciones, entran también publicaciones en catalogo
    

    
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
            for (picture in resp_item.data.variations[variation].picture_ids) {
                picture = resp_item.data.variations[variation].picture_ids[picture]
                
                pictures_url.push(picture);
            }
        
            if( resp_item.data.variations[variation].item_relations.length >0){
                item_relation = resp_item.data.variations[variation].item_relations[0].id;
            }

            if (resp_item.data.variations[variation].catalog_product_id){
                catalog_id = resp_item.data.variations[variation].catalog_product_id;
            }

            variaciones.push({
                'id': id_variacion,
                'sku': sku,
                'gtin': gtin,
                'color': color,
                'cantidad': cantidad,
                'catalog_id': catalog_id, //id de la publicacion en catalogo de mercado libre
                'pictures_url': pictures_url,
                'item_relation': item_relation

            });

    }
    sku ='';
    gtin = '';
    color = '';
    catalog_id = '';
    cantidad = '';
    
    
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
        if(resp_item.data.item_relations.length > 0){
            // console.log('in en sin variacion');
            item_relation = resp_item.data.item_relations[0].id;
        }

        for (picture in resp_item.data.pictures) {
            picture = resp_item.data.pictures[picture].id
            
            pictures_url.push(picture);
        }

    }


    res.json({
        'id': resp_item.data.id,
        'titulo': resp_item.data.title,
        'thumbnail': resp_item.data.secure_thumbnail,
        'sku': sku,
        'marca': marca,
        'modelo': modelo,
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
        'pictures': pictures_url,
        'variaciones': variaciones,
        'tieneVariacion': tieneVariacion,
        'catalog_listing': resp_item.data.catalog_listing, //si es catalogo o no
        'disponibilidad_stock': disponibilidad_stock,
        'tipo_envio': tipo_envio,
        'item_relation': item_relation

        // 'fotos': resp_item.data.pictures
    });
}else{
    res.status(404).json({
        msg: 'usuario incorrecto'
    });
}
}

const refrescarCantidad = async (req, res) => {

    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const { mlc } = req.params;
    let getItem = 'https://api.mercadolibre.com/items/'
    // const config = {
    //     headers: { Authorization: `Bearer ${tokens[0].token}` }
    // };


    getItem += mlc+'?include_attributes=all' //item con variaciones
    
    estatus = 200; 
    const { id_var } = req.body;
    const resp_item = await axios.get(getItem, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
        
    });

    let cantidad = 0;
    if (id_var){
        for (variation in resp_item.data.variations) {
            if (resp_item.data.variations[variation].id == id_var){
                cantidad = resp_item.data.variations[variation].available_quantity;
            }
        }

    }else{
        cantidad = resp_item.data.available_quantity;
    }
    
    

    if (estatus == 200) {
        res.json({
            
            'cantidad':cantidad,
            'estado': resp_item.data.status
            
        });

    }
}


const modificarCantidad = async (req, res) => {
    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    const { id} = req.params;
    const { id_var,vars, available_quantity } = req.body;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    estatus = 200;
    if(id_var){
        varsCopia = vars
        if(vars.endsWith(',')){
            varsCopia = vars.slice(0,-1);
        }

        varsSplit = varsCopia.split(',');
        variations = [];
        for (vari in varsSplit) {
            
            if (varsSplit[vari] == id_var){
                
                variations.push({
                    'id': varsSplit[vari],
                    'available_quantity': available_quantity
                });
    
            }else{
                variations.push({
                    'id': varsSplit[vari]
                });
            }
        }
        body = {
            "variations": variations
        }

    }else{

        body = {
            "available_quantity": available_quantity
        }
    }
    

    let resp_item = await axios.put(`https://api.mercadolibre.com/items/${id}`, body, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });
    body2 = {
        "status": "active"
    }

    if (resp_item.data.status == 'paused') {
        let resp2 = await axios.put(`https://api.mercadolibre.com/items/${id}`, body2, config).
        catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });
        estado = resp2.data.status; 
    }else{
        estado = resp_item.data.status;
    }
    
    if (estatus == 200 && id_var){
        for (vari in resp_item.data.variations) {
            if (resp_item.data.variations[vari].id == id_var){
                res.json({
                    'available_quantity': resp_item.data.variations[vari].available_quantity,
                    'estado': estado
                });
            }
        }
    }else if (estatus == 200){

        res.json({
            'available_quantity': resp_item.data.available_quantity,
            'estado': estado
        });
    }
}

const disponibilidadStock = async (req, res) => {
    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    const {id} = req.params;
    const { days } = req.body;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    estatus = 200;
    //console.log(days);
    disp = days+' días';
    //console.log(disp);
    body = {
        "sale_terms": [{
            "id": "MANUFACTURING_TIME",
            "value_name": disp
        }]

    }
    
   // console.log(`https://api.mercadolibre.com/sites/MLC/shipping/selfservice/items/${id}`);

    resp = await axios.put(`https://api.mercadolibre.com/items/${id}`,body, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });
    // console.log(resp_item); 
    
    if(estatus == 200){
        res.json({
            'resp': resp.data
        });
    }

}

const addstock = async (req, res) => {
    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    const { id} = req.params;
    const { id_var,vars, cantidad } = req.body;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    estatus = 200;
    

    let item_api = await axios.get(`https://api.mercadolibre.com/items/${id}`, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });

    if(id_var && estatus == 200){

        for (vari in item_api.data.variations) {
            if (item_api.data.variations[vari].id == id_var){
                
                cantidad_disp = item_api.data.variations[vari].available_quantity
                
            }
        }
        
        
        varsSplit = vars.split(',');
        variations = [];
        for (vari in varsSplit) {
            
            if (varsSplit[vari] == id_var){
                
                variations.push({
                    'id': varsSplit[vari],
                    'available_quantity': cantidad_disp + cantidad
                });
    
            }else{
                variations.push({
                    'id': varsSplit[vari]
                });
            }
        }

        body = {
            "variations": variations
        }
        console.log(body);

    }else if (estatus == 200){
        cant_disp = item_api.data.available_quantity

        body = {
            "available_quantity": cantidad + cant_disp
        }
    }
    

    let resp_item = await axios.put(`https://api.mercadolibre.com/items/${id}`, body, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });
    
    if (estatus == 200 && id_var){
        for (vari in resp_item.data.variations) {
            if (resp_item.data.variations[vari].id == id_var){
                res.json({
                    'available_quantity': resp_item.data.variations[vari].available_quantity
                });
            }
        }
    }else if (estatus == 200){

        res.json({
            'available_quantity': resp_item.data.available_quantity
        });
    }
}


const modificarSku = async (req, res) => {
    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    const { id} = req.params;
    const { id_var,vars, sku } = req.body;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    estatus = 200;
    if(id_var){
        
        varsSplit = vars.split(',');
        variations = [];
        for (vari in varsSplit) {
            
            if (varsSplit[vari] == id_var){
                
                variations.push({
                    'id': varsSplit[vari],
                    'attributes': [
                        {
                            'id': 'SELLER_SKU',
                            'value_name': sku
                        }
                    ]
                });
    
            }else{
                variations.push({
                    'id': varsSplit[vari]
                });
            }
        }
        body = {
            "variations": variations
        }

    }else{

        body = {
            "attributes": [
                {
                    'id': 'SELLER_SKU',
                    'value_name': sku
                }

            ]
        }
    }
    

    let resp_item = await axios.put(`https://api.mercadolibre.com/items/${id}`, body, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });
    
    if (estatus == 200 && id_var){
        for (vari in resp_item.data.variations) {
            if (resp_item.data.variations[vari].id == id_var){
                for(att in resp_item.data.variations[vari].attributes){
                    if(resp_item.data.variations[vari].attributes[att].id == 'SELLER_SKU'){


                        res.json({
                            'sku': resp_item.data.variations[vari].attributes[att].value_name
                        });
                    }
                }
            }
        }
    }else if (estatus == 200){
        
        for(att in resp_item.data.attributes){
            if(resp_item.data.attributes[att].id == 'SELLER_SKU'){


                res.json({
                    'sku': resp_item.data.attributes[att].value_name
                });
            }
        }
        
    }
}


const modificarPrecio = async (req, res) => {
    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    const { id} = req.params;
    const { id_var,vars, price } = req.body;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    estatus = 200;
    if(id_var){
        
        varsSplit = vars.split(',');
        variations = [];
        for (vari in varsSplit) {
            
            if (varsSplit[vari] == id_var){
                
                variations.push({
                    'id': varsSplit[vari],
                    'price': price
                });
    
            }else{
                variations.push({
                    'id': varsSplit[vari]
                });
            }
        }
        body = {
            "variations": variations
        }

    }else{

        body = {

            'price': price
                

        }
    }
    
    
    let resp_item = await axios.put(`https://api.mercadolibre.com/items/${id}`, body, config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
    });
    
    if (estatus == 200 && id_var){
        
        res.json({
            'respuesta': 'ok con var'
        });
        
    }else if (estatus == 200){
        
        res.json({
            'respuesta': 'ok sin var'
        });
            
        
        
    }
}



const buscarEnvio = async (req, res = response) => {

    token = JSON.stringify(req.headers.token);
    token = token.slice(1,-1);
    const { id } = req.params;
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    getShipment = 'https://api.mercadolibre.com/shipments/'+id
    estatus = 200;
    const resp_envio = await axios.get(getShipment,config).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
        
    });
    let getItem = 'https://api.mercadolibre.com/items/';
    let items = []
    let pictures_url = []
    let picture = {
        'url': ''
    }
    let articulo ={
        'id': '',
        'descripcion': '',
        'modelo': '',
        'cantidad': '',
        'precio': '',
        'thumbnail': '',
        'pictures': [],
        'condition': '',

    };
    if (estatus == 200) {
    for (item in resp_envio.data.shipping_items) {
        
        articulo.id = resp_envio.data.shipping_items[item].id;
        articulo.descripcion = resp_envio.data.shipping_items[item].description;
        articulo.cantidad = resp_envio.data.shipping_items[item].quantity;
       
        const resp_item = await axios.get(getItem+resp_envio.data.shipping_items[item].id,config).
        catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
        
        });
        for (picture in resp_item.data.pictures) {
            picture = {
                'url': resp_item.data.pictures[picture].secure_url
            }
            pictures_url.push(picture);
        }
        articulo.precio = resp_item.data.price;
        articulo.thumbnail = resp_item.data.secure_thumbnail;
        articulo.pictures = pictures_url;
        articulo.condition = resp_item.data.condition;

        for (atrib in resp_item.data.attributes) {
            
            if(resp_item.data.attributes[atrib].id == 'MODEL'){
                articulo.modelo = resp_item.data.attributes[atrib].value_name;
            }
 
        }
        
        console.log('articulo model: '+articulo.modelo);

        items.push({
            'id': articulo.id,
            'descripcion': articulo.descripcion,
            'modelo': articulo.modelo,
            'cantidad': articulo.cantidad,
            'precio': articulo.precio,
            'thumbnail': articulo.thumbnail,
            'pictures': articulo.pictures,
            'condition': articulo.condition,
        }
        );
        
    }
    
        if (resp_envio.data.tracking_method == null){
            envia = 'Flex'
        }else{
            envia = 'Colecta'
        }
        if (resp_envio.data.receiver_address.comment == null){
            detalle_direccion = ''
        }else{
            detalle_direccion = resp_envio.data.receiver_address.comment
        }
        if (resp_envio.data.substatus== null){
            subestado = ''
        }else{
            subestado = resp_envio.data.substatus
        }

    
        res.json({
            'id': resp_envio.data.id,
            'estado': resp_envio.data.status,
            'subestado': subestado,
            'orden': resp_envio.data.order_id,
            'recibe': resp_envio.data.receiver_address.receiver_name,
            'fecha': resp_envio.data.date_created,
            'direccion': resp_envio.data.receiver_address.address_line,
            'detalle_direccion':detalle_direccion,
            'envia': envia,
            'costo_orden': resp_envio.data.order_cost,
            'items': items
        });
    }
    // getVenta ='https://api.mercadolibre.com/orders/'+resp_envio.data.order_id; 

    // const resp_venta = await axios.get(getVenta,config).
    // catch(err => {
    //     // console.log('hola');
    //     // console.log(err.response.data);
    //     estatus = 404;
    //     res.status(404).json({
    //         msg: err.response.data
    //     });
        
    // });
    // let getItem = 'https://api.mercadolibre.com/items/'+resp_venta.data.order_items[0].item.id;

    // const resp_art = await axios.get(getItem,config).
    // catch(err => {
    //     // console.log('hola');
    //     // console.log(err.response.data);
    //     estatus = 404;
    //     res.status(404).json({
    //         msg: err.response.data
    //     });
        
    // });



}
const prueba = async (req, res = response) => {

    await axios.post('https://prod-08.brazilsouth.logic.azure.com:443/workflows/875c139c7b944307969236128033538d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5bC0c2LhWPY_UfjylxKfS7rPjRq7zwr76i7nRE5fcpc', 
    {
        'id': 'chao'
    })
    res.json({
        'id': 'hola'
    });
}


const buscarSku =  async (req, res = response) => {


    const { sku } = req.params;
    let getItem = 'https://api.mercadolibre.com/items/'
    // const config = {
    //     headers: { Authorization: `Bearer ${tokens[0].token}` }
    // };
    


    testMouseM170Catalogo = 'MLC605369288'
    testMouseM170Normal = 'MLC487543221'
    testMlc = testMouseM170Normal;
    getItem += mlc+'?include_attributes=all' //item con variaciones
     
    const resp_item = await axios.get(getItem);

    // let sku = '';
    let gtin = '';
    let modelo = '';
    // console.log(resp_item.data);
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
        
    }


    console.log(modelo);
    let getCategoria = 'https://api.mercadolibre.com/categories/'
    getCategoria += resp_item.data.category_id;
    let resp_cat = await axios.get(getCategoria);

    if (resp_item.data.variations.length > 0) {
        
        
        
        id_variacion = resp_item.data.variations[0].id;
        color = resp_item.data.variations[0].attribute_combinations[0].value_name;   
        fotos_var = [];
        cantidad = resp_item.data.variations[0].available_quantity;
        for(atrib in resp_item.data.variations[0].attributes){
            if(resp_item.data.variations[0].attributes[atrib].id == 'SELLER_SKU'){

                sku = resp_item.data.variations[0].attributes[atrib].value_name; 
            }
            if(resp_item.data.variations[0].attributes[atrib].id == 'GTIN'){

                gtin = resp_item.data.variations[0].attributes[atrib].value_name; 
            }
            
        }
        for (picture in resp_item.data.variations[0].picture_ids) {

            fotos_var.push(resp_item.data.variations[0].picture_ids[picture]);
        }
                      


    }



    res.json({
        'id': resp_item.data.id,
        'titulo': resp_item.data.title,
        'thumbnail': resp_item.data.thumbnail,
        'sku': sku,
        'marca': marca,
        'modelo': modelo,
        'gtin': gtin,
        'categoria': resp_cat.data.name,
        'cantidad': resp_item.data.available_quantity
        // 'fotos': resp_item.data.pictures
    });
}


module.exports = {
    itemGet,
    buscarEnvio,
    prueba,
    modificarCantidad,
    addstock,
    modificarSku,
    disponibilidadStock,
    refrescarCantidad,
    modificarPrecio
}