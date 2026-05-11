import { Button, FileUpload, Icon, Stack, Text } from 'move';

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
        <Stack gap="sm" align="center">
          <Icon name="image" />
          <Text weight="medium">Images only · 5 MB each · up to 3</Text>
          <FileUpload.Trigger asChild>
            <Button variant="secondary" size="sm">Browse</Button>
          </FileUpload.Trigger>
        </Stack>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup />
    </FileUpload.Root>
  );
}
