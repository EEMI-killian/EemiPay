import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PaymentMethod {
  @PrimaryColumn({ name: "id" })
  id: string;

  @Column({ name: "card_holder_name" })
  cardHolderName: string;

  @Column({ name: "card_number" })
  cardNumber: string;

  @Column({ name: "expiry_date" })
  expiryDate: string;

  @Column({ name: "cvv" })
  cvv: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
