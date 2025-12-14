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
        let redirectUri = "https://pcprice.fly.dev"; // String | 
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
        console.log(process.env.CODE)
        let opts = {
            'grant_type': "authorization_code", // String | 
            'client_id': process.env.CLIENTID, // String | 
            'client_secret': process.env.CLIENTSECRET,
            'code': process.env.CODE,
            'redirect_uri':"https://pcprice.fly.dev" 
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
         
        token = response.data.access_token;
        token_refresh = response.data.token_refresh;
        console.log('API called successfully.');
        console.log(token_refresh)
        console.log(response.data)    
    
        res.json({
            'token': token,
            'refresh token': token_refresh
                // 'fotos': resp_item.data.pictures
        });  
        
       
        })
        .catch((error) => {
          console.log(error);
        });

        
    }else{
        res.status(401).json({
            msg: 'No autorizado'
        });
        
    }


        
    //     apiInstance.getToken(opts, (error, data, response) => {
    //         if (error) {
    //             console.error(error);
    //             res.json(error);
    //         } else {
    //             console.log('API called successfully.');
    //             resp = response.text;
    //             let token = resp.slice(17, -155)
    //             let tokemRefresh = resp.slice(207, -2)
    
    //             res.json({
    //                 'token': token,
    //                 'refresh token': refreshToken
    //                 // 'fotos': resp_item.data.pictures
    //             });
    //             // res.json(response);
    //             //console.log(response.text[0]);
    //         }
    //     });
    // }else{
    //     res.status(401).json({
    //         msg: 'No autorizado'
    //     });
        
    // }

};



const tokenrefresh =  async (req, res = response) => {
    llave = JSON.stringify(req.headers.llave);
    llave = llave.slice(1,-1);
    
    
    if (llave == process.env.LLAVE){
        

        let opts = {
            grant_type: "refresh_token", // String |
            client_id: process.env.CLIENTID, // String |
            client_secret: process.env.CLIENTSECRET, // String |
            refresh_token: process.env.REFRESH_TOKEN, // String |
          };

        // let opts2 = {
        //     'grantType': "refresh_token", // String | 
        //     'clientId': process.env.CLIENTID, // String | 
        //     'clientSecret': process.env.CLIENTSECRET, // String | 
        //     'redirectUri': 'https://mercadolibre.cl/', // String |  
        //     'refreshToken': process.env.REFRESH_TOKEN // String | 
        // };
    
        const url = 'https://api.mercadolibre.com/oauth/token';
  
        const config = {
          headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      
      axios.post(url, new URLSearchParams(opts).toString(), config)
        .then((response) => {
         
        token = response.data.access_token
          //console.log(resp.slice(17, -155))
          //let token = resp.slice(17, -155)
        // console.log('aquiii token ' + token);
          //let tokenRefresh = resp.slice(207, -2)
        
        res.json({
            'token': token
            // 'fotos': resp_item.data.pictures
        });
        })
        .catch((error) => {
          console.log(error);
        });

        // apiInstance.getToken(opts, (error, data, response) => {
        //     if (error) {
        //         console.error(error);
        //         res.json(error);
        //     } else {
        //         // console.log('API called successfully.');
                
        //         resp = response.text;
        //         let token = resp.slice(17, -155)
        //         // console.log('aquiii token ' + token);
        //         let tokenRefresh = resp.slice(207, -2)
                
        //         res.json({
        //             'token': token
        //             // 'fotos': resp_item.data.pictures
        //         });
        //         //console.log(response.text[0]);
        //     }
        // });
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