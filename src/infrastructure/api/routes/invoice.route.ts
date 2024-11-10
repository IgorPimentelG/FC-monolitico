import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/:id", async (req: Request, res: Response) => {

  const facade = InvoiceFacadeFactory.create();

  try {
    const { id } = req.params;
    const invoice = await facade.find({ id });
    res.status(200).send(invoice);
  } catch (error) {
    res.status(500).send(error);
  }
});