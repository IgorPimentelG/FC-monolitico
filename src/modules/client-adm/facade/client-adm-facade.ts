import UseCaseInterface from "../../@shared/uescase/ues-case.interface";
import ClientAdmFacadeInterface, { AddClientFacadeInputDto, FindClientFacadeInputDto, FindClientFacadeOutputDto } from "./client-adm.facade.interface";

export interface UseCaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadeInterface {

  private _findUsecase: UseCaseInterface;
  private _addUsecase: UseCaseInterface;

  constructor(props: UseCaseProps) {
    this._findUsecase = props.findUsecase;
    this._addUsecase = props.addUsecase;
  }


  add(input: AddClientFacadeInputDto): Promise<void> {
    return this._addUsecase.execute(input);
  }

  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto> {
    return this._findUsecase.execute(input);
  }
}