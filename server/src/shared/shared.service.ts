import { Injectable } from "@nestjs/common";
import { customAlphabet, nanoid } from 'nanoid';
import * as CryptoJS from 'crypto-js';
@Injectable()
export class SharedService {
    generateUUID(): string {
        return nanoid();
    }
    md5(msg: string): string {
        return CryptoJS.MD5(msg).toString();
    }
}