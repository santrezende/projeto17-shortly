import { Router } from "express"
import { logOut, signIn, signUp } from "../controllers/users.controllers.js"
import { authValidation } from "../middlewares/authValidation.middleware.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { userSchema, logInSchema } from "../schemas/user.schema.js"

const usersRouter = Router()

usersRouter.post("/signup", validateSchema(userSchema), signUp)
usersRouter.post("/signin", validateSchema(logInSchema), signIn)
usersRouter.delete("/home", authValidation, logOut)

export default usersRouter