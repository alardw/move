import { useState } from 'react';
import { Alert, Button, EmptyState, FileUpload, Text } from 'move';
import type { FileRejection, FileUploadAdapter } from 'move';

/**
 * `removeOnComplete` takes the row away once the upload finishes — `true` waits
 * 2s, a number waits that many milliseconds. Useful where the list is a queue
 * rather than a record: what matters is what is still going, not what is done.
 *
 * Pick a file and the row uploads, says Done, then leaves.
 *
 * One thing to know before reaching for it: the wait is not adjustable by the
 * READER. It does not pause on hover or focus the way Toast's does, and there
 * is no way to hold it open — so on a long file list, or for anyone who reads
 * slowly, the confirmation can be gone before it is read. Leave it off where
 * the list is the record of what happened.
 */
const simulatedUpload: FileUploadAdapter = ({ file, onProgress, signal }) =>
  new Promise((resolve, reject) => {
    const total = file.size || 1_000_000;
    let loaded = 0;
    const tick = setInterval(() => {
      loaded = Math.min(total, loaded + total / 10);
      onProgress({ loaded, total, percent: Math.round((loaded / total) * 100) });
      if (loaded >= total) {
        clearInterval(tick);
        resolve({ url: `https://example.com/${encodeURIComponent(file.name)}` });
      }
    }, 150);
    signal.addEventListener('abort', () => {
      clearInterval(tick);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

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

export default function AutoDismissSample() {
  const [files, setFiles] = useState<File[]>([]);
  // Without this a file over the limit vanishes with no explanation.
  const [rejected, setRejected] = useState<string | null>(null);

  return (
    <FileUpload.Root
      adapter={simulatedUpload}
      autoUpload
      removeOnComplete={2000}
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
          description="Each row leaves two seconds after it finishes"
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
        <FileUpload.ClearTrigger>
          <Button variant="ghost" size="sm">
            Clear all
          </Button>
        </FileUpload.ClearTrigger>
      )}

      {files.length === 0 && (
        <Text size="sm" color="muted">
          Nothing queued — finished uploads have removed themselves.
        </Text>
      )}
    </FileUpload.Root>
  );
}
