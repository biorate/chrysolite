import { Table, Column, Model, DataType } from '@biorate/sequelize';

@Table({
  tableName: 'document',
  timestamps: false,
})
export class DocumentModel extends Model {
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  text: string;

  @Column({ type: DataType.STRING, allowNull: false })
  embedding: string;

  @Column({ type: DataType.DATE, allowNull: true })
  last_stamp: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  creation: Date;
}
