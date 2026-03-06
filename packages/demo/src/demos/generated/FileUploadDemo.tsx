// Generated from FileUpload.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import React from 'react';
import { FileUpload, Button } from 'move';
import type { DemoDefinition } from '../types';

export const demo: DemoDefinition = {
  id: 'form:FileUpload',
  name: 'FileUpload',
  category: 'form',
  description: 'Compound file upload component with drag-and-drop dropzone, file list management, progress tracking, and pluggable upload adapter system.',
  controls: [
    { name: 'variant', kind: 'select', options: ['default', 'compact'], defaultValue: 'default' },
    { name: 'size', kind: 'select', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
    { name: 'multiple', kind: 'boolean', defaultValue: true },
    { name: 'disabled', kind: 'boolean', defaultValue: false },
    { name: 'maxFiles', kind: 'number', defaultValue: 5 },
  ],
  initialProps: {
    variant: 'default',
    size: 'md',
    multiple: true,
    disabled: false,
    maxFiles: 5,
  },
  sections: [
    {
      id: 'consumer',
      label: 'Usage',
      render: () => (
        <FileUpload.Root accept="image/*,.pdf">
          <FileUpload.Dropzone>
            <p>Drag & drop files here, or click to browse</p>
            <FileUpload.Trigger>
              <Button variant="outlined" size="sm">Browse Files</Button>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            {/* Items render dynamically from file state */}
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      ),
      code: `<FileUpload.Root accept="image/*,.pdf">
  <FileUpload.Dropzone>
    <p>Drag & drop files here, or click to browse</p>
    <FileUpload.Trigger>
      <Button variant="outlined" size="sm">Browse Files</Button>
    </FileUpload.Trigger>
  </FileUpload.Dropzone>
  <FileUpload.ItemGroup>
    {files.map(file => (
      <FileUpload.Item key={file.name} file={file}>
        <FileUpload.ItemPreview />
        <FileUpload.ItemName />
        <FileUpload.ItemSize />
        <FileUpload.ItemDelete />
      </FileUpload.Item>
    ))}
  </FileUpload.ItemGroup>
</FileUpload.Root>`,
    },
    {
      id: 'playground',
      label: 'Playground',
      render: (props) => (
        <FileUpload.Root
          variant={props.variant as 'default' | 'compact'}
          size={props.size as 'sm' | 'md' | 'lg'}
          multiple={props.multiple as boolean}
          disabled={props.disabled as boolean}
          maxFiles={props.maxFiles as number}
        >
          <FileUpload.Dropzone>
            <p>Drop files here or click to browse</p>
            <FileUpload.Trigger>
              <Button variant="outlined" size="sm">Browse</Button>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      ),
      code: (props) => `<FileUpload.Root
  variant="${props.variant}"
  size="${props.size}"${props.disabled ? '\n  disabled' : ''}
  multiple={${props.multiple}}
  maxFiles={${props.maxFiles}}
>
  <FileUpload.Dropzone>
    <p>Drop files here or click to browse</p>
    <FileUpload.Trigger>
      <Button variant="outlined" size="sm">Browse</Button>
    </FileUpload.Trigger>
  </FileUpload.Dropzone>
</FileUpload.Root>`,
    },
  ],
  render: (props) => (
    <FileUpload.Root
      variant={props.variant as 'default' | 'compact'}
      size={props.size as 'sm' | 'md' | 'lg'}
      multiple={props.multiple as boolean}
      disabled={props.disabled as boolean}
      maxFiles={props.maxFiles as number}
    >
      <FileUpload.Dropzone>
        <p>Drop files here or click to browse</p>
        <FileUpload.Trigger>
          <Button variant="outlined" size="sm">Browse</Button>
        </FileUpload.Trigger>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  ),
};
