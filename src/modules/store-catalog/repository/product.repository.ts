import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {

  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll({ raw: true });

    return products.map(product => {
      return new Product({
        id: new Id(product.id),
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      });
    });
  }

  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({ 
      where: { 
        id: id 
      }, 
      raw: true,
    });

    if (!product) {
      throw new Error(`Produto com id ${id} não encontrado`);
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}