import {Chat} from "./Chat.js";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"

@Entity()
export class Message  {


  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  text: String;

  @ManyToOne((type) => Chat, (chat) => chat.messages)
  chat: Chat;


}