import cv2
import subprocess
import numpy as np
from flask import Flask, request, jsonify
import threading
import time

app = Flask(__name__)

RTSP_URL = "rtsp://mediamtx:8554/demo_stream"
PANORAMA_PATH = "image.jpg"
BASE_WIDTH, BASE_HEIGHT = 1920, 1080

state = {
    "x": 500,
    "y": 300,
    "zoom": 1.0,
    "max_w": 0,
    "max_h": 0
}

img = cv2.imread(PANORAMA_PATH)
if img is None:
    img = np.zeros((2000, 4000, 3), np.uint8)
    cv2.putText(img, "ROOM 360", (1500, 1000), cv2.FONT_HERSHEY_SIMPLEX, 5, (255, 255, 255), 10)

state["max_h"], state["max_w"], _ = img.shape

@app.route('/ptz', methods=['POST'])
def ptz_control():
    data = request.json
    
    dx = int(data.get('dx', 0))
    dy = int(data.get('dy', 0))
    dz = float(data.get('dz', 0))

    state["zoom"] = max(0.01, min(state["zoom"] + dz, 2.0))

    current_w = int(BASE_WIDTH / state["zoom"])
    current_h = int(BASE_HEIGHT / state["zoom"])

    state["x"] = max(0, min(state["x"] + dx, state["max_w"] - current_w))
    state["y"] = max(0, min(state["y"] + dy, state["max_h"] - current_h))
    
    return jsonify({
        "status": "ok", 
        "position": {"x": state["x"], "y": state["y"], "zoom": round(state["zoom"], 2)}
    })

def stream_video():
    command = [
        'ffmpeg',
        '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-pix_fmt', 'bgr24',
        '-s', f'{BASE_WIDTH}x{BASE_HEIGHT}',
        '-r', '25',
        '-i', '-',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-f', 'rtsp',
        '-rtsp_transport', 'tcp',
        RTSP_URL
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)

    try:
        while True:
            cur_w = int(BASE_WIDTH / state["zoom"])
            cur_h = int(BASE_HEIGHT / state["zoom"])
            
            crop = img[state["y"]:state["y"]+cur_h, state["x"]:state["x"]+cur_w]
            
            frame = cv2.resize(crop, (BASE_WIDTH, BASE_HEIGHT), interpolation=cv2.INTER_LINEAR)
            
            process.stdin.write(frame.tobytes())
            time.sleep(0.04)
    except Exception as e:
        print(f"Streaming error: {e}")
    finally:
        process.stdin.close()

if __name__ == '__main__':
    threading.Thread(target=stream_video, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)