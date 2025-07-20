import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PaymentMethod {
  @PrimaryColumn()
  id: string;

  @Column()
  cardHolderName: string;

  @Column()
  cardNumber: string;

  @Column()
  expiryDate: string;

  @Column()
  cvv: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
