import {
    TypeORMControllerGeneric,
    TypeORMOneToManyControllerGeneric,
    TypeORMOneToManyRepository,
    TypeORMRepository,
} from "@plumier/typeorm"
import { generic } from "tinspector"


export class CustomRepository<T> extends TypeORMRepository<T> {
    delete(id: any) {
        // override the default delete method
        return this.update(id, { deleted: true } as any)
    }
}


export class CustomOneToManyRepository<P, T> extends TypeORMOneToManyRepository<P, T>{
    delete(id: any) {
        // override the default delete method
        return this.update(id, { deleted: true } as any)
    }
}

@generic.template("T", "TID")
@generic.type("T", "TID")
export class CustomControllerGeneric<T, TID> extends TypeORMControllerGeneric<T, TID> {
    constructor() { super(x => new CustomRepository(x)) }
}

@generic.template("P", "T", "PID", "TID")
@generic.type("P", "T", "PID", "TID")
export class CustomOneToManyControllerGeneric<P, T, PID, TID> extends TypeORMOneToManyControllerGeneric<P, T, PID, TID>{
    constructor() { super((p,t,rel) => new CustomOneToManyRepository(p, t, rel)) }
}