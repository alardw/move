import { useState } from 'react';
import { Button, EmptyState, FileUpload } from 'move';
import type { FileUploadAdapter } from 'move';

/**
 * The whole lifecycle, running: picked → uploading → complete, or failed.
 *
 * Two things this sample does that the others do not.
 *
 * It supplies an adapter. An adapter is just an async function that reports
 * progress and resolves, so this one uploads nothing and reports on a timer —
 * without one, files land in the list and nothing else ever happens. Name a
 * file `something.fail` to see the error state instead of the happy one.
 *
 * And it holds the file list itself, with `value` + `onFilesChange`. `Item`
 * takes the file it renders, so the rows are yours to map — which means the
 * list has to be somewhere you can reach.
 */
const simulatedUpload: FileUploadAdapter = ({ file, onProgress, signal }) =>
  new Promise((resolve, reject) => {
    const total = file.size || 1_000_000;
    let loaded = 0;

    const tick = setInterval(() => {
      loaded = Math.min(total, loaded + total / 12);
      onProgress({ loaded, total, percent: Math.round((loaded / total) * 100) });

      if (loaded >= total) {
        clearInterval(tick);
        if (file.name.endsWith('.fail')) reject(new Error('Upload rejected by the server'));
        else resolve({ url: `https://example.com/${encodeURIComponent(file.name)}` });
      }
    }, 180);

    // An adapter has to honour the signal, or a cancelled upload keeps running.
    signal.addEventListener('abort', () => {
      clearInterval(tick);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

export default function SimulatedUploadSample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload.Root
      adapter={simulatedUpload}
      autoUpload
      maxFiles={5}
      value={files}
      onFilesChange={setFiles}
    >
      <FileUpload.Dropzone>
        <EmptyState
          size="sm"
          icon="upload-cloud"
          title="Drop files here"
          description="Nothing leaves your machine — this one only pretends to upload"
          action={
            <FileUpload.Trigger>
              <Button variant="secondary" size="sm">
                Choose files
              </Button>
            </FileUpload.Trigger>
          }
        />
      </FileUpload.Dropzone>

      <FileUpload.ItemGroup>
        {files.map((file) => (
          <FileUpload.Item key={`${file.name}-${file.size}`} file={file}>
            <FileUpload.ItemPreview />
            <FileUpload.ItemName />
            <FileUpload.ItemSize />
            <FileUpload.ItemProgress />
            <FileUpload.ItemStatus />
            <FileUpload.ItemDelete />
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>

      {files.length > 0 && <FileUpload.TotalProgress />}
    </FileUpload.Root>
  );
}
