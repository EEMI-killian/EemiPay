import { r } from "@faker-js/faker/dist/airline-BUL6NtOJ";
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
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    const request = fetch("http://psp:3052/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantIban,
        merchantName,
        amount,
        currency,
        cardInfo: { cardNumber, cardExpiry, cardHolderName, cardCvc },
      }),
    });
    const response = await request;
    return {
      success: response.ok,
      message: response.statusText,
    };
  }
}
