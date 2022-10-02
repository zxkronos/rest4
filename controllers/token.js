const { response, request } = require('express');
const axios = require('axios');

var meli = require('mercadolibre-nodejs-sdk');
let apiInstance = new meli.OAuth20Api();

const getcode =  async (req, res = response) => {
    llave = JSON.stringify(req.headers.llave);
    llave = llave.slice(1,-1);
    
    if (llave == process.env.LLAVE){

        const authUrl = apiInstance.apiClient.getBasePathFromSettings(6);
        apiInstance.apiClient.basePath = authUrl;
    
        let responseType = "code"; // String | 
        let clientId = "8554356626339314"; // String | 
        let redirectUri = "https://mercadolibre.cl/"; // String | 
        apiInstance.auth(responseType, clientId, redirectUri, (error, data, response) => {
            if (error) {
                console.error(error);
                res.json(error);
            } else {
                console.log('API called successfully.');
                console.log(response.redirects);
                res.json(response.redirects);
            }
        });
    }else{
        res.status(401).json({
            msg: 'No autorizado'
        });
        
    }
    

};


const gettoken =  async (req, res = response) => {
    llave = JSON.stringify(req.headers.llave);
    llave = llave.slice(1,-1);
    
    if (llave == process.env.LLAVE){
    
        let opts = {
            'grantType': "authorization_code", // String | 
            'clientId': "8554356626339314", // String | 
            'clientSecret': "pNVTD6W6Bb1052H8in0Jbim4f2sBr1qD", // String | 
            'redirectUri': 'https://mercadolibre.cl/', // String | 
            'code': "TG-632897677ccf6c0001529cfc-3459306690", // String | 
            //  TG-6069c2e7a79334000730a50f-345930669
            'refreshToken': "" // String | 
        };
        
        apiInstance.getToken(opts, (error, data, response) => {
            if (error) {
                console.error(error);
                res.json(error);
            } else {
                console.log('API called successfully.');
                resp = response.text;
                let token = resp.slice(17, -155)
                let tokemRefresh = resp.slice(207, -2)
    
                res.json({
                    'token': token,
                    'refresh token': refreshToken
                    // 'fotos': resp_item.data.pictures
                });
                // res.json(response);
                //console.log(response.text[0]);
            }
        });
    }else{
        res.status(401).json({
            msg: 'No autorizado'
        });
        
    }

};



const tokenrefresh =  async (req, res = response) => {
    llave = JSON.stringify(req.headers.llave);
    llave = llave.slice(1,-1);
    
    console.log(process.env.REFRESH_TOKEN);
    if (llave == process.env.LLAVE){
        
        let opts = {
            'grantType': "refresh_token", // String | 
            'clientId': "8554356626339314", // String | 
            'clientSecret': "pNVTD6W6Bb1052H8in0Jbim4f2sBr1qD", // String | 
            'redirectUri': 'https://mercadolibre.cl/', // String |  
            'refreshToken': process.env.REFRESH_TOKEN // String | 
        };
    
        apiInstance.getToken(opts, (error, data, response) => {
            if (error) {
                console.error(error);
                res.json(error);
            } else {
                // console.log('API called successfully.');
                
                resp = response.text;
                let token = resp.slice(17, -155)
                // console.log('aquiii token ' + token);
                let tokenRefresh = resp.slice(207, -2)
                
                res.json({
                    'token': token
                    // 'fotos': resp_item.data.pictures
                });
                //console.log(response.text[0]);
            }
        });
    }else{
        res.status(401).json({
            msg: 'No autorizado'
        });
        
    }

};

module.exports = {
    getcode,
    gettoken,
    tokenrefresh
}