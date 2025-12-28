const EMULATOR_URL = process.env.EMULATOR_BASE_URL || "http://localhost:5000";

export const sendPTZCommand = async (cameraId: string, command: string) => {
    const dx = command === "left" ? -20 : command === "right" ? 20 : 0;
    const dy = command === "up" ? -20 : command === "down" ? 20 : 0;
    const dz =
        command === "zoom_in" ? 0.05 : command === "zoom_out" ? -0.05 : 0;

    await fetch(`${EMULATOR_URL}/ptz`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dx, dy, dz }),
    });
};
