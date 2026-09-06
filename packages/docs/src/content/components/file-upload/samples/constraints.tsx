import { Button, EmptyState, FileUpload } from 'move';

/**
 * `accept`, `maxSize`, and `maxFiles` are validated client-side before
 * a file enters the list. Rejected files surface through the
 * `onReject` callback (omitted here) — wire it to a Toast or inline
 * error in your real app.
 */
export default function ConstraintsSample() {
  return (
    <FileUpload.Root accept="image/*" maxSize={5 * 1024 * 1024} maxFiles={3}>
      <FileUpload.Dropzone>
        <EmptyState
          size="sm"
          icon="image"
          title="Images only"
          description="5 MB each, up to 3 files"
          action={
            <FileUpload.Trigger>
              <Button variant="secondary" size="sm">Browse</Button>
            </FileUpload.Trigger>
          }
        />
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup />
    </FileUpload.Root>
  );
}
