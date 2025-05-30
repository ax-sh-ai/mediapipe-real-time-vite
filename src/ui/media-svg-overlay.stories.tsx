import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import {
  type ComponentPropsWithRef,
  type PropsWithChildren,
  forwardRef,
  useEffect,
  useRef,
  useState, useCallback
} from 'react';

function MediaSvgOverlay({
  media,
  children
}: PropsWithChildren<{ media: PropsWithChildren['children'] }>) {
  return (
    <section className='relative block w-full'>
      <div className='w-full'>{media}</div>
      <svg
        className='absolute inset-0 w-full h-full pointer-events-none'
        preserveAspectRatio='none'
        viewBox='0 0 1 1'
      >
        {children}
      </svg>
    </section>
  );
}

const ImageSvgOverlay = forwardRef<
  HTMLImageElement,
  PropsWithChildren<Omit<ComponentPropsWithRef<'img'>, 'ref'>>
>(({ src, alt, className, children, ...props }, ref) => {
  return (
    <MediaSvgOverlay
      media={
        <img
          ref={ref}
          alt={alt}
          src={src}
          className={clsx('ImageMediaWithSvgOverlay w-full h-auto block', className)}
          {...props}
        />
      }
    >
      {children}
    </MediaSvgOverlay>
  );
});

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

function useImageDimensions() {
  const ref = useRef<HTMLImageElement>(null);
  const [dimensions, setDimensions] = useState<{
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);

  const handleLoad = useCallback(() => {
    const img = ref.current;
    if (!img) return;

    setDimensions({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    });
  },[]);

  return { ref, dimensions, handleLoad };
}

function MediaSvgOverlayContainer() {
  const { ref, dimensions, handleLoad } = useImageDimensions();

  // Convert pixel coordinates to normalized (0-1) coordinates
  const normalize = (pixelValue: number, dimension: number) => {
    return pixelValue / dimension;
  };

  return (
    <div className={'w-[500px] overflow-hidden'}>
      <ImageSvgOverlay ref={ref} src={'./img.png'} onLoad={handleLoad}>
        {/*/!* Test circle at center *!/*/}
        {/*<circle*/}
        {/*  cx={0.5}*/}
        {/*  cy={0.5}*/}
        {/*  r={0.02}*/}
        {/*  fill='red'*/}
        {/*  stroke='white'*/}
        {/*  strokeWidth={0.002}*/}
        {/*/>*/}

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
        {data.map((item, itemKey) =>
          item.keypoints.map((point, pointKey) => (
            <circle
              key={`${itemKey}-${pointKey}`}
              cx={point.x}
              cy={point.y}
              r={0.01}
              fill='blue'
              stroke='white'
              strokeWidth={0.001}
            />
          ))
        )}
      </ImageSvgOverlay>
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
