import type { Meta, StoryObj } from '@storybook/react-vite';

import { ImageSvgAnnotationOverlay } from './svg-annotation-overlay.tsx';
import { useImageDimensions } from './use-image.dimensions.tsx';

const data = [
  {
    categories: [
      {
        score: 0.8682692646980286,
        index: 0,
        categoryName: '',
        displayName: ''
      }
    ],
    keypoints: [
      {
        x: 0.54115229845047,
        y: 0.40340495109558105,
        score: 0,
        label: ''
      },
      {
        x: 0.6804829835891724,
        y: 0.4473888874053955,
        score: 0,
        label: ''
      },
      {
        x: 0.6064131855964661,
        y: 0.5755531787872314,
        score: 0,
        label: ''
      },
      {
        x: 0.5881839990615845,
        y: 0.6672369241714478,
        score: 0,
        label: ''
      },
      {
        x: 0.4398498833179474,
        y: 0.39385879039764404,
        score: 0,
        label: ''
      },
      {
        x: 0.7320264577865601,
        y: 0.47962355613708496,
        score: 0,
        label: ''
      }
    ],
    boundingBox: {
      originX: 1715,
      originY: 712,
      width: 1459,
      height: 1458,
      angle: 0
    }
  }
];

function MediaSvgOverlayContainer() {
  const { ref, dimensions, handleLoad, normalize } = useImageDimensions();
  const dotRadius = 30;
  return (
    <div className={'w-[500px] overflow-hidden'}>
      <ImageSvgAnnotationOverlay ref={ref} src={'./img.png'} onLoad={handleLoad}>
        {/* Render bounding boxes using normalized coordinates */}
        {dimensions &&
          data.map((item, key) => {
            const { originX, originY, height, width } = item.boundingBox;
            return (
              <rect
                className='stroke-yellow-300 hover:stroke-red-300 fill-transparent'
                x={normalize(originX, dimensions.naturalWidth)}
                y={normalize(originY, dimensions.naturalHeight)}
                width={normalize(width, dimensions.naturalWidth)}
                height={normalize(height, dimensions.naturalHeight)}
                strokeWidth={0.005}
                key={key}
              />
            );
          })}

        {/* Render keypoints (already normalized 0-1) */}
        {dimensions &&
          data.map((item, itemKey) =>
            item.keypoints.map((point, pointKey) => (
              <ellipse
                key={`${itemKey}-${pointKey}`}
                cx={point.x}
                cy={point.y}
                rx={normalize(dotRadius, dimensions.naturalWidth)}
                ry={normalize(dotRadius, dimensions.naturalHeight)}
                fill='blue'
                stroke='white'
                strokeWidth={0.001}
              />
            ))
          )}
      </ImageSvgAnnotationOverlay>
    </div>
  );
}

const meta: Meta<typeof MediaSvgOverlayContainer> = {
  title: 'Mediapipe/Media Overlay',
  component: MediaSvgOverlayContainer
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
