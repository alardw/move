import { Button, EmptyState, FileUpload } from 'move';

/**
 * The dropzone's resting content is an empty state — nothing here yet, and here
 * is how to put something here — so it uses the component rather than
 * reassembling the same icon/title/description/action column by hand.
 */
export default function BasicSample() {
  return (
    <FileUpload.Root maxFiles={5}>
      <FileUpload.Dropzone>
        <EmptyState
          size="sm"
          icon="upload-cloud"
          title="Drop files here"
          description="PNG, JPG, PDF up to 10 MB"
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
    </FileUpload.Root>
  );
}
