import dotenv from "dotenv";
import Cryptr from 'cryptr';

dotenv.config();

export function encryptWord(word: string){

    const cryptr = new Cryptr(String(process.env.CRYPTR_KEY));

    const encryptedString = cryptr.encrypt(word);
    return encryptedString;
}


export function decryptWord(word: string){

    const cryptr = new Cryptr(String(process.env.CRYPTR_KEY));

    const descryptedString = cryptr.decrypt(word);
    return descryptedString;
}

