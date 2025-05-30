import { Detection } from '@mediapipe/tasks-vision';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';

import { useFaceDetectorWithAutoRetry } from '../image-annotation/use-face-detector-hook.ts';

export type ImageDimensions = Pick<HTMLImageElement, 'naturalWidth' | 'naturalHeight'>;

export function useImageDimensions() {
  const ref = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions>({} as ImageDimensions);
  const [detections, setDetections] = useState<Detection[]>([]);
  const { detector } = useFaceDetectorWithAutoRetry({
    runningMode: 'IMAGE',
    delegate: 'GPU'
  });

  // Convert pixel coordinates to normalized (0-1) coordinates
  const normalize = useCallback((pixelValue: number, dimension: number) => {
    return pixelValue / dimension;
  }, []);

  const handleLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;

    setDimensions({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
  }, []);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (!detector) return;
    const { detections } = detector.detect(img);
    setDetections(detections);
  }, [detector]);

  return { ref, dimensions, handleLoad, normalize, detections };
}
