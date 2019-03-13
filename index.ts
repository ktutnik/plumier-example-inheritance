import Plumier, { route, domain, val, WebApiFacility } from "plumier";
import knex from "knex"

// ##################################################################### //
// ############################## DATABASE ############################# //
// ##################################################################### //

const db = knex({
    client: "mysql2",
    connection: "mysql://root:password@localhost/todo"
})

// ##################################################################### //
// ############################## DOMAINS ############################## //
// ##################################################################### //

@domain()
export class Domain {
    constructor(
        @val.optional()
        public id: number = 0,
        @val.optional()
        public createdAt: Date = new Date(),
        @val.optional()
        public deleted: boolean = false
    ) { }
}

@domain()
export class Todo extends Domain {
    constructor(
        public note: string
    ) { super() }
}

@domain()
export class User extends Domain {
    constructor(
        @val.email()
        public email: string,
        public name: string,
        public password: string,
        public role: "User" | "Admin"
    ) { super() }
}

// ##################################################################### //
// ############################ CONTROLLERS ############################ //
// ##################################################################### //

export class ControllerBase {
    constructor(private readonly tableName: string) { }

    @route.get("")
    list() {
        return db(this.tableName).where({ deleted: 0 })
    }

    @route.post("")
    save(data: Domain) {
        return db(this.tableName).insert(data)
    }

    @route.put(":id")
    modify(id: number, data: Domain) {
        return db(this.tableName).update(data).where({ id })
    }

    @route.delete(":id")
    delete(id: number) {
        return db(this.tableName).delete().where({ id })
    }
}

export class TodoController extends ControllerBase {
    constructor() { super("Todo") }

    @route.post("")
    save(data: Todo) {
        return super.save(data)
    }

    @route.put(":id")
    modify(id: number, data: Todo) {
        return super.modify(id, data)
    }
}

export class UserController extends ControllerBase {
    constructor() { super("User") }

    @route.post("")
    save(data: User) {
        return super.save(data)
    }

    @route.put(":id")
    modify(id: number, data: User) {
        return super.modify(id, data)
    }
}

// ##################################################################### //
// ############################# BOOTSTRAP ############################# //
// ##################################################################### //

new Plumier()
    .set(new WebApiFacility({ controller: __filename }))
    .initialize()
    .then(koa => koa.listen(8000))
    .catch(e => console.log(e))