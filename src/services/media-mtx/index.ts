const MEDIA_MTX_URL = process.env.MEDIA_MTX_URL || "http://localhost:9997/v3";

export const addCamera = async (cameraId: string, rtspUrl: string) => {
    const response = await fetch(
        `${MEDIA_MTX_URL}/config/paths/add/${cameraId}`,
        {
            method: "POST",
            body: JSON.stringify({
                source: rtspUrl,
                sourceOnDemand: true,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${btoa("admin:admin")}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to add camera to Media MTX");
    }
};

export const isStreamLive = async (cameraId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${MEDIA_MTX_URL}/paths/list`, {
            headers: {
                Authorization: `Bearer ${btoa("admin:admin")}`,
            },
        });
        const data = await response.json();

        const path = data.items.find(
            (i: { name: string }) => i.name === cameraId
        );

        return path && path.ready === true;
    } catch (err) {
        return false;
    }
};
