import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType } from 'sequelize-typescript';
import sequelize from '../connectors/db/sequelize';

@Table({
  timestamps: true,
  tableName: 'country'
})
export default class Country extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column id! :number;

  @Column(DataType.INTEGER)
  geonameId: number = 0;

  @Column(DataType.STRING)
  isoCode: string = '';

  @Column(DataType.STRING)
  name: string = '';

  @Column(DataType.JSON)
  names: Object = { };
}

sequelize.addModels([Country]);
