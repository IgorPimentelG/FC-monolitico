import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {

  const facade = ProductAdmFacadeFactory.create();

  try {
    const input = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    await facade.addProduct(input);
    res.status(201).send();
  } catch (error) {
    res.status(500).send(error);
  }
});