import { genSalt, hash } from "bcryptjs"
import { authorize, val, route, Public } from "plumier"
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm"

import { EntityBase } from "../_shared/entity"
import { Todo } from "../todo/todo.entity"

@route.controller(c => {
    c.post().authorize(Public)
    c.getMany().authorize(Public)
})
@Entity()
export class User extends EntityBase {

    @val.email()
    @Column()
    email: string

    @Column()
    name: string

    @authorize.writeonly()
    @Column()
    password: string

    @Column({ default: "User" })
    role: "User" | "Admin"

    @BeforeInsert()
    async beforeInsert() {
        const salt = await genSalt()
        this.password = await hash(this.password, salt)
    }

    @route.controller()
    @OneToMany(x => Todo, x => x.user)
    todos: Todo[]
}
