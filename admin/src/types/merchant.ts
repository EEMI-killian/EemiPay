export type Merchant = {
  id: string
  companyName: string
  contactEmail: string
  contactPhone: string
  contactFirstName: string
  contactLastName: string
  iban: string
  createdAt: Date
  currency: 'EUR' | 'USD' | 'GBP'
  kbisUrl: string
  redirectUrlConfirm: string
  redirectUrlCancel: string
  userId: string
  isActive: boolean
}
