import { useState } from 'react';
import { FileUpload, Button, Icon, Heading, createAdapter } from 'move';
import type { FileUploadAdapter } from 'move';
import { DocPage, type Example } from '../components/DocPage';
import { Stack, DemoSample } from '../components';

// Simulated adapter for demos (delays to show progress)
const demoAdapter: FileUploadAdapter = createAdapter(async ({ file, onProgress, signal }) => {
  const totalSteps = 20;
  for (let i = 1; i <= totalSteps; i++) {
    if (signal.aborted) throw new DOMException('Upload aborted', 'AbortError');
    await new Promise((r) => setTimeout(r, 100 + Math.random() * 100));
    onProgress({
      loaded: Math.round((file.size * i) / totalSteps),
      total: file.size,
      percent: Math.round((i / totalSteps) * 100),
    });
  }
  return { url: `https://example.com/files/${file.name}` };
});

// =============================================================================
// Usage — full standard setup
// =============================================================================

function UsageExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload.Root value={files} onFilesChange={setFiles}>
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
}

// =============================================================================
// Button Only — trigger without dropzone
// =============================================================================

function ButtonOnlyExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload.Root value={files} onFilesChange={setFiles}>
      <FileUpload.Trigger>
        <Button variant="secondary" size="sm">
          <Icon name="upload" size="sm" />
          Choose Files
        </Button>
      </FileUpload.Trigger>
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
}

// =============================================================================
// Options — variants, accept filter, maxFiles, disabled
// =============================================================================

function OptionsExample() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="compact">
        <FileUpload.Root variant="compact">
          <FileUpload.Dropzone>
            <Icon name="upload" />
            <span>Drop files or click to browse</span>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      </DemoSample>
      <DemoSample label="accept: image/*">
        <FileUpload.Root accept="image/*">
          <FileUpload.Dropzone>
            <Icon name="image" size="lg" />
            <span>Drop images here</span>
            <span style={{ fontSize: '0.85em', opacity: 0.7 }}>Only image files accepted</span>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      </DemoSample>
      <DemoSample label="maxFiles: 3">
        <FileUpload.Root maxFiles={3} value={files} onFilesChange={setFiles}>
          <FileUpload.Dropzone>
            <Icon name="upload" size="lg" />
            <span>Maximum 3 files</span>
            <span style={{ fontSize: '0.85em', opacity: 0.7 }}>{files.length} / 3 selected</span>
          </FileUpload.Dropzone>
          {files.length > 0 && (
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
          )}
        </FileUpload.Root>
      </DemoSample>
      <DemoSample label="disabled">
        <FileUpload.Root disabled>
          <FileUpload.Dropzone>
            <Icon name="upload" size="lg" />
            <span>Upload disabled</span>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      </DemoSample>
    </Stack>
  );
}

// =============================================================================
// Upload — manual, auto, and auto-remove
// =============================================================================

function UploadExample() {
  return (
    <Stack direction="column" gap="xl">
      <DemoSample label="Manual upload">
        <ManualUploadInner />
      </DemoSample>
      <DemoSample label="Auto upload + remove on complete">
        <AutoRemoveUploadInner />
      </DemoSample>
    </Stack>
  );
}

function ManualUploadInner() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload.Root adapter={demoAdapter} value={files} onFilesChange={setFiles}>
      <FileUpload.Dropzone>
        <Icon name="upload" size="lg" />
        <span>Select files, then upload</span>
        <FileUpload.Trigger>
          <Button variant="secondary" size="sm">Choose Files</Button>
        </FileUpload.Trigger>
      </FileUpload.Dropzone>
      {files.length > 0 && (
        <>
          <FileUpload.TotalProgress showLabel />
          <FileUpload.ItemGroup>
            {files.map((file, i) => (
              <FileUpload.Item key={`${file.name}-${i}`} file={file}>
                <FileUpload.ItemPreview />
                <FileUpload.ItemName />
                <FileUpload.ItemProgress />
                <FileUpload.ItemDelete />
              </FileUpload.Item>
            ))}
          </FileUpload.ItemGroup>
          <Stack direction="row" gap="sm">
            <FileUpload.UploadTrigger>
              <Button size="sm">Upload All</Button>
            </FileUpload.UploadTrigger>
            <FileUpload.ClearTrigger>
              <Button variant="ghost" size="sm">Clear All</Button>
            </FileUpload.ClearTrigger>
          </Stack>
        </>
      )}
    </FileUpload.Root>
  );
}

