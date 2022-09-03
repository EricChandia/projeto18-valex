import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService/rechargeService";



export async function rechargeCard(req:Request, res:Response){
    const xapikey = req.get('x-api-key');
    if(!xapikey){
       return res.status(400).send("x-api-key is required");
    }

    const { id, value } = req.body;

    
    const {cod, msg}  = await rechargeService.rechargeCard(String(xapikey), Number(id), Number(value));
    res.status(cod).send(msg);
}