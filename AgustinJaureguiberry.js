const express = require("express")
const {Router} = express
const api = express()
const port = 8080

class Productos {
    constructor(productos) {
        this.productos = productos
    }

     save(objet) {
        let id = 1;
        this.productos.forEach((e) => {
            if (e.id >= id) {
                id = e.id + 1
            }
        })
        objet.id = id
        this.productos.push(objet)
        return id
    }

     getById(id) {
        let prod = this.productos.find((e) => e.id == id)
        return prod
    }

     getAll() {
        return this.productos
    }

     deleteById(id) {
        this.productos.forEach((e,i) => {
            if (e.id == id) {
                this.productos.splice(i, 1)
            }
        })
    }

     replaceById(id, newProd) {
        let index = -1
        this.productos.forEach((e,i) => {
            if (e.id == id) {
                index = i
            }
        })
        if (index != -1) {
            this.productos[index] = {...newProd, id}
        } else {
            console.log('no se encontro producto pa reemplazar')
        }        
    }
}

// Definicion de variables
const productos = new Productos([])
const rutaProductos = Router()

// Lineas de utilizacion de json e index.html
api.use(express.json())
api.use(express.urlencoded({ extended: true }))
api.use(express.static(__dirname + '/public'))


// Definicion de Routes

rutaProductos.get('/', (peticion, respuesta) => {
    respuesta.json(productos.getAll())
})

rutaProductos.post('/',  (peticion, respuesta) => {
    const id = productos.save(peticion.body)
    respuesta.json(`id: ${id}`)
})

rutaProductos.get('/:id', (peticion, respuesta) => {
    const id = parseInt(peticion.params.id)
    const prod = productos.getById(id)
    if (prod) {
        respuesta.json(prod)
    } else {
        respuesta.json({error: 'producto no encontrado'})
    }

})

rutaProductos.put('/:id', (peticion, respuesta) => {
    const id = parseInt(peticion.params.id)
    const newProd = peticion.body
    productos.replaceById(id, newProd)
    respuesta.send(`Producto con id ${id} modificado con exito.`)
})

rutaProductos.delete('/:id', (peticion, respuesta) => {
    const id = parseInt(peticion.params.id)
    productos.deleteById(id)
    respuesta.json(productos.getAll())
})
// rutaProductos.get('/api/productos/:id', (peticion, respuesta) => {
//     respuesta.send('ok')
// })

api.use('/api/productos', rutaProductos)


// levantamiento de servidor

const servidor = api.listen(port, () => {
    console.log(`Servidor escuchando en el puerto: ${servidor.address().port}`)
})

servidor.on('error', error => console.log(`Error: ${error}`))