const { response, request } = require('express');
const axios = require('axios');


const itemGet =  async (req, res = response) => {


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
    const resp_item = await axios.get(getItem).
    catch(err => {
        // console.log('hola');
        // console.log(err.response.data);
        estatus = 404;
        res.status(404).json({
            msg: err.response.data
        });
        
    });
    if (estatus == 200) {
    let sku = '';
    let gtin = '';

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
    buscarEnvio
}