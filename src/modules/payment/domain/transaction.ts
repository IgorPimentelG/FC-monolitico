import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object"

type TransactionProps = {
  id: Id;
  amount: number;
  orderId: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class TransactionId extends Id {
  constructor(id: string) {
    super(id);
  }
}

export default class Transaction extends BaseEntity implements AggregateRoot {

  private _amount: number;
  private _orderId: string;
  private _status: string;

  constructor(props: TransactionProps) {
    super(props.id);
    this._amount = props.amount;
    this._orderId = props.orderId;
    this._status = props.status ?? "pending";
    this.validate();
  }

  validate() {
    if (this.amount <= 0) {
      throw new Error("Amount must be greater than zero");
    }
  }

  approve() {
    this._status = "approved";
  }

  decline() {
    this._status = "declined";
  }

  process() {
    if (this.amount >= 100) {
      this.approve();
    } else {
      this.decline();
    }
  }

  get amount(): number {
    return this._amount;
  }

  get orderId(): string {
    return this._orderId;
  }

  get status(): string {
    return this._status;
  }
}