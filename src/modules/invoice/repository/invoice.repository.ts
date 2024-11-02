import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.entity";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

  async add(invoice: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      items: invoice.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
    )}, {
      include: [{ model: InvoiceItemModel }],
    });
  }

  async find(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({ 
      where: { id },
      include: [{ model: InvoiceItemModel }],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found.`);
    }

    const address = new Address({
      street: invoice.street,
      number: invoice.number,
      complement: invoice.complement,
      city: invoice.city,
      state: invoice.state,
      zipCode: invoice.zipCode,
    });

    const items = invoice.items.map(item => new InvoiceItem({
      id: new Id(item.id),
      name: item.name,
      price: item.price,
    }));

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address,
      items,
    });
  }
}