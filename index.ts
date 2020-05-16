import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility } from "@plumier/typeorm"
import Plumier, { Class, route, val, WebApiFacility, LoggerFacility } from "plumier"
import reflect, { generic, type } from "tinspector"
import { Column, Entity, getManager, PrimaryGeneratedColumn, Repository } from "typeorm"

// --------------------------------------------------------------------- //
// ------------------------------ ENTITIES ----------------------------- //
// --------------------------------------------------------------------- //

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    todo: string
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @val.email()
    email: string

    @Column()
    name: string

    @Column()
    password: string

    @Column()
    role: "User" | "Admin"
}

// --------------------------------------------------------------------- //
// -------------------------- BASE CONTROLLER -------------------------- //
// --------------------------------------------------------------------- //

@generic.template("T")
export class ControllerBase<T> {
    private readonly repo: Repository<T>
    constructor() {
        const meta = reflect(this.constructor as Class)
        const genericDecorator = meta.decorators.find(x => x.kind == "GenericType")
        this.repo = getManager().getRepository(genericDecorator.types[0])
    }

    @route.get("")
    @reflect.type(["T"])
    list(): Promise<T[]> {
        return this.repo.find()
    }

    @route.post("")
    save(@reflect.type("T") data: T) {
        return this.repo.save(data)
    }

    @route.put(":id")
    @route.patch(":id")
    modify(id: number, @reflect.type("T") data: T) {
        return this.repo.update(id, data)
    }

    @route.delete(":id")
    delete(id: number) {
        return this.repo.delete(id)
    }
}

// --------------------------------------------------------------------- //
// ---------------------------- CONTROLLERS ---------------------------- //
// --------------------------------------------------------------------- //

@generic.type(User)
export class UserController extends ControllerBase<User> { }

@generic.type(Todo)
export class TodoController extends ControllerBase<Todo> { }


// --------------------------------------------------------------------- //
// ------------------------------ FACILITY ----------------------------- //
// --------------------------------------------------------------------- //

new Plumier()
    .set(new WebApiFacility({ controller: __filename }))
    .set(new LoggerFacility())
    .set(new SwaggerFacility())
    .set(new TypeORMFacility({
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "password",
        "database": "todo",
        "entities": [
            __filename
        ]
    }))
    .listen(8000)