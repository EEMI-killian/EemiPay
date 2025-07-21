import mongoose, { Schema } from "mongoose";

const modelSchema = new Schema({
  userId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  createdAt: { type: Date },
  isActive: { type: Boolean },
  merchant: {
    merchantId: { type: String },
    companyName: { type: String },
    createdAt: { type: Date },
    redirectionUrlConfirm: { type: String },
    redirectionUrlCancel: { type: String },
    currency: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    contactFirstName: { type: String },
    contactLastName: { type: String },
    kbisUrl: { type: String },
    iban: { type: String },
    transactions: [
      {
        transactionId: { type: String },
        merchantId: { type: String },
        externalRef: { type: String },
        amount: { type: Number },
        currency: { type: String },
        createdAt: { type: Date },
        operations: [
          {
            operationId: { type: String },
            transactionId: { type: String },
            merchantIban: { type: String },
            customerPaymentMethodId: { type: String },
            type: { type: String },
            status: { type: String },
            amount: { type: Number },
            currency: { type: String },
            createdAt: { type: Date },
            paymentMethod: {
              id: { type: String },
              cardHolderName: { type: String },
              cardNumber: { type: String },
              expiryDate: { type: String },
              cvv: { type: String },
            },
          },
        ],
      },
    ],
  },
});

export const ModelDocument = mongoose.model("Model", modelSchema);
