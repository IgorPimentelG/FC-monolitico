import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import CheckoutModel from "./checkout.model";
import ClientModel from "./client.model";
import ProductModel from "./product.model";

export default class CheckoutRepository implements CheckoutGateway {

  async addOrder(order: Order): Promise<void> {
    await CheckoutModel.create({
      id: order.id.id,
      status: order.status,
      clientId: order.client.id.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      include: [{ model: ProductModel }, { model: ClientModel }],
    });

    order.products.forEach(async (product) => {
      ProductModel.update({
        orderId: order.id.id,
      }, {
        where: { id: product.id.id }
      });
    });
  }
  
  async findOrder(id: string): Promise<Order> {
    const checkout = await CheckoutModel.findOne({
      where: { id },
      include: [{ model: ProductModel }, { model: ClientModel }],
    });

    if (!checkout) {
      throw new Error(`Checkout with id ${id} not found.`);
    }

    return new Order({
      id: checkout.id,
      status: checkout.status,
      products: checkout.products.map((product) => new Product({
        id: product.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
      client: new Client({
        id: checkout.clientId,
        name: checkout.client.name,
        email: checkout.client.email,
        document: checkout.client.document,
        street: checkout.client.street,
        number: checkout.client.number,
        complement: checkout.client.complement,
        city: checkout.client.city,
        state: checkout.client.state,
        zipCode: checkout.client.zipCode,
      }),
    });
  }
}