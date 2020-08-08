import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility, TypeORMGenericControllerFacility } from "@plumier/typeorm"
import { sign } from "jsonwebtoken"
import Plumier, { authorize, LoggerFacility, val, WebApiFacility, route, api } from "plumier"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

// --------------------------------------------------------------------- //
// ------------------------------ ENTITIES ----------------------------- //
// --------------------------------------------------------------------- //


@authorize.public({ action: "save" })
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @val.email()
    email: string

    @Column()
    name: string

    // this will never visible on response
    @authorize.writeonly()
    @Column()
    password: string

    // only Admin can see and set this
    @authorize.role("Admin")
    @Column({ nullable: true })
    role: "User" | "Admin"

    @OneToMany(x => Todo, x => x.user)
    todos: Todo[]
}

@Entity()
@route.ignore()
export class Todo {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    todo: string

    @ManyToOne(x => User, x => x.todos)
    user: User
}


// --------------------------------------------------------------------- //
// ------------------------------ FACILITY ----------------------------- //
// --------------------------------------------------------------------- //

new Plumier()
    .set(new WebApiFacility({ controller: __filename }))
    .set(new LoggerFacility())
    .set(new JwtAuthFacility({ secret: "lorem" }))
    .set(new SwaggerFacility())
    .set(new TypeORMFacility())
    .set(new TypeORMGenericControllerFacility({ rootPath: "api/v1" }))
    .listen(8000)


console.log("Admin", sign({ role: "Admin" }, "lorem"))
console.log("User", sign({ role: "User" }, "lorem"))