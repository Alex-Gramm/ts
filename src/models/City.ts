import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey } from 'sequelize-typescript';
import sequelize from '../connectors/db/sequelize';
import Country from './Country';

@Table({
  timestamps: true,
  tableName: 'country'
})
export default class City extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column id! :number;

  @ForeignKey(() => Country) @Column(DataType.INTEGER) countryId!: number;

  @Column(DataType.INTEGER)
  geonameId: number = 0;

  @Column(DataType.STRING)
  name: string = '';

  @Column(DataType.JSON)
  names: Object = { };
}

sequelize.addModels([City]);
