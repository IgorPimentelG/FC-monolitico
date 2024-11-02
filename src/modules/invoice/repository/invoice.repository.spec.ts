import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Invoice from "../domain/invoice.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/address.entity";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {

  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Document 1",
      address: new Address({
        street: "Street 1",
        number: "Number 1",
        complement: "Complement 1",
        city: "City 1",
        state: "State 1",
        zipCode: "Zip Code 1",
      }),
      items: [
        new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 }),
        new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 200 }),
      ],
    });

    const repository = new InvoiceRepository();
    await repository.add(invoice);

    const invoiceDb = await InvoiceModel.findOne({ 
      where: { id: "1"},
      include: [InvoiceItemModel],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb!.name).toBe("Invoice 1");
    expect(invoiceDb!.document).toBe("Document 1");
    expect(invoiceDb!.street).toBe("Street 1");
    expect(invoiceDb!.number).toBe("Number 1");
    expect(invoiceDb!.complement).toBe("Complement 1");
    expect(invoiceDb!.city).toBe("City 1");
    expect(invoiceDb!.state).toBe("State 1");
    expect(invoiceDb!.zipCode).toBe("Zip Code 1");
    expect(invoiceDb!.items.length).toBe(2);
    expect(invoiceDb!.items[0].id).toBe("1");
    expect(invoiceDb!.items[0].name).toBe("Item 1");
    expect(invoiceDb!.items[0].price).toBe(100);
    expect(invoiceDb!.items[1].id).toBe("2");
    expect(invoiceDb!.items[1].name).toBe("Item 2");
    expect(invoiceDb!.items[1].price).toBe(200);
  });

  it("should find an invoice", async () => {
    const createdAt = new Date();
    const updatedAt = new Date();

    const invoice = await InvoiceModel.create({
      id: "1",
      name: "Invoice 1",
      document: "Document 1",
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
      createdAt,
      updatedAt,
      items: [
        { id: "1", name: "Item 1", price: 100, createdAt, updatedAt },
        { id: "2", name: "Item 2", price: 200, createdAt, updatedAt },
      ]}, {
      include: [{ model: InvoiceItemModel }],
    });

    const repository = new InvoiceRepository();
    const result = await repository.find("1");

    expect(result).toBeDefined();
    expect(result!.id.id).toBe(invoice.id);
    expect(result!.name).toBe(invoice.name);
    expect(result!.document).toBe(invoice.document);
    expect(result!.address.street).toBe(invoice.street);
    expect(result!.address.number).toBe(invoice.number);
    expect(result!.address.complement).toBe(invoice.complement);
    expect(result!.address.city).toBe(invoice.city);
    expect(result!.address.state).toBe(invoice.state);
    expect(result!.address.zipCode).toBe(invoice.zipCode);
    expect(result!.items.length).toBe(2);
    expect(result!.items[0].id.id).toBe(invoice.items[0].id);
    expect(result!.items[0].name).toBe(invoice.items[0].name);
    expect(result!.items[0].price).toBe(invoice.items[0].price);
    expect(result!.items[1].id.id).toBe(invoice.items[1].id);
    expect(result!.items[1].name).toBe(invoice.items[1].name);
    expect(result!.items[1].price).toBe(invoice.items[1].price);
  });

  it("throws an error when find an invoice that does not exist", async () => {
    const repository = new InvoiceRepository();
    await expect(repository.find("0")).rejects.toThrow("Invoice with id 0 not found.");
  });
});