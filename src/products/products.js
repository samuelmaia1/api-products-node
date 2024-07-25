import {randomUUID} from 'node:crypto'
import {databaseClient} from '../database-config.js'
import express from 'express'
import { error } from 'node:console'
const router = express.Router()

databaseClient.connect()
.then(() => console.log('Banco de dados conectado.'))
.catch((error) => console.log(error.message))

router.get('/', async (req, res) => {
    try {
        async function getAllProducts(){
            const select = `SELECT * FROM products`

            const response = await databaseClient.query(select)

            return response.rows
        }

        const response = await getAllProducts()

        return res
        .setHeader('Content-type', 'application/json')
        .end(JSON.stringify(response))
    } catch (error) {
        
    }
})

router.get('/:id', async (req, res) => {
    try {
        async function getProduct(id){
            const select = `SELECT * FROM products WHERE id = '${id}'`

            const response = await databaseClient.query(select)

            return response
        }

        const {id} = req.params

        console.log(id)
        const response = await getProduct(id)

        return res
        .setHeader('Content-type', 'application/json')
        .end(JSON.stringify(response.rows[0]))
    } catch (error) {
        
    }
})

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

router.put('/:id', async (req, res) => {
    try {
        async function updateProduct(id, name, price){
            const update = `UPDATE products SET name = '${name}', price = ${price} WHERE id = '${id}'`

            const response = await databaseClient.query(update)

            return response
        }

        const {name, price} = req.body
        const {id} = req.params

        const response = await updateProduct(id, name, price)

        return res.end('Produto atualizado com sucesso.')
    } catch (error) {
        console.error(error.message)
    }
})

process.on('SIGINT', async () => {
    await databaseClient.end()
    process.exit()
})

export default router