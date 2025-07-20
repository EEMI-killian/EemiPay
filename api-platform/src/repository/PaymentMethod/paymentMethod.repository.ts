import { Repository } from "typeorm/repository/Repository";
import { PaymentMethod } from "../../entity/PaymentMethod";
import { IPaymentMethodRepository } from "./paymentMethod.repository.interface";

export class PaymentMethodRepository implements IPaymentMethodRepository {
  constructor(private paymentMethodRepository: Repository<PaymentMethod>) {}
  async save({
    id,
    cardHolderName,
    cvv,
    expiryDate,
    cardNumber,
  }: {
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
  }
}
