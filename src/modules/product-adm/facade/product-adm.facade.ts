import UseCaseInterface from "../../@shared/uescase/ues-case.interface";
import { AddProductFacadeInputDto, CheckStockFacadeInputDto, CheckStockFacadeOutputDto, ProductAdmFacadeInterface } from "./product-adm.facade.interface";

export interface UseCaseProps {
  addUseCase: UseCaseInterface;
  checkStockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {

  private _addUserCase: UseCaseInterface;
  private _checkStockUseCase: UseCaseInterface;

  constructor(usecases: UseCaseProps) {
    this._addUserCase = usecases.addUseCase;
    this._checkStockUseCase = usecases.checkStockUseCase;
  }

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addUserCase.execute(input);
  }

  checkStock(input: CheckStockFacadeInputDto): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(input);
  }
}