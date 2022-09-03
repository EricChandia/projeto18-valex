import * as cardRepository from "../../../repositories/cardRepository";
import { Card } from "../../../repositories/cardRepository";
import { encryptWord, decryptWord } from "../../../utils/encrypt";
import dayjs from "dayjs";
import { TransactionTypes } from "../../../repositories/cardRepository";
import { faker } from "@faker-js/faker";
import { CardInsertData } from "../../../repositories/cardRepository";
import * as rechargeRepository from "../../../repositories/rechargeRepository";

//Card util functions

export function createCardData(employee:any, employeeId: number, cardType: TransactionTypes){
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
  
  

export function createCardName(employeeName : string){
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
  
  export async function findCard(id:number){
    const card = await cardRepository.findById(id);
    if(!card) return false;
    return card;
  }
  
  export function checkIfExpirationDateIsValid(cardExpiration:string){
    //const cardExpiration:string = card.expirationDate;
    const cardExpirationDate = dayjs(cardExpiration, 'MM/YY');
    if(cardExpirationDate.diff(dayjs(), 'days') <= 0) return false;
    return true;
  }
  
  export function comparePassword(card:Card, password:string){
    if(String(password) !== decryptWord(String(card.password))) return false;
    return true;
  }

  export async function validateCard(id:number) {
    const card: false | Card = await findCard(id);
    if(!card){
      return({ cod: 400, msg: "Does not exists a card with this Id" });
    }
  
    if(card.password === null){
      return({ cod: 400, msg: "This card is not active" });
    }
  
    if (!checkIfExpirationDateIsValid(card.expirationDate)){
      return({ cod: 400, msg: "Card already expired" });
    }
  
    if(card.isBlocked === true){
      return({ cod: 400, msg: "This card is already blocked" });
    }

    return({cod: 200, msg: "OK"});
  
  }

  export async function cardCurrentAmount(cardId:number) {
    let cardCurrentAmount = 0;
    const rechargesInCard = await rechargeRepository.findByCardId(cardId);
    rechargesInCard.map(recharge => {
        cardCurrentAmount += recharge.amount;
    });
    
    return cardCurrentAmount;
  }