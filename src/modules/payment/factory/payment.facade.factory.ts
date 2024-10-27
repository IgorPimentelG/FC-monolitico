import PaymentFacade from "../facade/payment.facade";
import PaymentFacadeInterface from "../facade/payment.facade.interface";
import PaymentRepository from "../repository/payment.repository";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";

export default class PaymentFacadeFactory {
  static create(): PaymentFacadeInterface {
    const paymentRepository = new PaymentRepository();
    const processUseCase = new ProcessPaymentUseCase(paymentRepository);
    return new PaymentFacade(processUseCase);
  }
}