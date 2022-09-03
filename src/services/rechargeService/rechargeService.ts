import * as companyRepository from "../../repositories/companyRepository";
import * as rechargeRepository from "../../repositories/rechargeRepository";
import { Card } from "../../repositories/cardRepository";
import { findCard, checkIfExpirationDateIsValid, cardCurrentAmount } from "../cardService/utils/cardServiceUtils";
import dayjs from "dayjs";



export async function rechargeCard(xapikey:string, id:number, value:number) {
    
    const company = await companyRepository.findByApiKey(xapikey);
    if(!company){
      return({ cod: 400, msg: "Company does not exists with this api-key" });
    }

    if(value <= 0){
        return({ cod: 400, msg: "Value must be grater than 0" });
    }

    const card: false | Card = await findCard(id);
    if(!card){
      return({ cod: 400, msg: "Does not exists a card with this Id" });
    }
  

    if (!checkIfExpirationDateIsValid(card.expirationDate)){
      return({ cod: 404, msg: "Card already expired" });
    }
  
    if(card.isBlocked === true){
      return({ cod: 400, msg: "This card is already blocked" });
    }
  
    if(card.password === null){
      return({ cod: 400, msg: "This card is not active" });
    }
  
    let cardAmount = await cardCurrentAmount(id);
    cardAmount += value;

    const timestamp = dayjs();

    const recharge = { cardId:id, amount:cardAmount };

    rechargeRepository.insert(recharge);
    return({cod: 200, msg: "OK"});
}
