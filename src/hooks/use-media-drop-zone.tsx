import { DropzoneOptions, useDropzone } from 'react-dropzone';

export function useMediaDropZone(onDrop: DropzoneOptions['onDrop']) {
  return useDropzone({ onDrop });
}
