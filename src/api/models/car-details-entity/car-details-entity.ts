import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { VINDetailsEntity } from "../vin-details-entity/vin-details-entity";

@Entity("CarDetails")
export class CarDetailsEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type:'varchar', unique: true })
  @Index("car_license_index", { unique: true})
  licenseplate_number: string;

  @Column()
  registration_number: string;

  @Column()
  registration_state: string;

  @Column('datetime')
  registration_expiration: Date;

  @Column()
  registration_name: string;

  @OneToOne(type => VINDetailsEntity, vinDetaild => vinDetaild.id, {onDelete:'CASCADE'})
  @JoinColumn()
  vin_details: VINDetailsEntity

  @Column("double")
  car_value: number;

  @Column("double")
  current_mileage: number;

  @Column({ type:'longtext', nullable: true })
  description: string;

  @Column()
  color: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @DeleteDateColumn()
  deletedDate: Date;
}
