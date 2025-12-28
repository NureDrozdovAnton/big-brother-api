const EMULATOR_URL = process.env.EMULATOR_BASE_URL || "http://localhost:5000";

export const sendPTZCommand = async (cameraId: string, command: string) => {
    const dx = command === "left" ? -5 : command === "right" ? 5 : 0;
    const dy = command === "up" ? 5 : command === "down" ? -5 : 0;
    const dz = command === "zoom_in" ? 0.1 : command === "zoom_out" ? -0.1 : 0;

    await fetch(`${EMULATOR_URL}/ptz`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ dx, dy, dz }),
    });
};
