import { db } from "../database/database.connection.js"
import bcrypt from "bcrypt"
import { v4 as uuid } from "uuid"

export async function signUp(req, res) {
    const { name, email, password } = req.body

    const passwordHash = bcrypt.hashSync(password, 10)

    try {

    const existingUser = await db.query("SELECT * FROM users WHERE email=$1;", [email])

    if (existingUser.rowCount > 0) return res.status(409).send("Já existe uma conta com esse e-mail")

    await db.query(`
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3);
    `, [name, email, passwordHash])

    return res.sendStatus(201)
    } catch (err) {
    return res.status(422).send(err.message)
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body

    try {

    const user = await db.query(`SELECT * FROM users WHERE email=$1;`, [email])

    if (user.rowCount === 0) return res.status(404).send("Não existe uma conta com esse e-mail")

    if (user.rows[0] && bcrypt.compareSync(password, user.rows[0].password)) {
        const existingSession = await db.query(`SELECT * FROM sessions WHERE email=$1;`, [email])

        if (existingSession.rowCount > 0) {
            return res.status(400).send("Usuário já logado")
        } else {
            const token = uuid()

            await db.query(`
            INSERT INTO sessions (email, token, "userId")
            VALUES ($1, $2, $3);`, [email, token, user.rows[0].id])

            return res.status(200).send({ token })
        }
    } else {
        return res.status(401).send("E-mail ou senha incorretos")
    }
    } catch (err) {
        return res.status(422).send(err.message)
    }
}

export async function logOut(req, res) {
    const { token } = res.locals.session

    try {
  
        const session = await db.query(`SELECT * FROM sessions WHERE token=$1;`, [token])
    
        if (session.rowCount === 0) return res.sendStatus(401)
    
        await db.query(`DELETE FROM sessions WHERE token=$1;`, [token])
    
        return res.status(200).send("Usuário deslogado com sucesso")
    } catch (err) {
        return res.status(422).send(err.message)
    }
}