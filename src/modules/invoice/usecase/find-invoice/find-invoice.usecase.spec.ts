import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.entity";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

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


const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
}

describe("Find invoice usecase unit test", () => {
  it("should find a invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = { id: "1" };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("Document 1");
    expect(result.address).toEqual({
      street: "Street 1",
      number: "Number 1",
      complement: "Complement 1",
      city: "City 1",
      state: "State 1",
      zipCode: "Zip Code 1",
    });
    expect(result.items).toEqual([
      { id: "1", name: "Item 1", price: 100 },
      { id: "2", name: "Item 2", price: 200 },
    ]);
    expect(result.total).toBe(300);
    expect(result.createdAt).toBeDefined();
  });
});