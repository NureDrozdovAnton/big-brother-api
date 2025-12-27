import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCameraId1766808984716 implements MigrationInterface {
    name = 'AddCameraId1766808984716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "camera" ADD "cameraId" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "camera" DROP COLUMN "cameraId"`);
    }

}
