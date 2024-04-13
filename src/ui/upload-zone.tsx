import { PropsWithChildren, useCallback } from 'react';

import { useMediaDropZone } from '../hooks/use-media-drop-zone.ts';

function DragStataNotify({ isDragActive }: { isDragActive: boolean }) {
  if (isDragActive) return <p>Drop the files here ...</p>;

  return <p>Drag 'n' drop some files here, or click to select files</p>;
}

export default function UploadZone({ children }: PropsWithChildren) {
  const onDrop = useCallback(
    <T extends File>(
      acceptedFiles: T[] // fileRejections: FileRejection[], event: React.DragEvent<HTMLElement>
    ) => {
      console.log(acceptedFiles);
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          console.log({ binaryStr });
        };
        reader.readAsArrayBuffer(file);
      });
    },
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useMediaDropZone(onDrop);
  return (
    <section className={'flex-1 grid place-content-center'} {...getRootProps()}>
      <input data-testid='dropzone' {...getInputProps()} />
      <DragStataNotify isDragActive={isDragActive} />
      {children}
    </section>
  );
}
