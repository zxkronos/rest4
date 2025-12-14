const express = require("express");
const body_parser = require("body-parser");

const { response, request } = require('express');
//const app = express().use(body_parser.json());

//GET https://www.your-clever-domain-name.com/webhooks? hub.mode=subscribe& hub.challenge=1158201444& hub.verify_token=meatyhamhock

//para verificar el callback url desde dashboard side - cloud api side
const testWasap = (req = request, res = response) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    const mytoken = "prasath";
    if(mode && token){
        if(mode === "subscribe" && token === mytoken){
            res.status(200).send(challenge);
        }else{
            res.status(403);
        }
    }
}
const webhook = (req = request, res = response) => {
    let body_param = req.body;
    console.log(JSON.stringify(body_param,null,2));
    
    if(body_param.object){
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0]   ){

                
            }
    }
}

module.exports = {
    testWasap,
    webhook
}