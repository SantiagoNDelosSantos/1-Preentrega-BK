import { Router } from "express";
import  { pdcMANGR } from "../server.js";

const router = Router();

router.get("/", async (req, res) => {

    // Traigo los productos:
    const products = await pdcMANGR.consultarProductos();

    // Renderizamos la vista del home con los productos:
    res.render("home", { style: "home.css", title: "Productos", products });

});

router.get("/realtimeproducts", async (req, res) => {

    // Traigo los productos:
    const products = await pdcMANGR.consultarProductos();

    // Renderizamos la vista del home con los Productos Actualizados:
    res.render("realTimeProducts", { style: "home.css", title: "Productos Actualizados", products });

});

// Exportamos router: 
export default router;