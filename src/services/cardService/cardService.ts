import axios from "axios";
import dayjs from 'dayjs';
import * as cardRepository from "../../repositories/cardRepository";
import * as companyRepository from "../../repositories/companyRepository";
import * as employeeRepository from "../../repositories/employeeRepository";
import * as paymentRepository from "../../repositories/paymentRepository";
import { faker } from '@faker-js/faker';
import { TransactionTypes } from "../../repositories/cardRepository";
import { encryptWord, decryptWord } from "../../utils/encrypt";
import { CardInsertData } from "../../repositories/cardRepository";
import { Card } from "../../repositories/cardRepository";
import  * as blockCardService from "./blockCardService";
import  * as cardTransactionsService from "./cardTransactionsService";
import { findCard, checkIfExpirationDateIsValid, createCardData } from "./utils/cardServiceUtils";


var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


export const { blockCard, unblockCard } = blockCardService;
export const { cardTransactions } = cardTransactionsService;

export async function createCard(employeeId: number, cardType: TransactionTypes, xapikey: string) {

  const company = await companyRepository.findByApiKey(xapikey);
  if(!company){
    return({ cod: 400, msg: "Company does not exists with this api-key" });
  }
  
  const employee = await employeeRepository.findById(employeeId);
  if(!employee){
    return({ cod: 400, msg: "Employee does not exists with this id" });
  }

  const employeeAlreadyHaveCardType = await cardRepository.findByTypeAndEmployeeId(cardType, employeeId);
  if(employeeAlreadyHaveCardType){
    return({ cod: 400, msg: "Employee already has this card type" });
  }


  const cardData = createCardData(employee, employeeId, cardType);
  cardRepository.insert(cardData);

  return ({cod: 200, msg: "OK"});
}



export async function activateCard(id:number, cardCVV:number, password:number) {
  const card = await findCard(id);
  if(!card){
    return({ cod: 400, msg: "Does not exists a card with this Id" });
  }

  if(String(cardCVV) !== decryptWord(card.securityCode)){
    return({ cod: 400, msg: "CVV dos not match" });
  }

  if (!checkIfExpirationDateIsValid(card.expirationDate)){
    return({ cod: 404, msg: "Card already expired" });
  }

  if(card.password !== null){
    return({ cod: 400, msg: "This card has already been activated" });
  }

  const encryptedPassword:string = encryptWord(String(password));

  const cardUpdateData = { password : encryptedPassword }
  cardRepository.update(id, cardUpdateData);

  return ({cod: 200, msg: "OK"});
}

