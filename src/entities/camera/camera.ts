import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { CameraStatus } from "./interfaces";

@Entity()
export default class Camera {
    @PrimaryGeneratedColumn("uuid")
    declare id: string;

    @Column("boolean", { nullable: false })
    declare ptzEnabled: boolean;

    @Column("text", { nullable: false })
    declare name: string;

    @Column("text", { nullable: false })
    declare ipAddress: string;

    @Column("enum", {
        enum: CameraStatus,
        nullable: false,
        default: CameraStatus.Registered,
    })
    declare status: CameraStatus;

    @CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    })
    declare createdAt: Date;

    @UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    })
    declare updatedAt: Date;
}
