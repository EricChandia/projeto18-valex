import { Request, Response } from "express";
import * as cardService from "../services/cardService/cardService";
import { TransactionTypes } from "../repositories/cardRepository";

export async function createCard(req: Request, res: Response) {
    const { employeeId, cardType } : {employeeId: number, cardType: TransactionTypes} = req.body;
    const xapikey = req.get('x-api-key');

    if(!xapikey){
      return res.status(400).send("x-api-key required");
    }
  
    const {cod, msg} = await cardService.createCard(employeeId, cardType, xapikey);
    res.status(cod).send(msg);
  }


  export async function activateCard(req: Request, res: Response) {
    const cardIdCvvPass = req.body;
    const id = Number(cardIdCvvPass.id);
    const cvv = Number(cardIdCvvPass.cvv);
    const password = Number(cardIdCvvPass.password);
  
    const {cod, msg} = await cardService.activateCard(id, cvv, password);
    res.status(cod).send(msg);
  }

  
  export async function cardTransactions(req:Request, res:Response) {
    const { id } = req.params;

    const {cod, msg}  = await cardService.cardTransactions(Number(id));

    res.status(cod).send(msg);
  }

    
  export async function blockCard(req:Request, res:Response) {
    const { id, password } : {id: number, password: string} = req.body;

    const {cod, msg}  = await cardService.blockCard(id, password);
    res.status(cod).send(msg);
  }

      
  export async function unblockCard(req:Request, res:Response) {
    const { id, password } : {id: number, password: string} = req.body;

    const {cod, msg}  = await cardService.unblockCard(id, password);
    res.status(cod).send(msg);
  }