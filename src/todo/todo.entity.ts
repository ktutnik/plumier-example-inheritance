import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import { User } from "../user/user-entity"
import { EntityBase } from "../_shared/entity"
import { route } from "plumier"

@route.ignore() // Log will not generated into routes
@Entity()
export class Todo extends EntityBase {
    @Column()
    todo:string

    @ManyToOne(x => User, x => x.todos)
    user:User
}