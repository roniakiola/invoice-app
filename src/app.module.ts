import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModule } from './invoice/invoice.module';
import { DataSource } from 'typeorm';
import { Customer } from './invoice/entities/customer.entity';
import { Order } from './invoice/entities/order.entity';
import { OrderLine } from './invoice/entities/orderline.entity';
import { Product } from './invoice/entities/product.entity';

@Module({
  imports: [
    InvoiceModule,
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000,
      },
      entities: [Customer, Order, OrderLine, Product],
      logging: false,
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
