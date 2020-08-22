import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import { User } from "../user/user-entity"
import { EntityBase } from "../_shared/entity"
import { route } from "plumier"

@route.ignore()
@Entity()
export class Log extends EntityBase {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    log:string

    @CreateDateColumn()
    createdAt:Date

    @ManyToOne(x => User, x => x.logs)
    user:User
}