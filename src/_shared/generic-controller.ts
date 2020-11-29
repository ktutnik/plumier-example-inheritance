import { FilterEntity } from "@plumier/core"
import { TypeORMControllerGeneric, TypeORMOneToManyControllerGeneric } from "@plumier/typeorm"
import { Context } from "koa"
import { api } from "plumier"
import { generic, noop, type } from "tinspector"


@generic.template("T")
export class Response<T> {
    @type(["T"])
    data: T[]
    @noop()
    count: number
}

@generic.template("T", "TID")
@generic.type("T", "TID")
export class CustomControllerGeneric<T, TID> extends TypeORMControllerGeneric<T, TID> {
    @type(Response, "T")
    async list(offset: number, limit: number, filter: FilterEntity<T>, select: string, order: string, ctx: Context) {
        const data = await super.list(offset, limit, filter, select, order, ctx)
        const count = await this.repo.count(filter)
        return { data, count } 
    }
}

@generic.template("P", "T", "PID", "TID")
@generic.type("P", "T", "PID", "TID")
export class CustomOneToManyControllerGeneric<P, T, PID, TID> extends TypeORMOneToManyControllerGeneric<P, T, PID, TID>{
    @type(Response, "T")
    async list(pid: PID, offset: number, limit: number, filter: FilterEntity<T>, select: string, order: string, ctx: Context) {
        const data = await super.list(pid, offset, limit, filter, select, order, ctx)
        const count = await this.repo.count(pid, filter)
        return { data, count } 
    }
}