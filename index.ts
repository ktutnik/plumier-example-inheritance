import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { CRUDTypeORMFacility } from "@plumier/typeorm"
import { sign } from "jsonwebtoken"
import Plumier, { authorize, LoggerFacility, val, WebApiFacility, route } from "plumier"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

// --------------------------------------------------------------------- //
// ------------------------------ ENTITIES ----------------------------- //
// --------------------------------------------------------------------- //


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @val.email()
    email: string

    @Column()
    name: string

    @authorize.role("Admin")
    @Column()
    password: string

    @authorize.role("Admin")
    @Column()
    role: "User" | "Admin"

    @OneToMany(x => Todo, x => x.user)
    todos: Todo[]
}

@route.ignore()
@Entity()
export class Todo {
    @PrimaryGeneratedColumn("uuid")
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
    .set(new WebApiFacility())
    .set(new LoggerFacility())
    .set(new JwtAuthFacility({ secret: "lorem" }))
    .set(new SwaggerFacility())
    .set(new CRUDTypeORMFacility({
        rootPath: "/api/v1/",
        connection: {
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [__filename],
            synchronize: true,
            logging: false
        }
    }))
    .listen(8000)


console.log("Admin", sign({ role: "Admin" }, "lorem"))
console.log("User", sign({ role: "User" }, "lorem"))