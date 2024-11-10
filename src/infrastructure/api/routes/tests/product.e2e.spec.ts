import express, { Express } from "express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "../../../db/migrator";
import { productRoute } from "../product.route";
import { ProductModel } from "../../../../modules/product-adm/repository/product.model";

describe("Product end-to-end test", () => {

  const app: Express = express();
  app.use(express.json());
  app.use("/products", productRoute);

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ProductModel]);
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

  it("should create product", async () => {
    const response = await request(app).post("/products").send({
      name: "Product 1",
      description: "Product description",
      purchasePrice: 100,
      stock: 10
    });

    expect(response.statusCode).toBe(201);
  });
});