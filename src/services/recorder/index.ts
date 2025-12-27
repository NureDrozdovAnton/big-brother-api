import { spawn } from "child_process";
import path from "path";

const PROCESSES: { [cameraId: string]: ReturnType<typeof spawn> } = {};

const getRtspUrl = (rtspHttpUrl: string) => {
    if (rtspHttpUrl.startsWith("rtsp://")) {
        return rtspHttpUrl;
    }

    const url = new URL(rtspHttpUrl);
    const rtspUrl = `rtsp://${url.hostname}${url.port ? `:${url.port}` : ""}${
        url.pathname
    }`;

    return rtspUrl;
};

const getRecordingsDir = () => {
    const rootPath = process.cwd() || ".";

    return path.join(rootPath, "_archive");
};

export const startRecording = (cameraId: string, rtspHttpUrl: string) => {
    if (PROCESSES[cameraId]) {
        throw new Error("Recording already in progress for this camera");
    }

    const fileName = `${cameraId}_${Date.now()}.mkv`;
    const filePath = path.join(getRecordingsDir(), fileName);

    const ffmpeg = spawn("ffmpeg", [
        "-rtsp_transport",
        "tcp",
        "-i",
        getRtspUrl(rtspHttpUrl),
        "-c",
        "copy",
        "-map",
        "0",
        "-f",
        "matroska",
        filePath,
    ]);

    ffmpeg.on("close", (code) => {
        console.log(`Recording finished with code ${code}`);
    });

    PROCESSES[cameraId] = ffmpeg;

    return ffmpeg;
};

export const stopRecording = (cameraId: string) => {
    const process = PROCESSES[cameraId];

    if (process) {
        process.kill("SIGINT");
        delete PROCESSES[cameraId];
    }
};

export const stopAllRecordings = () => {
    for (const cameraId in PROCESSES) {
        stopRecording(cameraId);
    }
};

export const isRecording = (cameraId: string) => {
    return PROCESSES.hasOwnProperty(cameraId);
};
