import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FileUpload } from './FileUpload';
import { Button } from '../../core/Button/Button';
import { Icon } from '../../core/Icon/Icon';

const meta: Meta = {
  title: 'Form/FileUpload',
  component: FileUpload.Root,
  args: {
    onFilesChange: fn(),
    onFileReject: fn(),
    onUploadComplete: fn(),
    onUploadError: fn(),
    onAllComplete: fn(),
  },
  argTypes: {
    accept: {
      control: 'text',
      description: 'Accepted file types (MIME types or extensions).',
    },
    maxSize: {
      control: 'number',
      description: 'Maximum file size in bytes.',
    },
    maxFiles: {
      control: 'number',
      description: 'Maximum number of files.',
    },
    multiple: {
      control: 'boolean',
      table: { defaultValue: { summary: 'true' } },
      description: 'Allow multiple file selection.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the upload.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { defaultValue: { summary: 'md' } },
      description: 'Size of the upload area.',
    },
    variant: {
      control: 'select',
      options: ['default', 'compact'],
      table: { defaultValue: { summary: 'default' } },
      description: 'Visual style of the dropzone.',
    },
    autoUpload: {
      control: 'boolean',
      description: 'Start uploading files immediately when selected.',
    },
    concurrency: {
      control: 'number',
      description: 'Maximum number of simultaneous uploads.',
    },
    removeOnComplete: {
      control: 'number',
      description: 'Auto-remove files after upload completes. true = 2s delay, number = custom delay in ms.',
    },
    onFilesChange: {
      action: 'onFilesChange',
    },
    onFileReject: {
      action: 'onFileReject',
    },
    onUploadComplete: {
      action: 'onUploadComplete',
    },
    onUploadError: {
      action: 'onUploadError',
    },
    onAllComplete: {
      action: 'onAllComplete',
    },
  },
  render: (args) => {
    const FileUploadStory = () => {
      const [files, setFiles] = useState<File[]>([]);
      return (
        <FileUpload.Root
          {...args}
          value={files}
          onFilesChange={(newFiles) => {
            setFiles(newFiles);
            (args.onFilesChange as (files: File[]) => void)?.(newFiles);
          }}
        >
          <FileUpload.Dropzone>
            <Icon name="upload" size="lg" />
            <span>Drag & drop files here</span>
            <FileUpload.Trigger>
              <Button variant="secondary" size="sm">Choose Files</Button>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
          {files.length > 0 && (
            <>
              <FileUpload.ItemGroup>
                {files.map((file, i) => (
                  <FileUpload.Item key={`${file.name}-${i}`} file={file}>
                    <FileUpload.ItemPreview />
                    <FileUpload.ItemName />
                    <FileUpload.ItemSize />
                    <FileUpload.ItemDelete />
                  </FileUpload.Item>
                ))}
              </FileUpload.ItemGroup>
              <FileUpload.ClearTrigger>
                <Button variant="ghost" size="sm">Clear All</Button>
              </FileUpload.ClearTrigger>
            </>
          )}
        </FileUpload.Root>
      );
    };
    return <FileUploadStory />;
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
