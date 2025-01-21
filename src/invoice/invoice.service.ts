import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { XMLBuilder } from 'fast-xml-parser';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class InvoiceService {
  private readonly blobServiceClient: BlobServiceClient;

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    const blobUrl = process.env.BS_STRING as string;
    this.blobServiceClient = new BlobServiceClient(blobUrl);
  }

  async getAllCustomerData() {
    // Fetch all orders with customers, order lines, and products
    const orders = await this.orderRepository.find({
      relations: ['customer', 'orderLines', 'orderLines.product'], // Load related data
    });

    if (!orders || orders.length === 0) {
      throw new Error('No orders found');
    }

    // Prepare the data in the required format
    const invoiceData = orders.map((order) => ({
      CustomerName: order.customer.name,
      CustomerAddress: order.customer.address,
      CustomerEmail: order.customer.email,
      DueDate: order.dueDate,
      Items: [
        ...order.orderLines.map((line) => ({
          Item: {
            ProductName: line.product.productName,
            Quantity: line.quantity,
            Price: line.product.price,
            Amount: line.quantity * line.product.price,
          },
        })),
      ],
      Total: order.orderLines.reduce(
        (acc, line) => acc + line.quantity * line.product.price,
        0,
      ),
    }));

    return invoiceData;
  }

  async generateXML(): Promise<string[]> {
    const data = await this.getAllCustomerData();
    const options = { format: true };
    const builder = new XMLBuilder(options);

    //this is just to see data in http response
    const generatedXMLs: string[] = [];

    const blobContainer =
      this.blobServiceClient.getContainerClient('Roni_Akiola');

    for (const invoice of data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const generatedXML: string = builder.build({ Invoice: invoice });

      generatedXMLs.push(generatedXML);

      const fileName = `Roni_Akiola_${invoice.CustomerName}_Invoice.xml`;
      const blobClient = blobContainer.getBlobClient(fileName);
      const blockBlobClient = blobClient.getBlockBlobClient();

      // Upload the file to Azure Blob Storage
      await blockBlobClient.upload(generatedXML, generatedXML.length);
    }
    return generatedXMLs;
  }

  async checkIfFileExists(fileName: string): Promise<boolean> {
    const containerClient =
      this.blobServiceClient.getContainerClient('Roni_Akiola');
    const blobClient = containerClient.getBlobClient(fileName);

    try {
      await blobClient.getProperties();
      console.log(`File ${fileName} found`);
      return true;
    } catch {
      console.log(`File ${fileName} NOT found`);
      return false;
    }
  }
}
