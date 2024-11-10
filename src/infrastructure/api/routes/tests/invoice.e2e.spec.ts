import express, { Express } from "express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../db/migrator";
import InvoiceModel from "../../../../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../../../../modules/invoice/repository/invoice-item.model";
import { invoiceRoute } from "../invoice.route";

describe("Invoice end-to-end test", () => {

  const app: Express = express();
  app.use(express.json());
  app.use("/invoice", invoiceRoute);

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
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

  it("should find invoice", async () => {
    const invoice = await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [{
        id: "1",
        name: "Item 1",
        price: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      }]
    }, { include: [InvoiceItemModel] });

    const response = await request(app).get("/invoice/1").send();

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(invoice.id);
    expect(response.body.name).toBe(invoice.name);
    expect(response.body.document).toBe(invoice.document);
    expect(response.body.address.street).toBe(invoice.street);
    expect(response.body.address.number).toBe(invoice.number);
    expect(response.body.address.complement).toBe(invoice.complement);
    expect(response.body.address.city).toBe(invoice.city);
    expect(response.body.address.state).toBe(invoice.state);
    expect(response.body.address.zipCode).toBe(invoice.zipCode);
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0].id).toBe(invoice.items[0].id);
    expect(response.body.items[0].name).toBe(invoice.items[0].name);
    expect(response.body.items[0].price).toBe(invoice.items[0].price);
    expect(response.body.total).toBe(100);
  });
});