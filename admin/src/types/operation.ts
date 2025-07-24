export type Operation = {
  id: string
  type: 'CAPTURE' | 'REFUND'
  amount: number
  transactionId: string
  currency: 'EUR' | 'USD' | 'GBP'
  customerPaymentMethodId: string
  lastFourDigits: string
  merchantIban: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  createdAt: Date
  updatedAt: Date
}
