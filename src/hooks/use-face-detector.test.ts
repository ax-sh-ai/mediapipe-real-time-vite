import { FaceDetector } from '@mediapipe/tasks-vision';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { createFaceDetector } from '../libs';
import { useFaceDetector } from './use-face-detector';

vi.mock('../libs', () => ({
  createFaceDetector: vi.fn()
}));

describe('Renders main page correctly', async () => {
  it('should initialize faceDetector to null', () => {
    const { result } = renderHook(() => useFaceDetector());
    expect(result.current).toBeNull();
  });

  it('should create a FaceDetector instance', async () => {
    const mockDetector = { detect: vi.fn() } as unknown as FaceDetector;
    vi.mocked(createFaceDetector).mockResolvedValue(mockDetector);

    const { result } = renderHook(() => useFaceDetector());

    await waitFor(() => result.current !== null);
    expect(result.current).toBe(mockDetector);
    expect(createFaceDetector).toHaveBeenCalledWith('IMAGE');
  });
});
