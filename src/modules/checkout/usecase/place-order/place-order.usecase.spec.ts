import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

const mockDate = new Date(2000, 1, 1);

describe("PlaceOrderUseCase unit test", () => {
  
  describe("validateProducts method", () => {

    // @ts-expect-error
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an erro if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("No products selected")
      );
    });
    
    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) => ({
          productId,
          stock: productId === "1" ? 0 : 1,
        })),
      };

      // @ts-expect-error
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
        new Error("Product 1 is not available in stock")
      );
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      // @ts-expect-error
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    // @ts-expect-error
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      // @ts-expect-error
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
      };

      // @ts-expect-error
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        })
      );
      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("execute method", () => {
    it("should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockReturnValue(null),
      };
  
      // @ts-expect-error
      const placeOrderUseCase = new PlaceOrderUseCase();
 
      // @ts-expect-error
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };
  
      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockReturnValue(true),
      };

      // @ts-expect-error
      const placeOrderUseCase = new PlaceOrderUseCase();
  
      // @ts-expect-error
      placeOrderUseCase["_clientFacade"] = mockClientFacade;
    });
  });

  describe("place an order", () => {
    const clientProps = {
      id: "1",
      name: "Client 1",
      document: "0000",
      email: "x@x.com",
      street: "street",
      number: "1",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "zipCode",
    };

    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(clientProps),
    };

    const mockPaymentFacade = {
      process: jest.fn(),
    };

    const mockCheckoutRepository = {
      addOrder: jest.fn(),
    };

    const mockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({ id: "1" }),
    };

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null as any,
      null as any,
      mockInvoiceFacade as any,
      mockPaymentFacade,
      mockCheckoutRepository as any,
    );

    const products = {
      "1": new Product({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 40,
      }),
      "2": new Product({
        id: "2",
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 30,
      }),
    };

    const mockValidateProducts = jest
    // @ts-expect-error
    .spyOn(placeOrderUseCase, "validateProducts")
    // @ts-expect-error
    .mockResolvedValue(null);

    const mockGetProduct = jest
    // @ts-expect-error
    .spyOn(placeOrderUseCase, "getProduct")
    // @ts-expect-error
    .mockImplementation((productId: keyof typeof products) => {
      return products[productId];
    });

    it("should not be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1",
        orderId: "1",
        amount: 100,
        status: "error",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUseCase.execute(input);

      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([ { productId: "1" },
        { productId: "2" },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    it("should be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1",
        orderId: "1",
        amount: 100,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      const output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBe("1");
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([ { productId: "1" }, { productId: "2" } ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
        name: clientProps.name,
        document: clientProps.document,
        street: clientProps.street,
        number: clientProps.number,
        complement: clientProps.complement,
        state: clientProps.state,
        city: clientProps.city,
        zipCode: clientProps.zipCode,
        items: [
          {
            id: products["1"].id.id,
            name: products["1"].name,
            price: products["1"].salesPrice,
          },
          {
            id: products["2"].id.id,
            name: products["2"].name,
            price: products["2"].salesPrice,
          }
        ],
      });
    });
  });
});