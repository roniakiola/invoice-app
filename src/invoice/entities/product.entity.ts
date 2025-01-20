import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderLine } from './orderline.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  productName: string;

  @Column('decimal')
  price: number;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.product)
  orderLines: OrderLine[];
}
