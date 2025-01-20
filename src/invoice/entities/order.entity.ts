import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderLine } from './orderline.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column()
  customerId: number;

  @Column()
  dueDate: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order)
  orderLines: OrderLine[];
}
