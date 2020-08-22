import { SwaggerFacility } from "@plumier/swagger"
import { TypeORMFacility, TypeORMGenericControllerFacility } from "@plumier/typeorm"
import dotenv from "dotenv"
import Plumier, { LoggerFacility, WebApiFacility, ControllerFacility } from "plumier"
import { JwtAuthFacility } from "@plumier/jwt"

dotenv.config();

new Plumier()
    .set(new WebApiFacility())
    .set(new ControllerFacility({ controller: __dirname, directoryAsPath:false }))
    .set(new LoggerFacility())
    .set(new JwtAuthFacility())
    .set(new SwaggerFacility())
    .set(new TypeORMFacility())
    // generate routes from entity
    .set(new TypeORMGenericControllerFacility())
    .listen(8000)