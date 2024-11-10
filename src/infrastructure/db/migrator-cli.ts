import { join } from "path";
import { Sequelize } from "sequelize-typescript"
import { migrator } from "./migrator";
import ClientModel from "../../modules/client-adm/repository/client.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import CheckoutModel from "../../modules/checkout/repository/checkout.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { default as ProductCatalogModel } from "../../modules/store-catalog/repository/product.model";
import { default as ProductCheckoutModel } from "../../modules/checkout/repository/product.model";
import { default as ClientCheckoutModel } from "../../modules/checkout/repository/client.model";

export const dbConnection = async () => {
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: join(__dirname, "../db/database.sqlite"),
    logging: console.log,
  });

  sequelize.addModels([
    ClientModel,
    ClientCheckoutModel,
    InvoiceModel,
    InvoiceItemModel,
    CheckoutModel,
    ProductModel,
    ProductCatalogModel,
    ProductCheckoutModel,
    TransactionModel,
  ]);

  await migrator(sequelize).up();
}
