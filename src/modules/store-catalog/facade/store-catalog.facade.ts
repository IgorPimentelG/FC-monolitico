import UseCaseInterface from "../../@shared/uescase/ues-case.interface";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  findAllUsecase: UseCaseInterface;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {

  private _findUsecase: UseCaseInterface;
  private _findAllUsecase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._findUsecase = props.findUsecase;
    this._findAllUsecase = props.findAllUsecase;
  }

  async find(id: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUsecase.execute(id);
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return await this._findAllUsecase.execute({});
  }
}