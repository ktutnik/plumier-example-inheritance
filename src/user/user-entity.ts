import { genSalt, hash } from "bcryptjs"
import { authorize, val } from "plumier"
import { BeforeInsert, Column, Entity, OneToMany } from "typeorm"

import { EntityBase } from "../_shared/entity"
import { Log } from "../log/log.entity"
import { ownerOnly } from "./user-filter"

@authorize.public({ action: "save" }) // set the save method (POST /users/:id) as public
@Entity()
export class User extends EntityBase{
    
    @Column()
    @val.email()
    @authorize.custom(ownerOnly, { access: "get" }) // email only visible by owner
    email: string

    @Column()
    name: string

    @Column()
    @authorize.writeonly()
    password: string

    @Column({ default: "User" })
    // role only visible by owner and Admin, but can be set only by Admin
    @authorize.custom(ownerOnly, { access: "get" }) // -> get access by Owner
    @authorize.role("Admin") // --> get/set access by Admin
    role: "User" | "Admin"

    @BeforeInsert()
    async beforeInsert() {
        const salt = await genSalt()
        this.password = await hash(this.password, salt)
    }

    @OneToMany(x => Log, x => x.user)
    logs:Log[]
}
