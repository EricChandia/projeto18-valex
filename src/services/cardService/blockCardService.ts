import * as cardRepository from "../../repositories/cardRepository";
import { checkIfExpirationDateIsValid, comparePassword, findCard } from "./utils/cardServiceUtils";
import { Card } from "../../repositories/cardRepository";


export async function blockCard(id:number, password:string) {

    const card: false | Card = await findCard(id);
    if(!card){
      return({ cod: 400, msg: "Does not exists a card with this Id" });
    }
  
    
    if(!comparePassword(card, password)){
      return({ cod: 404, msg: "Password does not match" });
    }
    
    if (!checkIfExpirationDateIsValid(card.expirationDate)){
      return({ cod: 404, msg: "Card already expired" });
    }
  
    if(card.isBlocked === true){
      return({ cod: 400, msg: "This card is already blocked" });
    }
  
    await cardRepository.update(id, { isBlocked: true });
    return ({cod: 200, msg: "OK"});
  }
  
  
  export async function unblockCard(id:number, password:string) {

    const card: false | Card = await findCard(id);
    if(!card){
      return({ cod: 400, msg: "Does not exists a card with this Id" });
    }
  
    
    if(!comparePassword(card, password)){
      return({ cod: 404, msg: "Password does not match" });
    }
    
    if (!checkIfExpirationDateIsValid(card.expirationDate)){
      return({ cod: 404, msg: "Card already expired" });
    }
  
    if(!card.isBlocked === true){
      return({ cod: 400, msg: "This card is already unblocked" });
    }
  
    await cardRepository.update(id, { isBlocked: false });
    return ({cod: 200, msg: "OK"});
  }
  
  
  