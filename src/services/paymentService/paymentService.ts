
import { cardCurrentAmount, validateCard } from "../cardService/utils/cardServiceUtils";
import * as cardRepository from "../../repositories/cardRepository";
import * as businessRepository from "../../repositories/businessRepository";
import { decryptWord } from "../../utils/encrypt";
import * as paymentRepository from "../../repositories/paymentRepository";

export async function payment(cardId:number, cardPassword: string, businessId:number, amount:number) {
    
    const cardIsValid = await validateCard(cardId);
    if(cardIsValid.cod !== 200){
        return({cod: cardIsValid.cod, msg:cardIsValid.msg});
    }

    const cardDataInDB = await cardRepository.findById(cardId);

    if(decryptWord(String(cardDataInDB.password)) !== cardPassword){
        console.log(decryptWord(String(cardDataInDB.password)));
        console.log(cardPassword);
        return({cod: 404, msg:'Password does not match'});
    }

    const business = await businessRepository.findById(businessId);
    if(!business){
        return({cod: 400, msg:'Business does not exists'});
    }

    if(business.type !== cardDataInDB.type){
        return({cod: 400, msg:'Card and Business types are different'});
    }

    const cardAmount = await cardCurrentAmount(cardId);
    if(cardAmount < amount){
        return({cod: 404, msg:'Card amount not enought'});
    }

    const payment = { cardId, businessId, amount }
    await paymentRepository.insert(payment);
    return({cod: 200, msg: "OK"});
}