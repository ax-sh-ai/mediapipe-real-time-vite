import { Detection } from '@mediapipe/tasks-vision';
import { ComponentRef, useLayoutEffect, useRef, useState } from 'react';

import { useFaceDetectorWithAutoRetry } from './use-face-detector-hook.ts';

export function useImageAnnotations() {
  const ref = useRef<ComponentRef<'img'>>(null);
  const { detector } = useFaceDetectorWithAutoRetry(
    {
      runningMode: 'IMAGE',
      delegate: 'GPU'
    },
    3,
    2000
  );

  const [detections, setDetections] = useState<Detection[]>([]);

  useLayoutEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (!detector) return;
    const { detections } = detector.detect(img);
    setDetections(detections);
  }, [detector]);
  return { ref, detections };
}
