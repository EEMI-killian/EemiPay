import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Merchant } from "./Merchant";

@Entity()
export class MerchantContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: "phone_number", unique: true })
  phoneNumber: string;

  @ManyToOne(() => Merchant, (merchant) => merchant.contacts)
  merchant: Merchant;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
