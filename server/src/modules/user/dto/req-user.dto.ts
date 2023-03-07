import { OmitType } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class ReqAddUserDto extends OmitType(User,['userId'] as const) {
    
}