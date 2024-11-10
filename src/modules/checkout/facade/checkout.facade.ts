import UseCaseInterface from "../../@shared/uescase/ues-case.interface";
import CheckoutFacadeInterface, { CheckoutFacadeInputDto, CheckoutFacadeOutputDto } from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface {

  constructor(private readonly placerOrderUseCase: UseCaseInterface) {}

  placeOrder(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto> {
    return this.placerOrderUseCase.execute(input);
  }
}