import { DropzoneOptions, useDropzone } from 'react-dropzone';

import { useAppStore } from '../store.ts';

export function useMediaDropZone(onDrop: DropzoneOptions['onDrop']) {
  const mediaFilePath = useAppStore(({ mediaFilePath }) => mediaFilePath);
  return useDropzone({ onDrop, maxFiles: 1, noClick: Boolean(mediaFilePath) });
}
