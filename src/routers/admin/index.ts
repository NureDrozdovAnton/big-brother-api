import { Router } from "express";
import db from "~/data-source";
import { Camera } from "~/entities";
import { isAdmin } from "~/guards";
import { validate } from "~/middlewares";
import { createCameraSchema, createOperatorSchema } from "./schema";
import { UserAuth } from "~/services";
import { UserRole } from "~/entities/user";

const MEDIA_MTX_URL = process.env.MEDIA_MTX_URL || "http://localhost:9997/v3";

const cameraRepo = db.getRepository(Camera);
const router = Router();

router.use(isAdmin);

router.get("/cameras", async (req, res) => {
    try {
        const cameras = await cameraRepo.find();
        res.status(200).json({ ok: true, data: cameras });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.post("/cameras", validate(createCameraSchema), async (req, res) => {
    try {
        const { ipAddress, name, cameraId, ptzEnabled, rtspUrl, ptzUrl } =
            req.body;

        const camera = cameraRepo.create({
            ipAddress,
            name,
            cameraId,
            ptzEnabled,
            rtspUrl: rtspUrl ?? null,
            ptzUrl: ptzUrl ?? null,
        });

        await cameraRepo.save(camera);

        if (rtspUrl) {
            const response = await fetch(
                `${MEDIA_MTX_URL}/config/paths/add/${cameraId}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        source: rtspUrl,
                        sourceOnDemand: true,
                    }),
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add camera to MediaMTX");
            }
        }

        res.status(201).json({ ok: true, data: camera });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.put("/cameras/:id", validate(createCameraSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const { ipAddress, name, ptzEnabled, rtspUrl, ptzUrl } = req.body;

        const camera = await cameraRepo.findOneBy({ id });

        if (!camera) {
            return res
                .status(404)
                .json({ ok: false, error: "Camera not found" });
        }

        camera.ipAddress = ipAddress;
        camera.name = name;
        camera.ptzEnabled = ptzEnabled;
        camera.rtspUrl = rtspUrl ?? null;
        camera.ptzUrl = ptzUrl ?? null;

        await cameraRepo.save(camera);

        res.status(200).json({ ok: true, data: camera });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.post("/operators", validate(createOperatorSchema), async (req, res) => {
    try {
        const { login, name, password } = req.body;
        const user = await UserAuth.signUp({
            login,
            name,
            password,
            role: UserRole.Operator,
        });

        res.status(201).json({
            ok: true,
            data: {
                id: user.id,
                login: user.login,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

export default router;
