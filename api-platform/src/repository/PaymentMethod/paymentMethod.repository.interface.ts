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
}
