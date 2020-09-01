import { genSalt, hash } from "bcryptjs"
import { authorize, val, route } from "plumier"
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm"

import { EntityBase } from "../_shared/entity"
import { Todo } from "../todo/todo.entity"
import { ownerOnly } from "./user-filter"

@route.controller()
@authorize.public({ applyTo: "save" }) 
@Entity()
export class User extends EntityBase{
    
    @authorize.custom(ownerOnly, { access: "read" }) 
    @val.email()
    @Column()
    email: string

    @Column()
    name: string

    @authorize.writeonly()
    @Column()
    password: string

    @authorize.custom(ownerOnly, { access: "read" }) 
    @Column({ default: "User" })
    role: "User" | "Admin"

    @BeforeInsert()
    async beforeInsert() {
        const salt = await genSalt()
        this.password = await hash(this.password, salt)
    }

    @route.controller()
    @OneToMany(x => Todo, x => x.user)
    todos:Todo[]
}
