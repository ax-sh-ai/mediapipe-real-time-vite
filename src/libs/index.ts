import { Detection, FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

export type RunningMode = 'IMAGE' | 'VIDEO';
export async function createFaceDetector(runningMode: RunningMode) {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
  );
  // @see https://developers.google.com/mediapipe/solutions/vision/face_detector/web_js
  // @see https://codepen.io/mediapipe-preview/pen/OJByWQr?editors=1010
  const faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
      delegate: 'GPU'
    },
    runningMode: runningMode
  });
  return faceDetector;
}

export function makeDetectionResponsive(video: HTMLVideoElement) {
  return (i: Detection) => {
    const bb = i.boundingBox;
    const scaleX = video.clientWidth / video.videoWidth;
    const scaleY = video.clientHeight / video.videoHeight;
    if (bb) {
      bb.originX *= scaleX;
      bb.originY *= scaleY;
      bb.height *= scaleY;
      bb.width *= scaleX;
    }

    return i;
  };
}
