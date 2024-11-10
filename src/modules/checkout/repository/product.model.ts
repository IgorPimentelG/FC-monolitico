import { Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import CheckoutModel from "./checkout.model";

@Table({
  tableName: "products",
  modelName: "product-checkout",
  timestamps: false,
})
export default class ProductModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: false })
  declare salesPrice: number;

  @ForeignKey(() => CheckoutModel)
  @Column({ allowNull: true })
  declare orderId: string;
}