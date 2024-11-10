import express, { Express } from "express";
import request from "supertest";
import { clientRoute } from "../client.route";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import ClientModel from "../../../../modules/client-adm/repository/client.model";
import { migrator } from "../../../db/migrator";

describe("Client end-to-end test", () => {

  const app: Express = express();
  app.use(express.json());
  app.use("/clients", clientRoute);

  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    sequelize.addModels([ClientModel]);
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

  it("should create client", async () => {
    const response = await request(app).post("/clients").send({
      name: "Client 1",
      email: "x@x.com",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1"
    });

    expect(response.statusCode).toBe(201);
  });
});