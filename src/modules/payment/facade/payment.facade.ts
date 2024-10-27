import UseCaseInterface from "../../@shared/uescase/ues-case.interface";
import PaymentFacadeInterface, { PaymentFacadeInputDto, PaymentFacadeOutputDto } from "./payment.facade.interface";

export default class PaymentFacade implements PaymentFacadeInterface {

  constructor(private readonly processPaymentUseCase: UseCaseInterface) {}

  process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return this.processPaymentUseCase.execute(input);
  }
}