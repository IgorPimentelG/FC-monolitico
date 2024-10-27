import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const props = {
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    }

    const product = new Product(props);
    const productRepository = new ProductRepository();
    await productRepository.add(product);

    const productDb = await ProductModel.findOne({
      where: { id: product.id.id },
    });

    expect(productDb).not.toBeNull();
    expect(productDb!.name).toBe(props.name);
    expect(productDb!.description).toBe(props.description);
    expect(productDb!.purchasePrice).toBe(props.purchasePrice);
    expect(productDb!.stock).toBe(props.stock);
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await productRepository.find("1");

    expect(product).not.toBeNull();
    expect(product!.name).toBe("Product 1");
    expect(product!.description).toBe("Product 1 description");
    expect(product!.purchasePrice).toBe(100);
    expect(product!.stock).toBe(10);
  });
});