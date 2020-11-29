import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Entity } from "typeorm";
import { authorize, entity } from "plumier";

export interface LoginUser {
    userId: number,
    role: "User" | "Admin" | "RefreshToken"
}

@Entity()
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

    @entity.deleteColumn()
    @authorize.readonly()
    @Column({ default: false })
    deleted: boolean
}