import { Router } from "express";
import db from "~/data-source";
import { Camera } from "~/entities";
import { isOperator } from "~/guards";
import { validate } from "~/middlewares";
import { ptzPostSchema } from "./schema";

const WEBRTC_URL = process.env.WEBRTC_BASE_URL || "http://localhost:8889";

const cameraRepo = db.getRepository(Camera);
const router = Router();

router.use(isOperator);

router.get("/cameras", async (req, res) => {
    try {
        const cameras = await cameraRepo.find();

        res.status(200).json({ ok: true, data: cameras });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.get("/cameras/:id/stream", async (req, res) => {
    try {
        const { id } = req.params;

        const camera = await cameraRepo.findOneBy({ id });

        if (!camera) {
            return res
                .status(404)
                .json({ ok: false, error: "Camera not found" });
        }

        const webRTCUrl = `${WEBRTC_URL}/${camera.cameraId}`;

        res.status(200).json({ ok: true, data: { webRTCUrl } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.post("/cameras/:id/ptz", validate(ptzPostSchema), async (req, res) => {
    try {
        const { id } = req.params;
        const { command } = req.body;

        // Send PTZ command to camera
        // ...
        void id, command;

        res.status(200).json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

export default router;
