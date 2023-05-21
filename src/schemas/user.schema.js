import joi from "joi"

export const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(3),
    confirmPassword: joi.ref("password"),
})

export const logInSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
})