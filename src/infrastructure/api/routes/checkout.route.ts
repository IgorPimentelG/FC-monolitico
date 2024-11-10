import express, { Request, Response } from "express";
import CheckoutFacadeFactory from "../../../modules/checkout/factory/checkout.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {

  const facade = CheckoutFacadeFactory.create();

  try {
    const input = {
      clientId: req.body.clientId,
      products: req.body.products,
    };

    const checkout = await facade.placeOrder(input);
    res.status(200).send(checkout);
  } catch (error) {
    res.status(500).send(error);
  }
});