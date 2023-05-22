import { nanoid } from "nanoid"
import { db } from "../database/database.connection.js"

export async function createUrl(req, res) {
    const { url } = req.body
    const { userId } = res.locals.session
    const shortUrl = nanoid()

    try{
        await db.query(`INSERT INTO urls(url, "shortUrl", "userId") VALUES ($1, $2, $3);`, [url, shortUrl, userId])
        const createdUrl = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`, [shortUrl])
        const response = {
            id: createdUrl.rows[0].id,
            shortUrl
        }
        return res.status(201).send(response)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export async function getUrlById(req, res) {
    const { id } = req.params

    try{
        const result = await db.query(`SELECT * FROM urls WHERE id=$1;`, [id])

        if(result.rowCount === 0) return res.status(404).send("url not found")

        const response = {
            id: result.rows[0].id,
            shortUrl: result.rows[0].shortUrl,
            url: result.rows[0].url
        }

        return res.status(200).send(response)

    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export async function openUrl(req, res) {
    const { shortUrl } = req.params

    try{
        const result = await db.query(`SELECT * FROM urls WHERE "shortUrl"=$1;`, [shortUrl])

        if(result.rowCount === 0) return res.sendStatus(404)
        
        await db.query(`UPDATE urls SET views=views+1 WHERE "shortUrl"=$1;`, [shortUrl])

        return res.redirect(result.rows[0].url)
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

export async function deleteUrl(req, res) {
    const { id } = req.params
    const { userId } = res.locals.session
    try{
        const url = await db.query(`SELECT * FROM urls WHERE id=$1`, [id])
        if(url.rowCount === 0) return res.sendStatus(404)

        if(url.rows[0].userId === userId) {
            await db.query(`DELETE FROM urls WHERE id=$1`, [id])
            return res.sendStatus(204)
        } else {
            return res.sendStatus(401)
        }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}