import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { useEffect, useState } from 'react';

type RunningMode = 'IMAGE' | 'VIDEO';
async function createFaceDetector(runningMode: RunningMode) {
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
export function useFaceDetector(runningMode: RunningMode = 'IMAGE') {
  const [faceDetector, setFaceDetector] = useState<FaceDetector>(null!);
  useEffect(() => {
    async function createDetector() {
      const detector = await createFaceDetector(runningMode);
      setFaceDetector(detector);
    }

    createDetector().then(() => console.log('Face Detector Loaded'));
  }, [faceDetector, runningMode]);
  return faceDetector;
}
