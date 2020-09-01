import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility } from "@plumier/typeorm"
import dotenv from "dotenv"
import Plumier, { LoggerFacility, WebApiFacility, ControllerFacility } from "plumier"
import { JwtAuthFacility } from "@plumier/jwt"
import { CustomControllerGeneric, CustomOneToManyControllerGeneric } from "./_shared/generic-controller"

dotenv.config();

new Plumier()
    .set(new WebApiFacility())
    .set(new ControllerFacility({ controller: __dirname, directoryAsPath: false }))
    .set(new LoggerFacility())
    .set(new JwtAuthFacility())
    .set(new SwaggerFacility())
    .set(new TypeORMFacility())
    .set({
        genericController: [
            CustomControllerGeneric,
            CustomOneToManyControllerGeneric]
    })
    .listen(8000)