import { Controller, Get, Param } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get('generate')
  async generateXML() {
    const generateXML = await this.invoiceService.generateXML();
    return generateXML;
  }

  @Get('file/:filename')
  async checkIfFileExists(@Param('filename') fileName: string) {
    const fileExists = await this.invoiceService.checkIfFileExists(fileName);
    return { fileExists };
  }
}
