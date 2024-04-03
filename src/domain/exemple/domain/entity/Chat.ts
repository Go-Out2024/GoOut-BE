import {Message} from "./Message.js";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"


@Entity()
export class Chat {
   
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Message, (message) => message.chat)
  messages: Message[];


}