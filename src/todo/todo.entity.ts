import { route } from "plumier"
import { Column, Entity, ManyToOne } from "typeorm"

import { EntityBase } from "../_shared/entity"
import { User } from "../user/user-entity"

@route.controller()
@Entity()
export class Todo extends EntityBase {
    @Column()
    todo:string

    @ManyToOne(x => User, x => x.todos)
    user:User
}