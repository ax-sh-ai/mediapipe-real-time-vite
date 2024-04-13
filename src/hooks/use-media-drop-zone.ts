import { DropzoneOptions, useDropzone } from 'react-dropzone';

export function useMediaDropZone(onDrop: DropzoneOptions['onDrop']) {
  return useDropzone({ onDrop, maxFiles: 1, preventDropOnDocument: true });
}
