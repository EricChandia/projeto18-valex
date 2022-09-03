import { Request, Response } from "express";
import * as paymentService from "../services/paymentService/paymentService";

export async function payment(req: Request, res: Response) {
    const { cardId, cardPassword, businessId, amount } = req.body;

    if(amount<=0){
        return res.status(400).send("Amount must be greater than 0");
    }

    const {cod, msg}  = await paymentService.payment(Number(cardId), String(cardPassword), Number(businessId), Number(amount));
    res.status(cod).send(msg);
}