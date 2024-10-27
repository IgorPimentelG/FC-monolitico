import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import { FindClientUseCase } from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "x@x.com",
  address: "Address 1",
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
}

describe("Find client usecase unit test", () => {
  it("shoudl add a client", async () => {
    const repository = MockRepository();
    const usecase = new FindClientUseCase(repository);

    const input = { id: "1" };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual("1");
    expect(result.name).toEqual("Client 1");
    expect(result.email).toEqual("x@x.com");
    expect(result.address).toEqual("Address 1");
  });
});

