import express, { urlencoded } from 'express';
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from 'socket.io';
import routerProducts from './routes/products.router.js';
import routerCart from './routes/cart.router.js'
import ProductManager from "./classes/ProductsManager.class.js";

// Iniciamos el servidor:
const app = express();

// Rutas extendidas:
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Configuración de archivos estáticos
app.use(express.static(__dirname + '/public'));

// Configuración Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Servidor HTTP:
const expressServer = app.listen(8080, () => {
    console.log(`Servidor iniciado en el puerto 8080.`);
});

// Rutas:
app.use('/api/products/', routerProducts)
app.use('/api/carts/', routerCart)
app.use('/', viewsRouter);


// Traigo los productos desde products.json:
export const pdcMANGR = new ProductManager(__dirname + "/files/products.json");

const products = await pdcMANGR.consultarProductos();

// Servidor Socket.io escuchando servidor HTTP:
const socketServer = new Server(expressServer);



socketServer.on("connection", socket => {

    // Mensaje de nuevo cliente conectado:
    console.log("¡Nuevo cliente conectado!", socket.id)

    // Enviamos los productos al cliente que se conecto: 
    socket.emit("productos", products);

    // Escuchamos el evento addProduct y recibimos el producto:

    socket.on("addProduct", (data) => {
        
        //Agregamos el producto a la lista de productos:
        products.push(data);

        // Enviamos los productos a todos los clientes conectados:
        socketServer.emit("productos", products);

    })

    // Escuchamos el evento deleteProduct y recibimos el id del producto:
    socket.on("deleteProduct", (id) => {
        
        // Eliminamos el producto de la lista de productos:
        products.splice(
            products.findIndex((product) => product.id === id),1
        );

        //Enviamos los productos a todos los clientes conectados:
        socketServer.emit("productos", products);

    })

});