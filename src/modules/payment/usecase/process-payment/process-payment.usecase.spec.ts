import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const TransactionFactory = (amount: number) => new Transaction({
  id: new Id("1"),
  amount,
  orderId: "1",
});

const MockRepository = (amount = 100) => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(TransactionFactory(amount))),
  };
}

describe("Transaction payment usecase unit test", () => {
  
  it("should approve a transaction", async () => {
    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await usecase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe("1");
    expect(result.orderId).toBe(input.orderId);
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(input.amount);
    expect(result.createdAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
  });

  it("should decline a transaction", async () => {
    const paymentRepository = MockRepository(50);
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    
    const input = {
      orderId: "1",
      amount: 50,
    };

    const result = await usecase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.transactionId).toBe("1");
    expect(result.orderId).toBe(input.orderId);
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(input.amount);
    expect(result.createdAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
  });
});