import { Sequelize } from "sequelize-typescript";
import ClientModel from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("ClientAdmFacade test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
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
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: "1" }});
    expect(client).toBeDefined();
    expect(client!.name).toBe(input.name);
    expect(client!.email).toBe(input.email);
    expect(client!.document).toBe(input.document);
    expect(client!.street).toBe(input.street);
    expect(client!.number).toBe(input.number);
    expect(client!.complement).toBe(input.complement);
    expect(client!.city).toBe(input.city);
    expect(client!.state).toBe(input.state);
    expect(client!.zipCode).toBe(input.zipCode);
  });

  it("should find a client", async () => {
    const facade = ClientAdmFacadeFactory.create();

    const input = {
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
    };

    await facade.add(input);

    const client = await facade.find({ id: input.id });
    expect(client).toBeDefined();
    expect(client!.id).toBe(input.id);
    expect(client!.name).toBe(input.name);
    expect(client!.email).toBe(input.email);
    expect(client!.document).toBe(input.document);
    expect(client!.street).toBe(input.street);
    expect(client!.number).toBe(input.number);
    expect(client!.complement).toBe(input.complement);
    expect(client!.city).toBe(input.city);
    expect(client!.state).toBe(input.state);
    expect(client!.zipCode).toBe(input.zipCode);
  });
});