import { Button, FileUpload, Icon, Stack, Text } from 'move';

export default function BasicSample() {
  return (
    <FileUpload.Root maxFiles={5}>
      <FileUpload.Dropzone>
        <Stack gap="sm" align="center">
          <Icon name="upload-cloud" />
          <Text weight="medium">Drop files here</Text>
          <Text size="sm" color="muted">PNG, JPG, PDF up to 10 MB</Text>
          <FileUpload.Trigger>
            <Button variant="secondary" size="sm">Choose files</Button>
          </FileUpload.Trigger>
        </Stack>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup />
    </FileUpload.Root>
  );
}
