import express from "express";
import { checkoutRoute } from "./routes/checkout.route";
import { clientRoute } from "./routes/client.route";
import { invoiceRoute } from "./routes/invoice.route";
import { productRoute } from "./routes/product.route";

export const app = express();

app.use(express.json());
app.use("/checkout", checkoutRoute);
app.use("/clients", clientRoute);
app.use("/invoice", invoiceRoute);
app.use("/products", productRoute);