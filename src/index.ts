import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility } from "@plumier/typeorm"
import dotenv from "dotenv"
import Plumier, { LoggerFacility, WebApiFacility, ControllerFacility, authorize } from "plumier"
import { JwtAuthFacility } from "@plumier/jwt"
import { CustomControllerGeneric, CustomOneToManyControllerGeneric } from "./_shared/generic-controller"
import { mergeDecorator } from "tinspector"

dotenv.config();

new Plumier()
    .set(new WebApiFacility())
    .set(new ControllerFacility({ controller: __dirname, directoryAsPath: false }))
    .set(new LoggerFacility())
    .set(new JwtAuthFacility({
        secret: process.env.PLUM_JWT_SECRET!,
        global: mergeDecorator(authorize.route('Admin'), authorize.route('User'))
    }))
    .set(new SwaggerFacility())
    .set(new TypeORMFacility())
    .set({
        genericController: [
            CustomControllerGeneric,
            CustomOneToManyControllerGeneric]
    })
    .listen(8000)