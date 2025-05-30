import type { Meta, StoryObj } from '@storybook/react-vite';
import clsx from 'clsx';
import {
  type ComponentPropsWithRef,
  type PropsWithChildren,
  forwardRef,
  useEffect,
  useRef
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
        preserveAspectRatio='xMidYMid meet'
        viewBox='0 0 1000 1000'
      >
        {children}
      </svg>
    </section>
  );
}

const ImageSvgOverlay = forwardRef<HTMLImageElement, Omit<ComponentPropsWithRef<'img'>, 'ref'>>(
  ({ src, alt, className, children, ...props }, ref) => {
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
  }
);

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



function useImageRatio() {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    //   todo later
  }, []);
  return { ref };
}

function MediaSvgOverlayContainer() {
  const { ref } = useImageRatio();
  function calculateRatio(img: HTMLImageElement) {
    const { clientHeight, clientWidth, naturalHeight, naturalWidth } = img;
    console.log(clientHeight / naturalHeight, naturalWidth / clientWidth, 'natural');
  }
  const ratio = 0.12; // fixme make it dynamic

  return (
    <div className={'w-[500px] overflow-hidden'}>
      <ImageSvgOverlay
        ref={ref}
        src={'./img.png'}
        onLoad={(e) => calculateRatio(e.target as HTMLImageElement)}
      >
        <circle cx='500' cy='500' r='50' fill='red' stroke='white' strokeWidth='4' />
        {data.map((i, key) => {
          const { originX, originY, height, width } = i.boundingBox;
          return (
            <rect
              className={
                'stroke-yellow-300 hover:stroke-red-300 fill-transparent saturate-100 stroke-3'
              }
              x={originY * ratio}
              y={originX * ratio}
              width={width * ratio}
              height={height * ratio}
              key={key}
            />
          );
        })}
      </ImageSvgOverlay>
    </div>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof MediaSvgOverlayContainer> = {
  title: 'Mediapipe/Media Overlay',
  component: MediaSvgOverlayContainer
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {};
