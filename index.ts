import { Context } from "koa"
import Plumier, { bind, Class, DefaultFacility, route, val, WebApiFacility } from "plumier"
import tin, { generic, noop } from "tinspector"
import * as tslib from "tslib"
import {
    Column,
    createConnection,
    Entity,
    getManager,
    getMetadataArgsStorage,
    PrimaryGeneratedColumn,
    Repository,
} from "typeorm"

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
    constructor(entity: Class) {
        this.repo = getManager().getRepository(entity)
    }

    @route.get("")
    @tin.type(["T"])
    list(): Promise<T[]> {
        return this.repo.find()
    }

    @route.post("")
    save(@tin.type("T") data: T) {
        return this.repo.save(data)
    }

    @route.put(":id")
    modify(id: number, @tin.type("T") data: T) {
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
export class UserController extends ControllerBase<User> {
    constructor() { super(User) }
}

@generic.type(Todo)
export class TodoController extends ControllerBase<Todo> {
    constructor() { super(Todo) }
}


// --------------------------------------------------------------------- //
// ------------------------------ FACILITY ----------------------------- //
// --------------------------------------------------------------------- //

// this facility may be provided by Plumier @plumier/typeorm
class TypeOrmFacility extends DefaultFacility {
    setup(){
        const columns = getMetadataArgsStorage().columns;
        for (const col of columns) {
            tslib.__decorate([noop()], (col.target as Function).prototype, col.propertyName, void 0)
        }
    }

    async initialize() {
        await createConnection({
            "type": "mysql",
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "password",
            "database": "todo",
            "entities": [
                __filename
            ]
        })
    }
}

new Plumier()
    .set(new WebApiFacility({ controller: __filename }))
    .set(new TypeOrmFacility())
    .listen(8000)