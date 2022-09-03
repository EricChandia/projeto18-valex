import axios from "axios";
import dayjs from 'dayjs';
import * as cardRepository from "../repositories/cardRepository";
import * as companyRepository from "../repositories/companyRepository";
import * as employeeRepository from "../repositories/employeeRepository";
import * as paymentRepository from "../repositories/paymentRepository";
import { faker } from '@faker-js/faker';
import { TransactionTypes } from "../repositories/cardRepository";
import { encryptWord, decryptWord } from "../utils/encrypt";
import { CardInsertData } from "../repositories/cardRepository";

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

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

  const cardExpiration:string = card.expirationDate;
  const cardExpirationDate = dayjs(cardExpiration, 'MM/YY');
  if(cardExpirationDate.diff(dayjs(), 'days') <= 0){
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

export async function cardTransactions(id:number) {
  const card = await findCard(id);
  if(!card){
    return({ cod: 400, msg: "Does not exists a card with this Id" });
  }
  
  const transactions = await paymentRepository.findByCardId(Number(id));
  console.log(transactions);

  return ({cod: 200, msg: "OK"});
}


export async function blockCard(id:number, password:string) {

  const card = await findCard(id);
  if(!card){
    return({ cod: 400, msg: "Does not exists a card with this Id" });
  }
  
  const transactions = await paymentRepository.findByCardId(Number(id));
  console.log(transactions);

  return ({cod: 200, msg: "OK"});
}



//Card util functions

function createCardData(employee:any, employeeId: number, cardType: TransactionTypes){
  const cardholderName : string = createCardName(employee.fullName);
  const expirationDate : string = dayjs().add(5, 'year').format('MM/YY');
  const cardNumber : string = faker.finance.creditCardNumber();
  const cardCVV : string = faker.finance.creditCardCVV();
  const cardCVVEncrypted :string = encryptWord(cardCVV);
  const password : any = null;
  const isVirtual : boolean = false;
  const originalCardId : any = null;
  const isBlocked : boolean = false;

  const cardData : CardInsertData =  {
    employeeId,
    number:cardNumber,
    cardholderName,
    securityCode:cardCVVEncrypted,
    expirationDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    type:cardType
  } 

  return cardData;

}


function createCardName(employeeName : string){
  const employeeNameArr : string[] = employeeName.split(" ");
  let employeeCardName = employeeNameArr[0];
  for(let i=1;i<employeeNameArr.length-2;i++){
    if(employeeNameArr[i].length >= 3){
        employeeCardName = employeeCardName + " " + employeeNameArr[i][0];
    }
  }
  employeeCardName = (employeeCardName + " " + employeeNameArr[employeeNameArr.length-1]).toUpperCase();
  return employeeCardName;
}

async function findCard(id:number){
  const card = await cardRepository.findById(id);
  if(!card) return false;
  return card;
}