import { getManager } from "typeorm";
import { User } from "../user/user-entity";
import { compare } from "bcryptjs";
import { HttpStatusError, HttpStatus, route, authorize } from "plumier";
import { sign } from "jsonwebtoken";
import { LoginUser } from "../_shared/entity";


export class AuthController {
    readonly userRepo = getManager().getRepository(User)

    @authorize.public()
    @route.post()
    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({ email })
        if (!user || !await compare(password, user.password))
            throw new HttpStatusError(HttpStatus.UnprocessableEntity, "Invalid username or password")
        const token = sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.PLUM_JWT_SECRET!)
        return { token }
    }
}