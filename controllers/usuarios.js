const { response, request } = require('express');
const axios = require('axios');


const usuariosGet = (req = request, res = response) => {

    const { q, nombre = 'No name', apikey, page = 1, limit } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        page, 
        limit
    });
}

const usuariosPost = (req, res = response) => {

    const { nombre, edad } = req.body;

    res.json({
        msg: 'post API - usuariosPost',
        nombre, 
        edad
    });
}

const usuariosPut = (req, res = response) => {

    const { id } = req.params;

    res.json({
        msg: 'put API - usuariosPut',
        id
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - usuariosDelete'
    });
}

const articuloml =  async (req, res = response) => {



    // console.log(req.body.mlc);
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
            gtin1 = resp_item.data.attributes[atrib].value_name;
        }
        
    }

    res.json({
        'id': resp_item.data.id,
        'titulo': resp_item.data.title,
        'thumbnail': resp_item.data.thumbnail
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    articuloml
}