import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";
import { authorize } from "plumier";



export interface LoginUser {
    userId: number,
    role: "User" | "Admin"
}

export class EntityBase {
    @authorize.readonly()
    @PrimaryGeneratedColumn()
    id: number

    @authorize.readonly()
    @CreateDateColumn()
    createdAt: Date

    @authorize.readonly()
    @UpdateDateColumn()
    updatedAt: Date

    @authorize.readonly()
    @Column({ default: false })
    deleted: boolean
}