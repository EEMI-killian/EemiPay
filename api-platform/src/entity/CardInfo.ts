import { Column, Entity } from "typeorm";

@Entity()
export class CardInfo {
  @Column({ name: "id", type: "character varying", primary: true })
  id!: string;

  @Column({ name: "card_number" })
  cardNumber!: string;

  @Column({ name: "card_expiry_date" })
  cardExpiryDate!: Date;

  @Column({ name: "card_cvv" })
  cardCvv!: string;

  @Column({ name: "card_holder_name" })
  cardHolderName!: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;
}
