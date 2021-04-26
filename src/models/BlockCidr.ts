import { DataType, Model } from 'sequelize-typescript';
import sequelize from '../connectors/db/sequelize';
import { AbstractIPRange, IPv4, IPv4Prefix, IPv6, IPv6CidrRange, IPv6Prefix } from 'ip-num';
import { DataTypes } from 'sequelize';

export const REASON_DATACENTER = 'dc';
export const REASON_LOCAL_BLOCK = 'local';
declare type reason = typeof REASON_DATACENTER | typeof REASON_LOCAL_BLOCK

export const TYPE_IPV4 = 'ipv4';
export const TYPE_IPV6 = 'ipv6';

declare type type = typeof TYPE_IPV4 | typeof TYPE_IPV6
// declare type type = typeof TYPE_DATACENTER | typeof TYPE_LOCAL_BLOCK
/*
@Table({
  timestamps: true
})
export default class BlockCidr extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column id! :number;

  public ip!: IPv6;
  @Column(DataType.ENUM(TYPE_DATACENTER, TYPE_LOCAL_BLOCK)) type!:type

  @Column('varbinary(16)')ipStart!:IPv6|IPv4

  @Column('varbinary(16)') ipEnd!:IPv6|IPv4
}

BlockCidr.init({
  ip: {
    get (): IPv6 {
      return IPv6.fromBinaryString('::2');
    },
    type: 'varbinary(16)'
  }
}, { sequelize });

sequelize.addModels([BlockCidr]);
*/

export default class BlockCidr extends Model {
  public id! :number;

  public type!: type;
  public reason!: reason;
  public cidr!: AbstractIPRange<IPv4 | IPv6, IPv4Prefix | IPv6Prefix>;
}

BlockCidr.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataType.ENUM(TYPE_IPV4, TYPE_IPV6)
    },
    reason: {
      type: DataType.ENUM(REASON_DATACENTER, REASON_LOCAL_BLOCK)
    },
    cidr: {
      type: DataTypes.STRING,
      // allowNull: false,
      get (this: BlockCidr): AbstractIPRange<IPv4 | IPv6, IPv4Prefix | IPv6Prefix> {
        const cidr: string = this.getDataValue<string>('cidr');

        return IPv6CidrRange.fromCidr(cidr);
      },
      set (this: BlockCidr, val:AbstractIPRange<IPv4 | IPv6, IPv4Prefix | IPv6Prefix>) {
        console.log(val);
        this.setDataValue('cidr', val?.toCidrString());
      }
    }
  },
  {
    tableName: 'test',
    sequelize // this bit is important
  }
);
