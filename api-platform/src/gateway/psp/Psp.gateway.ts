import { IPspGateway } from "./Psp.gateway.interface";

export class PspGateway implements IPspGateway {
  constructor() {}
  async makeTransaction({
    merchantIban,
    merchantName,
    amount,
    currency,
    cardInfo: { cardNumber, cardExpiry, cardHolderName, cardCvc },
  }: {
    merchantIban: string;
    merchantName: string;
    amount: number;
    currency: string;
    cardInfo: {
      cardNumber: string;
      cardExpiry: string;
      cardHolderName: string;
      cardCvc: string;
    };
  }) {
    return {
      success: true,
      message: "Transaction processed successfully",
    };
  }
}
