import Transaction from "../domain/transaction";
import PaymentGateway from "../gateway/payment.gateway";
import TransactionModel from "./transaction.model";

export default class PaymentRepository implements PaymentGateway {

  async save(input: Transaction): Promise<Transaction> {
      await TransactionModel.create({
        id: input.id.id,
        status: input.status,
        orderId: input.orderId,
        amount: input.amount,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      });

      return new Transaction({
        id: input.id,
        status: input.status,
        orderId: input.orderId,
        amount: input.amount,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      });
  }
}