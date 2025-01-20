import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';
import { OrderLine } from './entities/orderline.entity';
import { Product } from './entities/product.entity';
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Order, OrderLine, Product])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
