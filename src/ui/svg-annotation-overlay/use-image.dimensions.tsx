import { SyntheticEvent, useCallback, useRef, useState } from 'react';

type ImageDimensions = Pick<HTMLImageElement, 'naturalWidth' | 'naturalHeight'>;

export function useImageDimensions() {
  const ref = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState<ImageDimensions>({} as ImageDimensions);

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

  return { ref, dimensions, handleLoad, normalize };
}
