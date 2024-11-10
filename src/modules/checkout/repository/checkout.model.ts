import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ProductModel from "./product.model";
import ClientModel from "./client.model";

@Table({
  tableName: "checkouts",
  modelName: "checkout",
  timestamps: false,
})
export default class CheckoutModel extends Model {

  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare status: string;

  @HasMany(() => ProductModel)
  declare products: ProductModel[];

  @ForeignKey(() => ClientModel)
  @Column({ allowNull: false })
  declare clientId: string;

  @BelongsTo(() => ClientModel)
  declare client: ClientModel;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}