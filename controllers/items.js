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
     
    const resp_item = await axios.get(getItem);

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


module.exports = {
    itemGet
}