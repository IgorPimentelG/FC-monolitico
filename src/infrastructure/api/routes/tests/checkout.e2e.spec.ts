import express, { Express } from "express";
import request from "supertest";
import { checkoutRoute } from "../checkout.route";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../db/migrator";
import ClientModel from "../../../../modules/client-adm/repository/client.model";
import InvoiceModel from "../../../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../../../modules/invoice/repository/invoice-item.model";
import CheckoutModel from "../../../../modules/checkout/repository/checkout.model";
import { ProductModel } from "../../../../modules/product-adm/repository/product.model";
import TransactionModel from "../../../../modules/payment/repository/transaction.model";
import { default as ProductCatalogModel } from "../../../../modules/store-catalog/repository/product.model";
import { default as ProductCheckoutModel } from "../../../../modules/checkout/repository/product.model";
import { default as ClientCheckoutModel } from "../../../../modules/checkout/repository/client.model";

describe("Checkout end-to-end test", () => {

  const app: Express = express();
  app.use(express.json());
  app.use("/checkout", checkoutRoute);

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
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
    migration = migrator(sequelize);
    await migration.up();
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return 
    }

    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should create checkout", async () => {
    await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.bulkCreate([
      { 
        id: "1", 
        name: "Product 1", 
        description: "Product Description 1", 
        purchasePrice: 100, 
        stock: 10, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        id: "2", 
        name: "Product 2", 
        description: "Product Description 2", 
        purchasePrice: 200,
        stock: 10, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ]);

    ProductCatalogModel.update({ salesPrice: 200 }, { where: { id: "1" }});
    ProductCatalogModel.update({ salesPrice: 300 }, { where: { id: "2" }});

    const response = await request(app).post("/checkout").send({
      clientId: "1",
      products: [
        { productId: "1" },
        { productId: "2" },
      ]
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(500);
    expect(response.body.products).toStrictEqual([{ productId: "1" }, { productId: "2" }]);
  });
});