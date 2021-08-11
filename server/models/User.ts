import {
  Table,
  Column,
  DataType,
  AllowNull,
  IsEmail,
} from "sequelize-typescript";

import { BaseModel } from "./BaseModel";

@Table({
  timestamps: false,
  tableName: "user",
})
export class User extends BaseModel {
  @Column({ type: DataType.STRING })
  public name!: string;

  @IsEmail
  @Column({ type: DataType.STRING })
  public email!: string;

  @AllowNull
  @Column({ type: DataType.STRING })
  public password?: string;
}
