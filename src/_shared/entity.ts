import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { authorize } from "plumier";



export interface LoginUser {
    userId:number,
    role: "User" | "Admin"
}

export class EntityBase {
    @authorize.readonly()
    @PrimaryGeneratedColumn()
    id: number

    @authorize.readonly()
    @CreateDateColumn()
    createdAt:Date

    @authorize.readonly()
    @UpdateDateColumn()
    updatedAt:Date
}