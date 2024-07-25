import {randomUUID} from 'node:crypto'
import {databaseClient} from '../database-config.js'
import express from 'express'
import { error } from 'node:console'
const router = express.Router()

databaseClient.connect()
.then(() => console.log('Banco de dados conectado.'))
.catch((error) => console.log(error.message))

router.post('/new', async (req, res) => {
    try {
        const {name, price} = req.body

        async function addProduct(id, name, price){
            const insert = `INSERT INTO products (id, name, price) VALUES ($1, $2, $3)`
    
            const response = await databaseClient.query(insert, [id, name, price])
    
            return response
        }

        const response = await addProduct(randomUUID(), name, price)

        if (response.rowCount === 1){
            console.log('Adicionado com sucesso!')
            res.status(201).send('Produto adicionado com sucesso.')
        } else {
            console.log('Erro ao adicionar produto.')
            res.status(500).send('Erro ao adicionar produto.')
        }
    } catch (error) {
        console.error('Erro:' + error.message)
    }
})

process.on('SIGINT', async () => {
    await databaseClient.end()
    process.exit()
})

export default router