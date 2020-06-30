import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility, TypeORMGenericControllerFacility } from "@plumier/typeorm"
import { sign } from "jsonwebtoken"
import Plumier, { authorize, LoggerFacility, val, WebApiFacility, route, api } from "plumier"
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

    @authorize.get("Admin")
    @Column()
    password: string

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


@route.root("api/v1/users")
export class UsersController {
    @route.post("")
    save(data:User){}
}

// --------------------------------------------------------------------- //
// ------------------------------ FACILITY ----------------------------- //
// --------------------------------------------------------------------- //

new Plumier()
    .set(new WebApiFacility({controller: __filename}))
    .set(new LoggerFacility())
    .set(new JwtAuthFacility({ secret: "lorem" }))
    .set(new SwaggerFacility())
    .set(new TypeORMFacility({
        connection: {
            type: "sqlite",
            database: ":memory:",
            //dropSchema: true,
            entities: [__filename],
            synchronize: true,
            logging: false
        }
    }))
    .set(new TypeORMGenericControllerFacility())
    .listen(8000)


console.log("Admin", sign({ role: "Admin" }, "lorem"))
console.log("User", sign({ role: "User" }, "lorem"))