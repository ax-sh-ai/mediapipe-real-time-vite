import { ComponentRef, useLayoutEffect, useRef } from 'react';

import { ImageMediaWithSvgOverlay } from './media-with-svg-overlay.tsx';

export function ImageViewerResponsive() {
  const ref = useRef<ComponentRef<'img'>>(null);
  useLayoutEffect(() => {
    const img = ref.current;
    if(!img)return;
    console.log(img);
  }, []);
  return <ImageMediaWithSvgOverlay ref={ref} src={'./img.png'}></ImageMediaWithSvgOverlay>;
}
