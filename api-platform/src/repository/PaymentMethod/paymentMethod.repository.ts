import { Repository } from "typeorm/repository/Repository";
import { PaymentMethod } from "../../entity/PaymentMethod";
import { IPaymentMethodRepository } from "./paymentMethod.repository.interface";
import { ModelDocument } from "../../mongoSchema";
import mongoose from "mongoose";

export class PaymentMethodRepository implements IPaymentMethodRepository {
  constructor(private paymentMethodRepository: Repository<PaymentMethod>) {}
  async save({
    transactionId,
    operationId,
    id,
    cardHolderName,
    cvv,
    expiryDate,
    cardNumber,
  }: {
    transactionId: string;
    operationId: string;
    id: string;
    cardHolderName: string;
    cvv: string;
    expiryDate: string;
    cardNumber: string;
  }): Promise<void> {
    const paymentMethod = this.paymentMethodRepository.create({
      id,
      cardHolderName,
      cvv,
      expiryDate,
      cardNumber,
    });
    await this.paymentMethodRepository.save(paymentMethod);
    const paymentMethodData = {
      paymentMethodId: id,
      cardHolderName,
      cvv,
      expiryDate,
      cardNumber,
    };
    await mongoose.connect(
      "mongodb://mongo:mongo@mongodb:27017/eemi-pay?authSource=admin",
    );
    await ModelDocument.findOneAndUpdate(
      {
        "merchant.transactions.transactionId": transactionId,
      },
      {
        $push: {
          "merchant.transactions.$.operations": {
            operationId: operationId,
            paymentMethod: paymentMethodData,
          },
        },
      },
      { new: true },
    );
    await mongoose.disconnect();
  }
  async findById(id: string): Promise<PaymentMethod | null> {
    return this.paymentMethodRepository.findOne({ where: { id } });
  }
}