function AutoRemoveUploadInner() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FileUpload.Root
      adapter={demoAdapter}
      autoUpload
      removeOnComplete={3000}
      value={files}
      onFilesChange={setFiles}
    >
      <FileUpload.Dropzone>
        <Icon name="upload" size="lg" />
        <span>Drop files to upload — removed after 3s</span>
        <FileUpload.Trigger>
          <Button variant="secondary" size="sm">Choose Files</Button>
        </FileUpload.Trigger>
      </FileUpload.Dropzone>
      {files.length > 0 && (
        <>
          <FileUpload.TotalProgress showLabel />
          <FileUpload.ItemGroup>
            {files.map((file, i) => (
              <FileUpload.Item key={`${file.name}-${i}`} file={file}>
                <FileUpload.ItemPreview />
                <FileUpload.ItemName />
                <FileUpload.ItemProgress />
                <FileUpload.ItemDelete />
              </FileUpload.Item>
            ))}
          </FileUpload.ItemGroup>
        </>
      )}
    </FileUpload.Root>
  );
}

// =============================================================================
// Examples
// =============================================================================

const examples: Example[] = [
  {
    id: 'usage',
    name: 'Usage',
    description: 'Dropzone with file list, preview thumbnails, and clear action.',
    component: <UsageExample />,
    fullWidth: true,
    code: `const [files, setFiles] = useState<File[]>([]);

<FileUpload.Root value={files} onFilesChange={setFiles}>
  <FileUpload.Dropzone>
    <Icon name="upload" size="lg" />
    <span>Drag & drop files here</span>
    <FileUpload.Trigger>
      <Button variant="secondary" size="sm">Choose Files</Button>
    </FileUpload.Trigger>
  </FileUpload.Dropzone>
  <FileUpload.ItemGroup>
    {files.map((file, i) => (
      <FileUpload.Item key={file.name + i} file={file}>
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
</FileUpload.Root>`,
  },
  {
    id: 'button-only',
    name: 'Button Only',
    description: 'A button trigger without the dropzone area.',
    component: <ButtonOnlyExample />,
    fullWidth: true,
    code: `<FileUpload.Root value={files} onFilesChange={setFiles}>
  <FileUpload.Trigger>
    <Button variant="secondary" size="sm">
      <Icon name="upload" size="sm" />
      Choose Files
    </Button>
  </FileUpload.Trigger>
  <FileUpload.ItemGroup>
    {files.map((file, i) => (
      <FileUpload.Item key={file.name + i} file={file}>
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
    id: 'options',
    name: 'Options',
    description: 'Compact variant, file type filter, max files, and disabled state.',
    component: <OptionsExample />,
    fullWidth: true,
    code: `{/* Compact variant */}
<FileUpload.Root variant="compact">...</FileUpload.Root>

{/* Accept only images */}
<FileUpload.Root accept="image/*">...</FileUpload.Root>

{/* Limit to 3 files */}
<FileUpload.Root maxFiles={3}>...</FileUpload.Root>

{/* Disabled */}
<FileUpload.Root disabled>...</FileUpload.Root>`,
  },
  {
    id: 'upload',
    name: 'Upload',
    description: 'Upload files with progress tracking, status indicators, and manual or auto upload.',
    component: <UploadExample />,
    fullWidth: true,
    code: [
      {
        label: 'Manual',
        code: `const adapter = httpAdapter({ url: '/api/upload' });

<FileUpload.Root adapter={adapter} value={files} onFilesChange={setFiles}>
  <FileUpload.Dropzone>...</FileUpload.Dropzone>
  <FileUpload.TotalProgress showLabel />
  <FileUpload.ItemGroup>
    {files.map((file, i) => (
      <FileUpload.Item key={file.name + i} file={file}>
        <FileUpload.ItemPreview />
        <FileUpload.ItemName />
        <FileUpload.ItemProgress />
        <FileUpload.ItemDelete />
      </FileUpload.Item>
    ))}
  </FileUpload.ItemGroup>
  <FileUpload.UploadTrigger>
    <Button size="sm">Upload All</Button>
  </FileUpload.UploadTrigger>
</FileUpload.Root>`,
      },
      {
        label: 'Auto',
        code: `const adapter = httpAdapter({ url: '/api/upload' });

{/* Files upload immediately when selected */}
<FileUpload.Root adapter={adapter} autoUpload value={files} onFilesChange={setFiles}>
  <FileUpload.Dropzone>...</FileUpload.Dropzone>
  <FileUpload.TotalProgress showLabel />
  <FileUpload.ItemGroup>
    {files.map((file, i) => (
      <FileUpload.Item key={file.name + i} file={file}>
        <FileUpload.ItemPreview />
        <FileUpload.ItemName />
        <FileUpload.ItemProgress />
        <FileUpload.ItemDelete />
      </FileUpload.Item>
    ))}
  </FileUpload.ItemGroup>
</FileUpload.Root>`,
      },
      {
        label: 'Auto Remove',
        code: `const adapter = httpAdapter({ url: '/api/upload' });

{/* Files are removed from the list 3s after completing */}
<FileUpload.Root
  adapter={adapter}
  autoUpload
  removeOnComplete={3000}
  value={files}
  onFilesChange={setFiles}
>
  <FileUpload.Dropzone>...</FileUpload.Dropzone>
  <FileUpload.TotalProgress showLabel />
  <FileUpload.ItemGroup>
    {files.map((file, i) => (
      <FileUpload.Item key={file.name + i} file={file}>
        <FileUpload.ItemPreview />
        <FileUpload.ItemName />
        <FileUpload.ItemProgress />
        <FileUpload.ItemDelete />
      </FileUpload.Item>
    ))}
  </FileUpload.ItemGroup>
</FileUpload.Root>`,
      },
    ],
  },
  {
    id: 'custom-adapter',
    name: 'Custom Adapter',
    description: 'Build your own adapter for any upload service.',
    component: <UploadExample />,
    fullWidth: true,
    code: [
      {
        label: 'HTTP',
        code: `import { httpAdapter } from 'move';

const adapter = httpAdapter({
  url: '/api/upload',
  method: 'POST',
  fieldName: 'file',
  headers: { Authorization: \`Bearer \${token}\` },
  data: { folder: 'avatars' },
});`,
      },
      {
        label: 'S3 Presigned',
        code: `import { createAdapter } from 'move';

const s3Adapter = createAdapter(async ({ file, onProgress, signal }) => {
  // 1. Get presigned URL from your API
  const { url, fields } = await fetch('/api/presign', {
    method: 'POST',
    body: JSON.stringify({ name: file.name, type: file.type }),
    headers: { 'Content-Type': 'application/json' },
  }).then(r => r.json());

  // 2. Upload directly to S3 with progress
  const xhr = new XMLHttpRequest();
  signal.addEventListener('abort', () => xhr.abort());
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      onProgress({ loaded: e.loaded, total: e.total, percent: Math.round((e.loaded / e.total) * 100) });
    }
  };

  return new Promise((resolve, reject) => {
    xhr.onload = () => xhr.status < 300 ? resolve({ url }) : reject(new Error('Upload failed'));
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file);
  });
});`,
      },
      {
        label: 'Firebase',
        code: `import { createAdapter } from 'move';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

const firebaseAdapter = createAdapter(async ({ file, onProgress, signal }) => {
  const storageRef = ref(storage, \`uploads/\${file.name}\`);
  const task = uploadBytesResumable(storageRef, file);

  signal.addEventListener('abort', () => task.cancel());

  task.on('state_changed', (snap) => {
    onProgress({
      loaded: snap.bytesTransferred,
      total: snap.totalBytes,
      percent: Math.round((snap.bytesTransferred / snap.totalBytes) * 100),
    });
  });

  const snap = await task;
  const url = await getDownloadURL(snap.ref);
  return { url };
});`,
      },
      {
        label: 'tus (Resumable)',
        code: `import { createAdapter } from 'move';
import * as tus from 'tus-js-client';

const tusAdapter = createAdapter(({ file, onProgress, signal }) => {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: 'https://tusd.example.com/files/',
      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 1000, 3000],
      metadata: { filename: file.name, filetype: file.type },
      onProgress: (loaded, total) => {
        onProgress({ loaded, total, percent: Math.round((loaded / total) * 100) });
      },
      onSuccess: () => resolve({ url: upload.url ?? undefined }),
      onError: (err) => reject(err),
    });

    signal.addEventListener('abort', () => upload.abort());
    upload.start();
  });
});`,
      },
    ],
  },
];

export function FileUploadDemo() {
  return (
    <DocPage.Root defaultExample="usage">
      <DocPage.Header
        title="FileUpload"
        description="Drag-and-drop file upload with validation, previews, and file list management. Supports pluggable upload adapters for HTTP, S3, Firebase, and more."
      />
      <DocPage.Examples examples={examples} />

      <Heading level={3}>Parameters</Heading>

      <DocPage.ApiSection
        title="FileUpload.Root"
        properties={[
          { name: 'accept', type: 'string | string[]', description: 'Accepted file types (MIME types or extensions).' },
          { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes.' },
          { name: 'maxFiles', type: 'number', description: 'Maximum number of files.' },
          { name: 'multiple', type: 'boolean', default: 'true', description: 'Allow multiple file selection.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the upload.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the upload area.' },
          { name: 'variant', type: "'default' | 'compact'", default: "'default'", description: 'Visual style of the dropzone.' },
          { name: 'value', type: 'File[]', description: 'Controlled file list.' },
          { name: 'defaultValue', type: 'File[]', description: 'Default files for uncontrolled mode.' },
          { name: 'onFilesChange', type: '(files: File[]) => void', description: 'Called when the file list changes.' },
          { name: 'onFileReject', type: '(rejections: FileRejection[]) => void', description: 'Called when files are rejected.' },
          { name: 'validate', type: '(file: File) => string | null', description: 'Custom validation function.' },
          { name: 'adapter', type: 'FileUploadAdapter', description: 'Upload adapter function. When provided, enables upload functionality.' },
          { name: 'autoUpload', type: 'boolean', default: 'false', description: 'Start uploading files immediately when selected.' },
          { name: 'concurrency', type: 'number', default: '3', description: 'Maximum number of simultaneous uploads.' },
          { name: 'onUploadComplete', type: '(entry: FileUploadEntry) => void', description: 'Called when a file finishes uploading.' },
          { name: 'onUploadError', type: '(entry: FileUploadEntry, error: Error) => void', description: 'Called when a file upload fails.' },
          { name: 'onAllComplete', type: '(entries: FileUploadEntry[]) => void', description: 'Called when all files have finished uploading.' },
          { name: 'removeOnComplete', type: 'boolean | number', default: 'false', description: 'Auto-remove files after upload completes. true = 2s delay, number = custom delay in ms.' },
        ]}
      />

      <DocPage.ApiSection
        title="FileUpload.Item"
        properties={[
          { name: 'file', type: 'File', description: 'The file object to display.' },
        ]}
      />
    </DocPage.Root>
  );
}
