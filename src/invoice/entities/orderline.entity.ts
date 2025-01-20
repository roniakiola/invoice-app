import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'orderLines' })
export class OrderLine {
  @PrimaryGeneratedColumn()
  orderLineId: number;

  @ManyToOne(() => Order, (order) => order.orderLines)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderLines)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;
}
