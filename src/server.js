import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import productsRouter from './products/products.js'

dotenv.config()

const port = process.env.PORT

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

app.use(cors())

app.use('/products', productsRouter)

app.get('/', (req, res) => {
    return res
    .setHeader('Content-type', 'application/json')
    .end(JSON.stringify({
        add_product_url: 'http://localhost:3000/products/new',
        product: 'http://localhost:3000/products/{id}',
        remove_product_url: 'http://localhost:3000/products/remove/{id}',
        update_product_url: 'http://localhost:3000/products/update/{id}'
    }, null, 3))
})

app.listen(port, () => {
    console.log('Servidor rodando na porta ' + port)
})