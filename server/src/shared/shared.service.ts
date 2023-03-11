import { Injectable } from "@nestjs/common";
import { customAlphabet, nanoid } from 'nanoid';
import { Request } from 'express';
import * as CryptoJS from 'crypto-js';
import axios from "axios";
import * as iconv from 'iconv-lite';

@Injectable()
export class SharedService {
  generateUUID(): string {
    return nanoid();
  }
  md5(msg: string): string {
    return CryptoJS.MD5(msg).toString();
  }
  /* 获取请求IP */
  getReqIP(req: Request): string {
    return (
      // 判断是否有反向代理 IP
      (
        (req.headers['x-forwarded-for'] as string) ||
        // 判断后端的 socket 的 IP
        req.socket.remoteAddress ||
        ''
      ).replace('::ffff:', '')
    );
  }
  /* 判断IP是不是内网 */
  IsLAN(ip: string) {
    ip.toLowerCase();
    if (ip == 'localhost') return true;
    let a_ip = 0;
    if (ip == '') return false;
    const aNum = ip.split('.');
    if (aNum.length != 4) return false;
    a_ip += parseInt(aNum[0]) << 24;
    a_ip += parseInt(aNum[1]) << 16;
    a_ip += parseInt(aNum[2]) << 8;
    a_ip += parseInt(aNum[3]) << 0;
    a_ip = (a_ip >> 16) & 0xffff;
    return (
      a_ip >> 8 == 0x7f ||
      a_ip >> 8 == 0xa ||
      a_ip == 0xc0a8 ||
      (a_ip >= 0xac10 && a_ip <= 0xac1f)
    );
  }
  /* 通过ip获取地理位置 */
  async getLocation(ip: string) {
    if (this.IsLAN(ip)) return '内网IP';
    try {
      let { data } = await axios.get(
        `http://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`,
        { responseType: 'arraybuffer' },
      );
      data = JSON.parse(iconv.decode(data, 'gbk'));
      return data.pro + ' ' + data.city;
    } catch (error) {
      return '未知';
    }
  }
}