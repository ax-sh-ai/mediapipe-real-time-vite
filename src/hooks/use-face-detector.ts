import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { useEffect, useState } from 'react';

export function useFaceDetector(runningMode: 'IMAGE' | 'VIDEO' = 'IMAGE') {
  const [faceDetector, setFaceDetector] = useState<FaceDetector>(null!);
  useEffect(() => {
    async function createDetector() {
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
      setFaceDetector(faceDetector);
    }

    createDetector().then(() => console.log('Face Detector Loaded'));
  }, []);
  return faceDetector;
}
