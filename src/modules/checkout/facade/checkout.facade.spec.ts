import { Sequelize } from "sequelize-typescript";
import CheckoutModel from "../repository/checkout.model";
import ProductModel from "../repository/product.model";
import ClientModel from "../repository/client.model";
import CheckoutFacade from "./checkout.facade";
import CheckoutRepository from "../repository/checkout.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

describe("CheckoutFacade test", () => {

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

  it("should place an order", async () => {
    const clientProps = { 
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
    };

    await ClientModel.create(clientProps);

    const clientFacadeMock = {
      add: jest.fn(),
      find: jest.fn().mockResolvedValue(Promise.resolve(clientProps)),
    };
    
    const productFacadeMock = {
      addProduct: jest.fn(),
      checkStock: jest.fn().mockResolvedValue(Promise.resolve({
        productId: "1",
        stock: 10,
      })),
    };

    const invoiceFacadeMock = {
      generate: jest.fn().mockResolvedValue(Promise.resolve({
        id: "1",
        name: "Invoice 1",
        document: "Document 1",
        street: "Street 1",
        number: "Number 1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip Code 1",
        total: 100,
        items: [{
          id: "1",
          name: "Product 1",
          price: 100,
        }]
      })),
      find: jest.fn(),
    };

    const paymentFacadeMock = {
      process: jest.fn().mockResolvedValue(Promise.resolve({
        transactionId: "1",
        orderId: "1",
        status: "approved",
        amount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    };

    const storeCatalogFacadeMock = {
      find: jest.fn().mockResolvedValue(Promise.resolve({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 100,
      })),
      findAll: jest.fn(),
    };

    const checkoutRepository = new CheckoutRepository();

    const placeOrderUseCase = new PlaceOrderUseCase(
      clientFacadeMock,
      productFacadeMock,
      storeCatalogFacadeMock,
      invoiceFacadeMock,
      paymentFacadeMock,
      checkoutRepository,
    );

    const facade = new CheckoutFacade(placeOrderUseCase);

    const input = {
      clientId: "1",
      products: [
        { productId: "1" }
      ],
    };

    const checkout = await facade.placeOrder(input);

    expect(checkout).toBeDefined();
    expect(checkout.id).toBeDefined();
    expect(checkout.invoiceId).toBeDefined();
    expect(checkout.status).toBe("approved");
    expect(checkout.total).toBe(100);
    expect(checkout.products).toStrictEqual([{ productId: "1" }]);
  });
});