import { FaceDetector } from '@mediapipe/tasks-vision';
import { useEffect, useState } from 'react';

import { RunningMode, createFaceDetector } from '../libs';

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
