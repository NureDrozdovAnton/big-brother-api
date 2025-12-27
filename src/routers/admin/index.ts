import { Router } from "express";
import db from "~/data-source";
import { Camera } from "~/entities";
import { isAdmin } from "~/guards";
import { validate } from "~/middlewares";
import { createCameraSchema, createOperatorSchema } from "./schema";
import { Logger, MediaMtx, Recorder, UserAuth } from "~/services";
import { UserRole } from "~/entities/user";
import { EventType } from "~/entities/log";

const cameraRepo = db.getRepository(Camera);
const router = Router();

router.use(isAdmin);

router.get("/logs", async (req, res) => {
    const { by, types, startDate, endDate } = req.query;

    try {
        const logs = await Logger.getLogs({
            by: typeof by === "string" ? by : undefined,
            types: Array.isArray(types)
                ? (types as string[]).map((type) => type as EventType)
                : typeof types === "string"
                  ? [types as EventType]
                  : undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
        });

        res.status(200).json({ ok: true, data: logs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.get("/cameras", async (req, res) => {
    try {
        const cameras = await cameraRepo.find();
        res.status(200).json({ ok: true, data: cameras });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.get("/cameras/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const camera = await cameraRepo.findOneBy({ id });

        if (!camera) {
            return res
                .status(404)
                .json({ ok: false, error: "Camera not found" });
        }

        if (!camera.rtspUrl) {
            return res.status(400).json({
                ok: false,
                error: "Camera has no RTSP URL configured",
            });
        }

        const online = await MediaMtx.isStreamLive(camera.cameraId);

        res.status(200).json({ ok: true, data: { online: online } });
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
            await MediaMtx.addCamera(cameraId, rtspUrl);
            Recorder.startRecording(cameraId, rtspUrl);
        }

        Logger.logAction(res.locals.user!, EventType.CameraAdded, {
            cameraId: camera.id,
            ipAddress: camera.ipAddress,
            name: camera.name,
        });

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

router.post("/cameras/:id/recordings/start", async (req, res) => {
    try {
        const { id } = req.params;
        const camera = await cameraRepo.findOneBy({ id });

        if (!camera) {
            return res
                .status(404)
                .json({ ok: false, error: "Camera not found" });
        }

        if (!camera.rtspUrl) {
            return res.status(400).json({
                ok: false,
                error: "Camera has no RTSP URL configured",
            });
        }

        if (Recorder.isRecording(camera.cameraId)) {
            return res
                .status(400)
                .json({ ok: false, error: "Recording already in progress" });
        }

        Recorder.startRecording(camera.cameraId, camera.rtspUrl);

        res.status(200).json({ ok: true, data: "Recording started" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: "Internal server error" });
    }
});

router.post("/cameras/:id/recordings/stop", async (req, res) => {
    try {
        const { id } = req.params;
        const camera = await cameraRepo.findOneBy({ id });

        if (!camera) {
            return res
                .status(404)
                .json({ ok: false, error: "Camera not found" });
        }

        if (!Recorder.isRecording(camera.cameraId)) {
            return res
                .status(400)
                .json({ ok: false, error: "No recording in progress" });
        }

        Recorder.stopRecording(camera.cameraId);

        res.status(200).json({ ok: true, data: "Recording stopped" });
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
