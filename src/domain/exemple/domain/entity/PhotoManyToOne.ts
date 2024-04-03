import { UserOneToMany } from "./UserOneToMany.js"
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
// 앙뱡항 관계 엔티티를 저장할 경우 vscode에서 저장 순서를 주의하자. 안하면 에러가 뜸..



@Entity()
export class PhotoManyToOne {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    url: string

    @ManyToOne(() => UserOneToMany, (user) => user.photos)
    user: UserOneToMany
}