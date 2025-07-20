import { PaymentMethod } from "../../entity/PaymentMethod";

export interface IPaymentMethodRepository {
  save({
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
  }): Promise<void>;
  findById(id: string): Promise<PaymentMethod | null>;
}
