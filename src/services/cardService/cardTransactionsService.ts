import * as paymentRepository from "../../repositories/paymentRepository";
import { findCard } from "./utils/cardServiceUtils";

export async function cardTransactions(id:number) {
    const card = await findCard(id);
    if(!card){
      return({ cod: 400, msg: "Does not exists a card with this Id" });
    }
    
    const transactions = await paymentRepository.findByCardId(Number(id));
    console.log(transactions);
  
    return ({cod: 200, msg: "OK"});
  }
  
  
  