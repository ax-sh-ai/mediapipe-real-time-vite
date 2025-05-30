import { Detection, FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { useCallback, useEffect, useRef, useState } from 'react';

export type RunningMode = 'IMAGE' | 'VIDEO';

export interface FaceDetectorConfig {
  runningMode: RunningMode;
  modelAssetPath?: string;
  delegate?: 'CPU' | 'GPU';
  wasmPath?: string;
}

export interface FaceDetectorState {
  detector: FaceDetector | null;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
}

export interface FaceDetectorHook extends FaceDetectorState {
  detect: (
    image: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  ) => Promise<Detection[]>;
  reinitialize: (newConfig?: Partial<FaceDetectorConfig>) => Promise<void>;
  cleanup: () => void;
}

const DEFAULT_CONFIG: Required<FaceDetectorConfig> = {
  runningMode: 'IMAGE',
  modelAssetPath:
    'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
  delegate: 'GPU',
  wasmPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
};

export function useFaceDetectorHook(initialConfig: FaceDetectorConfig): FaceDetectorHook {
  const [state, setState] = useState<FaceDetectorState>({
    detector: null,
    isLoading: false,
    error: null,
    isInitialized: false
  });

  // Use refs to maintain stable references
  const configRef = useRef<Required<FaceDetectorConfig>>({
    ...DEFAULT_CONFIG,
    ...initialConfig
  });
  const detectorRef = useRef<FaceDetector | null>(null);
  const initializationPromiseRef = useRef<Promise<void> | null>(null);
  const mountedRef = useRef(true);

  const updateState = useCallback((updates: Partial<FaceDetectorState>) => {
    if (mountedRef.current) {
      setState((prev) => ({ ...prev, ...updates }));
    }
  }, []);

  const cleanup = useCallback(() => {
    if (detectorRef.current) {
      try {
        detectorRef.current.close();
      } catch (error) {
        console.warn('Error during FaceDetector cleanup:', error);
      }
      detectorRef.current = null;
    }
    updateState({
      detector: null,
      isInitialized: false,
      error: null
    });
  }, [updateState]);

  const createDetector = useCallback(
    async (config: Required<FaceDetectorConfig>): Promise<FaceDetector> => {
      try {
        const vision = await FilesetResolver.forVisionTasks(config.wasmPath);

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: config.modelAssetPath,
            delegate: config.delegate
          },
          runningMode: config.runningMode
        });

        return detector;
      } catch (error) {
        throw new Error(
          `Failed to create FaceDetector: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
    []
  );

  const initialize = useCallback(
    async (config: Required<FaceDetectorConfig>) => {
      // Prevent multiple simultaneous initializations
      if (initializationPromiseRef.current) {
        return initializationPromiseRef.current;
      }

      const initPromise = (async () => {
        try {
          updateState({ isLoading: true, error: null });

          // Clean up existing detector
          cleanup();

          const detector = await createDetector(config);

          if (mountedRef.current) {
            detectorRef.current = detector;
            updateState({
              detector,
              isLoading: false,
              isInitialized: true,
              error: null
            });
          } else {
            // Component was unmounted during initialization
            detector.close();
          }
        } catch (error) {
          const errorObj =
            error instanceof Error ? error : new Error('Unknown initialization error');
          updateState({
            isLoading: false,
            error: errorObj,
            isInitialized: false
          });
          throw errorObj;
        } finally {
          initializationPromiseRef.current = null;
        }
      })();

      initializationPromiseRef.current = initPromise;
      return initPromise;
    },
    [createDetector, cleanup, updateState]
  );

  const reinitialize = useCallback(
    async (newConfig?: Partial<FaceDetectorConfig>) => {
      const updatedConfig = {
        ...configRef.current,
        ...newConfig
      };
      configRef.current = updatedConfig;
      await initialize(updatedConfig);
    },
    [initialize]
  );

  const detect = useCallback(
    async (
      image: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
    ): Promise<Detection[]> => {
      if (!detectorRef.current) {
        throw new Error('FaceDetector is not initialized. Call reinitialize() first.');
      }

      if (!mountedRef.current) {
        throw new Error('Component is unmounted');
      }

      try {
        const result = detectorRef.current.detect(image);
        return result.detections || [];
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Detection failed';
        const detectionError = new Error(`Face detection failed: ${errorMessage}`);
        updateState({ error: detectionError });
        throw detectionError;
      }
    },
    [updateState]
  );

  // Initialize on mount and config changes
  useEffect(() => {
    const currentConfig = {
      ...DEFAULT_CONFIG,
      ...initialConfig
    };
    configRef.current = currentConfig;

    initialize(currentConfig).catch((error) => {
      console.error('Failed to initialize FaceDetector:', error);
    });
  }, [
    initialize,
    initialConfig.runningMode,
    initialConfig.modelAssetPath,
    initialConfig.delegate,
    initialConfig.wasmPath
  ]);

  // Cleanup on unmounting
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    detector: state.detector,
    isLoading: state.isLoading,
    error: state.error,
    isInitialized: state.isInitialized,
    detect,
    reinitialize,
    cleanup
  };
}
//
// Utility hook for common use cases
export function useFaceDetectorWithAutoRetry(
  config: FaceDetectorConfig,
  maxRetries: number = 3,
  retryDelay: number = 1000
): FaceDetectorHook & { retryCount: number } {
  const hook = useFaceDetectorHook(config);
  const [retryCount, setRetryCount] = useState(0);
  const retryTimeoutRef = useRef<number>(null);

  useEffect(() => {
    if (hook.error && retryCount < maxRetries) {
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        hook.reinitialize().catch(() => {
          // The main hook manages error handling
        });
      }, retryDelay);
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [hook.error, hook.reinitialize, retryCount, maxRetries, retryDelay, hook]);

  // Reset retry count on successful initialization
  useEffect(() => {
    if (hook.isInitialized && !hook.error) {
      setRetryCount(0);
    }
  }, [hook.isInitialized, hook.error]);

  return {
    ...hook,
    retryCount
  };
}

//// Basic usage
// const { detector, isLoading, error, detect } = useFaceDetector({
//   runningMode: 'IMAGE'
// });
//
// // With auto-retry for production
// const { detector, retryCount } = useFaceDetectorWithAutoRetry({
//   runningMode: 'VIDEO',
//   delegate: 'CPU'
// }, 3, 2000);
//
// // Runtime reconfiguration
// const { reinitialize } = useFaceDetector({ runningMode: 'IMAGE' });
// await reinitialize({ runningMode: 'VIDEO' });
