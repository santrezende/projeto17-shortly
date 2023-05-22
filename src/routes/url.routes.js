import { Router } from "express"
import { createUrl, deleteUrl, getUrlById, openUrl } from "../controllers/urls.controllers.js"
import { authValidation } from "../middlewares/authValidation.middleware.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { postUrlSchema } from "../schemas/url.schema.js"

const urlsRouter = Router()

urlsRouter.post("/urls/shorten", authValidation, validateSchema(postUrlSchema), createUrl)
urlsRouter.get("/urls/:id", getUrlById)
urlsRouter.get("/urls/open/:shortUrl", openUrl)
urlsRouter.delete("/urls/:id", authValidation, deleteUrl)

export default urlsRouter