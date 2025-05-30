import { FaceDetection } from '@mediapipe/face_detection';
import { useEffect, useRef, useState } from 'react';

// Singleton instance
let mediaPipeInstance: FaceDetection | null = null;

export const useMediaPipe = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  // Initialize singleton
  useEffect(() => {
    if (!mediaPipeInstance) {
      mediaPipeInstance = new FaceDetection({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`
      });

      mediaPipeInstance.setOptions({
        model: 'short',
        minDetectionConfidence: 0.5
      });

      mediaPipeInstance.onResults((results) => {
        setResults(results);
        if (canvasRef.current) {
          drawResults(canvasRef.current, results);
        }
      });
    }

    const initialize = async () => {
      try {
        await mediaPipeInstance!.initialize();
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize MediaPipe');
        setLoading(false);
      }
    };

    initialize();

    return () => {
      // Cleanup on component unmount
      if (mediaPipeInstance) {
        mediaPipeInstance.close();
        mediaPipeInstance = null;
      }
    };
  }, []);

  // Process video frames
  const processVideo = async (file: File) => {
    if (!videoRef.current || !mediaPipeInstance) return;

    try {
      const url = URL.createObjectURL(file);
      videoRef.current.src = url;

      videoRef.current.onloadeddata = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        // Set canvas dimensions
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        // Process each frame
        const processFrame = async () => {
          if (videoRef.current && videoRef.current.paused) return;

          await mediaPipeInstance!.send({ image: videoRef.current });
          requestAnimationFrame(processFrame);
        };

        await videoRef.current.play();
        processFrame();
      };
    } catch (err) {
      setError('Error processing video');
    }
  };

  // Draw results helper
  const drawResults = (
    canvas: HTMLCanvasElement,

    // @ts-ignore
    // @ts-expect-error fooo
    results: any
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // Draw detected faces
    if (results.detections) {
      results.detections.forEach((detection: any) => {
        drawBox(ctx, detection.boundingBox);
      });
    }
  };

  const drawBox = (
    ctx: CanvasRenderingContext2D,
    box: { xMin: number; xMax: number; yMin: number; yMax: number }
  ) => {
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      box.xMin * ctx.canvas.width,
      box.yMin * ctx.canvas.height,
      (box.xMax - box.xMin) * ctx.canvas.width,
      (box.yMax - box.yMin) * ctx.canvas.height
    );
  };

  return {
    videoRef,
    canvasRef,
    processVideo,
    loading,
    error,
    results
  };
};
