


export type Schema = {
  userId:  string ,
  firstName:  string ,
  lastName:  string ,
  email:  string ,
  password:  string ,
  createdAt:  Date ,
  merchant: merchant,
}


type merchant= {
    merchantId: string ,
    companyName: string ,
    createdAt: Date ,
    redirectionUrlConfirm: string ,
    redirectionUrlCancel: string ,
    currency: "EUR" | "USD" | "GBP" ,
    contactEmail: string ,
    isActive: boolean ,
    contactPhone: string ,
    contactFirstName: string ,
    contactLastName: string ,
    kbisUrl: string ,
    iban: string ,
    transactions: transactions[],
  }




type transactions = {
        transactionId:  string ,
        merchantId:  string ,
        externalRef:  string ,
        amount:  number ,
        currency: "EUR" | "USD" | "GBP" ,
        createdAt:  Date ,
        operations: operations[],
      }


type operations = 
          {
            operationId:  string ,
            transactionId:  string ,
            merchantIban:  string ,
            customerPaymentMethodId:  string ,
            type: string ,
            status:  string ,
            amount:  Number ,
            lastFourDigits:  string ,
            currency: "EUR" | "USD" | "GBP" ,
            createdAt:  Date ,
            paymentMethod: paymentMethod,      
          }

type paymentMethod = {
              id: string ,
              cardHolderName:  string ,
              cardNumber:  string ,
              expiryDate:  string ,
              cvv:  string ,
            }