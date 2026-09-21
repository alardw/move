import { useMemo, useState } from 'react';
import { Alert, Button, EmptyState, FileUpload } from 'move';
import type { FileRejection, FileUploadAdapter } from 'move';

/**
 * The whole lifecycle, running: picked → uploading → complete, or failed.
 *
 * Three things this sample does that the others do not.
 *
 * It supplies an adapter — just an async function that reports progress and
 * resolves. Without one, files land in the list and nothing else happens. Name a
 * file `something.fail` to see the error state instead of the happy one.
 *
 * It holds the file list itself, with `value` + `onFilesChange`, because `Item`
 * takes the file it renders and the rows are yours to map.
 *
 * And it counts what is still uploading, so "Clear all" can say what it will
 * actually do. `ClearTrigger` aborts in-flight transfers BEFORE it clears, which
 * mid-upload is destructive in a way that label does not admit.
 */
const makeAdapter = (onStart: () => void, onEnd: () => void): FileUploadAdapter => {
  return ({ file, onProgress, signal }) =>
    new Promise((resolve, reject) => {
      onStart();
      const total = file.size || 1_000_000;
      let loaded = 0;

      const finish = (fn: () => void) => {
        onEnd();
        fn();
      };

      const tick = setInterval(() => {
        loaded = Math.min(total, loaded + total / 12);
        onProgress({ loaded, total, percent: Math.round((loaded / total) * 100) });

        if (loaded >= total) {
          clearInterval(tick);
          if (file.name.endsWith('.fail')) {
            finish(() => reject(new Error('Upload rejected by the server')));
          } else {
            finish(() => resolve({ url: `https://example.com/${encodeURIComponent(file.name)}` }));
          }
        }
      }, 180);

      // An adapter has to honour the signal, or a cancelled upload keeps running.
      signal.addEventListener('abort', () => {
        clearInterval(tick);
        finish(() => reject(new DOMException('Aborted', 'AbortError')));
      });
    });
};

/**
 * What to say when files are turned away.
 *
 * Naming them only works for one. A drop of a hundred that breaks a rule would
 * otherwise print a hundred filenames, which is a wall rather than an answer —
 * so past the first it becomes a count, and the reason survives while the
 * rejections agree on one.
 */
function describeRejections(rejections: FileRejection[]): string {
  const reasons = new Set(rejections.map((r) => r.errors[0]?.message).filter(Boolean));
  const reason = reasons.size === 1 ? ` — ${[...reasons][0]}` : '';

  if (rejections.length === 1) {
    return `${rejections[0].file.name} wasn't added${reason}`;
  }
  return `${rejections.length} files weren't added${reason}`;
}

export default function SimulatedUploadSample() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<string | null>(null);
  const [running, setRunning] = useState(0);

  const adapter = useMemo(
    () =>
      makeAdapter(
        () => setRunning((n) => n + 1),
        () => setRunning((n) => Math.max(0, n - 1)),
      ),
    [],
  );

  return (
    <FileUpload.Root
      adapter={adapter}
      autoUpload
      maxFiles={10}
      value={files}
      onFilesChange={setFiles}
      onFileReject={(rejections) => setRejected(describeRejections(rejections))}
    >
      {rejected && (
        <Alert variant="warning" size="sm" onClose={() => setRejected(null)}>
          {rejected}
        </Alert>
      )}

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

      {files.length > 0 && (
        <>
          <FileUpload.TotalProgress />
          <FileUpload.ClearTrigger>
            <Button variant="ghost" size="sm">
              {running > 0 ? `Cancel ${running} and clear all` : 'Clear all'}
            </Button>
          </FileUpload.ClearTrigger>
        </>
      )}
    </FileUpload.Root>
  );
}
