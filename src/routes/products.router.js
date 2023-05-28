import { Router } from "express";
import ManagerProducts from "../classes/ProductsManager.class.js";

const router = Router();

const managerProducts = new ManagerProducts()

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const product = await managerProducts.consultarProductoPorId(id);
    res.send({ product });
});

router.get("/", async (req, res) => {
    const products = await managerProducts.consultarProductos();
    res.send({ products });
});

router.post("/", async (req, res) => {
    console.log(req.body);
    const product = req.body;
    managerProducts.crearProducto(product);
    res.send({ status: "Success."});
});

router.put("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const updatedFields = req.body;
    const updatedProduct = await managerProducts.actualizarProducto(pid, updatedFields);
    res.send( updatedProduct );
});

router.delete("/:pid", async (req, res) => {
    const pid = req.params.pid;
    const result = await managerProducts.eliminarProducto(pid);
    res.send(result);
});

export default router;