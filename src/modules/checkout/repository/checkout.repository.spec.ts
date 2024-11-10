import { Sequelize } from "sequelize-typescript";
import CheckoutModel from "./checkout.model";
import ClientModel from "./client.model";
import ProductModel from "./product.model";
import CheckoutRepository from "./checkout.repository";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

describe("CheckoutRepository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CheckoutModel, ClientModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });
  
  it("should create checkout", async () => {
    const clientProps = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      document: "Document 1",
      street: "Street 1",
      number: "123",
      complement: "Apt 1",
      city: "City 1",
      state: "State 1",
      zipCode: "12345",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ClientModel.create(clientProps);
    const client = new Client(clientProps);

    const productProps = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ProductModel.create(productProps);
    const product = new Product(productProps);

    const order = new Order({
      id: "1",
      status: "approved",
      client: client,
      products: [product],
    });
    
    const repository = new CheckoutRepository();
    await repository.addOrder(order);

    const checkoutDb = await CheckoutModel.findOne({ where: { id: "1" }, include: [{ model: ClientModel }, { model: ProductModel }]});
    
    expect(checkoutDb).toBeDefined();
    expect(checkoutDb!.clientId).toBe("1");
    expect(checkoutDb!.status).toBe("approved");
    expect(checkoutDb!.client).toBeDefined();
    expect(checkoutDb!.client!.id).toBe("1");
    expect(checkoutDb!.client!.name).toBe("Client 1");
    expect(checkoutDb!.client!.document).toBe("Document 1");
    expect(checkoutDb!.client!.email).toBe("x@x.com");
    expect(checkoutDb!.client!.street).toBe("Street 1");
    expect(checkoutDb!.client!.number).toBe("123");
    expect(checkoutDb!.client!.complement).toBe("Apt 1");
    expect(checkoutDb!.client!.city).toBe("City 1");
    expect(checkoutDb!.client!.state).toBe("State 1");
    expect(checkoutDb!.client!.zipCode).toBe("12345");
    expect(checkoutDb!.products).toHaveLength(1);
    expect(checkoutDb!.products[0]).toBeDefined();
    expect(checkoutDb!.products[0]!.id).toBe("1");
    expect(checkoutDb!.products[0]!.name).toBe("Product 1");
    expect(checkoutDb!.products[0]!.description).toBe("Description 1");
    expect(checkoutDb!.products[0]!.salesPrice).toBe(100);
  });

  it("should find checkout", async () => {
    await CheckoutModel.create({
      id: "1",
      clientId: "1",
      status: "approved",
      client: {
        id: "1",
        name: "Client 1",
        email: "x@x.com",
        document: "Document 1",
        street: "Street 1",
        number: "123",
        complement: "Apt 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      products: [{
        id: "1",
        name: "Product 1",
        description: "Description 1",
        salesPrice: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      include: [{ model: ClientModel }, { model: ProductModel }]
    });

    const repository = new CheckoutRepository();
    const checkout = await repository.findOrder("1");

    expect(checkout).toBeDefined();
    expect(checkout!.status).toBe("approved");
    expect(checkout!.total).toBe(100);
    expect(checkout!.client).toBeDefined();
    expect(checkout!.client.id.id).toBe("1");
    expect(checkout!.client.name).toBe("Client 1");
    expect(checkout!.client.email).toBe("x@x.com");
    expect(checkout!.client.street).toBe("Street 1");
    expect(checkout!.client.number).toBe("123");
    expect(checkout!.client.complement).toBe("Apt 1");
    expect(checkout!.client.city).toBe("City 1");
    expect(checkout!.client.state).toBe("State 1");
    expect(checkout!.client.zipCode).toBe("12345");
    expect(checkout!.products).toHaveLength(1);
    expect(checkout!.products[0]).toBeDefined();
    expect(checkout!.products[0].id.id).toBe("1");
    expect(checkout!.products[0].name).toBe("Product 1");
    expect(checkout!.products[0].description).toBe("Description 1");
    expect(checkout!.products[0].salesPrice).toBe(100);
  });

  it("should throws an error when find an invoice that does not exist", async () => {
    const repository = new CheckoutRepository();
    await expect(repository.findOrder("0")).rejects.toThrow("Checkout with id 0 not found.");
  });
});