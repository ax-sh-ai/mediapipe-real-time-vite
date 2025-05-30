import { ImageMediaWithSvgOverlay } from '../media-with-svg-overlay.tsx';
import { useImageAnnotations } from './use-image-annotations.ts';

export function ImageViewerResponsive() {
  const { ref, detections } = useImageAnnotations();
  console.log(detections);
  return (
    <div className={'h-dvh w-dvw overflow-hidden'}>
      <ImageMediaWithSvgOverlay ref={ref} src={'./img.png'}>
        {detections.map(({ boundingBox, keypoints }, i) => {
          if (!boundingBox) return <></>;
          const { originX, originY, height, width, angle } = boundingBox;
          console.log(angle, keypoints, 'angle');
          return (
            <rect
              key={i}
              className={'stroke-yellow-300 hover:stroke-red-300 fill-transparent saturate-100'}
              x={originX}
              y={originY}
              strokeLinecap={'round'}
              width={width}
              height={height}
            />
          );
        })}
      </ImageMediaWithSvgOverlay>
    </div>
  );
}
