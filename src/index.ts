import { JwtAuthFacility } from "@plumier/jwt"
import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility, TypeORMGenericControllerFacility } from "@plumier/typeorm"
import { compare, genSalt, hash } from "bcryptjs"
import dotenv from "dotenv"
import { sign } from "jsonwebtoken"
import Plumier, { authorize, HttpStatusError, LoggerFacility, route, val, WebApiFacility } from "plumier"
import { BeforeInsert, Column, Entity, getManager, PrimaryGeneratedColumn } from "typeorm"

@authorize.public({ action: "save" })
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @val.email()
    email: string

    @Column()
    name: string

    @authorize.writeonly()
    @Column()
    password: string

    @authorize.role("Admin")
    @Column({ default: "User" })
    role: "User" | "Admin"

    @BeforeInsert()
    async beforeInsert() {
        const salt = await genSalt()
        this.password = await hash(this.password, salt)
    }
}

@authorize.public({ action: "login" })
export class AuthController {
    private readonly repo = getManager().getRepository(User)

    @route.post()
    async login(email: string, password: string) {
        const user = await this.repo.findOne({ email: email })
        if (!user || !await compare(password, user.password))
            throw new HttpStatusError(422, "Invalid user name or password")
        const token = sign({ userId: user.id, role: "User" }, process.env.PLUM_JWT_SECRET!)
        return { token }
    }
}

dotenv.config()

new Plumier()
    .set(new WebApiFacility({ controller: __filename }))
    .set(new LoggerFacility())
    .set(new JwtAuthFacility())
    .set(new SwaggerFacility())
    .set(new TypeORMFacility())
    .set(new TypeORMGenericControllerFacility({ rootPath: "api/v1" }))
    .listen(8000)
