import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAppStore } from '../../store.ts';
import { FillScreen } from '../fill-screen.tsx';
import UploadZone from '../upload-zone.tsx';
import { ImageSvgAnnotationOverlay } from './svg-annotation-overlay.tsx';
import { useImageDimensions } from './use-image.dimensions.tsx';

const data = [
  {
    categories: [
      {
        score: 0.9285385012626648,
        index: 0,
        categoryName: '',
        displayName: ''
      }
    ],
    keypoints: [
      {
        x: 0.2999419569969177,
        y: 0.49318671226501465,
        score: 0,
        label: ''
      },
      {
        x: 0.4356914162635803,
        y: 0.48920994997024536,
        score: 0,
        label: ''
      },
      {
        x: 0.2694648504257202,
        y: 0.5545698404312134,
        score: 0,
        label: ''
      },
      {
        x: 0.3091668486595154,
        y: 0.6478142738342285,
        score: 0,
        label: ''
      },
      {
        x: 0.3630484640598297,
        y: 0.556501567363739,
        score: 0,
        label: ''
      },
      {
        x: 0.6983460187911987,
        y: 0.5614662766456604,
        score: 0,
        label: ''
      }
    ],
    boundingBox: {
      originX: 752,
      originY: 1547,
      width: 1422,
      height: 1422,
      angle: 0
    }
  }
];

function MediaSvgOverlayContainer() {
  const { ref, dimensions, handleLoad, normalize } = useImageDimensions();
  const dotRadius = 30;
  return (
    <div className={'w-[500px] overflow-hidden'}>
      <ImageSvgAnnotationOverlay ref={ref} src={'./img_1.png'} onLoad={handleLoad}>
        {/* Render bounding boxes using normalized coordinates */}
        {dimensions &&
          data.map((item, key) => {
            const { originX, originY, height, width } = item.boundingBox;
            return (
              <rect
                className='stroke-yellow-300 hover:stroke-red-300 fill-transparent pointer-events-auto'
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

function MediaSvgOverlayDroppedFileContainer() {
  const { ref, dimensions, handleLoad, normalize, detections } = useImageDimensions();
  const mediaFilePath = useAppStore(({ mediaFilePath }) => mediaFilePath);
  const url = URL.createObjectURL(mediaFilePath);

  return (
    <div className={'w-[500px] overflow-hidden'}>
      <ImageSvgAnnotationOverlay ref={ref} src={url} onLoad={handleLoad}>
        {dimensions &&
          detections &&
          detections.map((item, key) => {
            const { originX, originY, height, width } = item.boundingBox!;
            return (
              <rect
                className='stroke-yellow-300 hover:stroke-red-300 fill-transparent pointer-events-auto'
                x={normalize(originX, dimensions.naturalWidth)}
                y={normalize(originY, dimensions.naturalHeight)}
                width={normalize(width, dimensions.naturalWidth)}
                height={normalize(height, dimensions.naturalHeight)}
                strokeWidth={0.005}
                key={key}
              />
            );
          })}
      </ImageSvgAnnotationOverlay>
    </div>
  );
}

export const WithKeypoints: Story = {
  render: () => (
    <FillScreen className={'flex'}>
      <UploadZone>
        <MediaSvgOverlayDroppedFileContainer />
      </UploadZone>
    </FillScreen>
  )
};
