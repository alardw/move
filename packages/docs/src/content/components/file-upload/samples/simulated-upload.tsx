import { Button, EmptyState, FileUpload } from 'move';
import type { FileUploadAdapter } from 'move';

/**
 * The other samples stop at "files are in the list", because without an adapter
 * nothing uploads — so progress, completion and auto-removal never appear.
 *
 * An adapter is just an async function that reports progress and resolves. This
 * one uploads nothing and reports progress on a timer, which is enough to show
 * the whole lifecycle: picked → uploading → complete → removed.
 *
 * Pick a file (or drop one) and watch a row run through it. The last file is
 * made to fail so the error state is visible too.
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
        // Anything ending in .fail lands in the error state, so the sample shows
        // both outcomes rather than only the happy one.
        if (file.name.endsWith('.fail')) reject(new Error('Upload rejected by the server'));
        else resolve({ url: `https://example.com/${encodeURIComponent(file.name)}` });
      }
    }, 180);

    // An adapter must honour the signal, or a cancelled upload keeps running.
    signal.addEventListener('abort', () => {
      clearInterval(tick);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

export default function SimulatedUploadSample() {
  return (
    <FileUpload.Root adapter={simulatedUpload} autoUpload maxFiles={5}>
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
      <FileUpload.ItemGroup />
      <FileUpload.TotalProgress />
    </FileUpload.Root>
  );
}
