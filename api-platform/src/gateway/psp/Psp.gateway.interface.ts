export interface IPspGateway {
  makeTransaction({
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
  }): Promise<{ success: boolean; message: string }>;
}
