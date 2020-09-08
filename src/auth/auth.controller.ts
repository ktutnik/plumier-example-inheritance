import { getManager } from "typeorm";
import { User } from "../user/user-entity";
import { compare } from "bcryptjs";
import { HttpStatusError, HttpStatus, route, authorize, bind } from "plumier";
import { sign } from "jsonwebtoken";
import { LoginUser } from "../_shared/entity";


export class AuthController {
    readonly userRepo = getManager().getRepository(User)

    @route.ignore()
    createTokens(user: User) {
        const token = sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.PLUM_JWT_SECRET!, { expiresIn: "30m" })
        const refreshToken = sign(<LoginUser>{ userId: user.id, role: "RefreshToken" }, process.env.PLUM_JWT_SECRET!, { expiresIn: "7d" })
        return { token, refreshToken }
    }

    @authorize.public()
    @route.post()
    async login(email: string, password: string) {
        const user = await this.userRepo.findOne({ email })
        if (!user || !await compare(password, user.password))
            throw new HttpStatusError(HttpStatus.UnprocessableEntity, "Invalid username or password")
        return this.createTokens(user)
    }

    @authorize.role("RefreshToken")
    async refresh(@bind.user() user:LoginUser) {
        const saved = await this.userRepo.findOne(user.userId)
        if(!saved) throw new HttpStatusError(404, "User not found")
        return this.createTokens(saved)
    }
}