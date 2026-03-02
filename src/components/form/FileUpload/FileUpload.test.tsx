// Generated from FileUpload.spec.ts (schemaVersion: 6, specHash: PLACEHOLDER)
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FileUpload } from './FileUpload';

function createFile(name: string, size: number, type: string): File {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
}

function BasicUpload(props: Record<string, unknown> = {}) {
  return (
    <FileUpload.Root {...props}>
      <FileUpload.Dropzone>
        <p>Drop files here</p>
      </FileUpload.Dropzone>
    </FileUpload.Root>
  );
}

describe('FileUpload', () => {
  // === Root rendering ===
  describe('Root rendering', () => {
    it('renders root element', () => {
      const { container } = render(<BasicUpload />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it('forwards className on Root', () => {
      const { container } = render(<BasicUpload className="custom" />);
      expect(container.firstElementChild?.className).toContain('custom');
    });

    it('forwards style on Root', () => {
      const { container } = render(<BasicUpload style={{ margin: '10px' }} />);
      expect(container.firstElementChild).toHaveStyle({ margin: '10px' });
    });

    it('forwards ref to root element', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <FileUpload.Root ref={ref}>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
        </FileUpload.Root>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('renders hidden file input', () => {
      const { container } = render(<BasicUpload />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toBeInTheDocument();
    });

    it('hidden input has correct accept attribute', () => {
      const { container } = render(<BasicUpload accept="image/*,.pdf" />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveAttribute('accept', 'image/*,.pdf');
    });

    it('hidden input has multiple attribute by default', () => {
      const { container } = render(<BasicUpload />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveAttribute('multiple');
    });
  });

  // === Data attributes ===
  describe('data attributes', () => {
    it('defaults to data-size=md', () => {
      const { container } = render(<BasicUpload />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'md');
    });

    it('defaults to data-variant=default', () => {
      const { container } = render(<BasicUpload />);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'default');
    });

    it('applies custom size', () => {
      const { container } = render(<BasicUpload size="lg" />);
      expect(container.firstElementChild).toHaveAttribute('data-size', 'lg');
    });

    it('applies compact variant', () => {
      const { container } = render(<BasicUpload variant="compact" />);
      expect(container.firstElementChild).toHaveAttribute('data-variant', 'compact');
    });

    it('sets data-disabled when disabled', () => {
      const { container } = render(<BasicUpload disabled />);
      expect(container.firstElementChild).toHaveAttribute('data-disabled');
    });
  });

  // === Dropzone ===
  describe('Dropzone', () => {
    it('renders dropzone with role=presentation', () => {
      render(<BasicUpload />);
      expect(screen.getByRole('presentation')).toBeInTheDocument();
    });

    it('forwards className on Dropzone', () => {
      const { container } = render(
        <FileUpload.Root>
          <FileUpload.Dropzone className="dz-custom">
            <p>Drop</p>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      );
      const dz = container.querySelector('[role="presentation"]');
      expect(dz?.className).toContain('dz-custom');
    });

    it('sets data-disabled on dropzone when Root is disabled', () => {
      render(<BasicUpload disabled />);
      const dz = screen.getByRole('presentation');
      expect(dz).toHaveAttribute('data-disabled');
    });
  });

  // === ItemGroup ===
  describe('ItemGroup', () => {
    it('renders as ul with role=list', () => {
      render(
        <FileUpload.Root>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
          <FileUpload.ItemGroup />
        </FileUpload.Root>
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByRole('list').tagName).toBe('UL');
    });
  });

  // === Item ===
  describe('Item', () => {
    it('renders as li within ItemGroup', () => {
      const file = createFile('test.txt', 100, 'text/plain');
      render(
        <FileUpload.Root defaultValue={[file]}>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Item file={file}>
              <FileUpload.ItemName />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      );
      const items = screen.getAllByRole('listitem');
      expect(items.length).toBeGreaterThan(0);
    });
  });

  // === ItemName ===
  describe('ItemName', () => {
    it('displays file name', () => {
      const file = createFile('document.pdf', 1024, 'application/pdf');
      render(
        <FileUpload.Root defaultValue={[file]}>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Item file={file}>
              <FileUpload.ItemName />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      );
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });
  });

  // === ItemSize ===
  describe('ItemSize', () => {
    it('displays formatted file size', () => {
      const file = createFile('big.bin', 2048, 'application/octet-stream');
      render(
        <FileUpload.Root defaultValue={[file]}>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Item file={file}>
              <FileUpload.ItemSize />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      );
      expect(screen.getByText('2 KB')).toBeInTheDocument();
    });
  });

  // === ItemDelete ===
  describe('ItemDelete', () => {
    it('renders button with aria-label "Remove {filename}"', () => {
      const file = createFile('photo.jpg', 500, 'image/jpeg');
      render(
        <FileUpload.Root defaultValue={[file]}>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Item file={file}>
              <FileUpload.ItemDelete />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      );
      expect(screen.getByLabelText('Remove photo.jpg')).toBeInTheDocument();
    });

    it('removes file on click', async () => {
      const user = userEvent.setup();
      const file = createFile('photo.jpg', 500, 'image/jpeg');
      const onChange = vi.fn();
      render(
        <FileUpload.Root defaultValue={[file]} onFilesChange={onChange}>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
          <FileUpload.ItemGroup>
            <FileUpload.Item file={file}>
              <FileUpload.ItemName />
              <FileUpload.ItemDelete />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        </FileUpload.Root>
      );
      await user.click(screen.getByLabelText('Remove photo.jpg'));
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  // === ClearTrigger ===
  describe('ClearTrigger', () => {
    it('clears all files on click', async () => {
      const user = userEvent.setup();
      const file1 = createFile('a.txt', 100, 'text/plain');
      const file2 = createFile('b.txt', 200, 'text/plain');
      const onChange = vi.fn();
      render(
        <FileUpload.Root defaultValue={[file1, file2]} onFilesChange={onChange}>
          <FileUpload.Dropzone><p>Drop</p></FileUpload.Dropzone>
          <FileUpload.ClearTrigger>
            <button>Clear All</button>
          </FileUpload.ClearTrigger>
        </FileUpload.Root>
      );
      await user.click(screen.getByText('Clear All'));
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });

  // === Trigger ===
  describe('Trigger', () => {
    it('renders trigger with child content', () => {
      render(
        <FileUpload.Root>
          <FileUpload.Dropzone>
            <FileUpload.Trigger>
              <button>Browse</button>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
        </FileUpload.Root>
      );
      expect(screen.getByText('Browse')).toBeInTheDocument();
    });
  });

  // === Validation ===
  describe('validation', () => {
    it('rejects files exceeding maxSize', () => {
      const onReject = vi.fn();
      const { container } = render(<BasicUpload maxSize={500} onFileReject={onReject} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const bigFile = createFile('big.txt', 1000, 'text/plain');

      fireEvent.change(input, { target: { files: [bigFile] } });
      expect(onReject).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            file: bigFile,
            errors: expect.arrayContaining([
              expect.objectContaining({ code: 'file-too-large' }),
            ]),
          }),
        ])
      );
    });

    it('rejects invalid file types', () => {
      const onReject = vi.fn();
      const { container } = render(<BasicUpload accept="image/*" onFileReject={onReject} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const textFile = createFile('doc.txt', 100, 'text/plain');

      fireEvent.change(input, { target: { files: [textFile] } });
      expect(onReject).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            file: textFile,
            errors: expect.arrayContaining([
              expect.objectContaining({ code: 'file-invalid-type' }),
            ]),
          }),
        ])
      );
    });

    it('respects maxFiles limit', () => {
      const onReject = vi.fn();
      const { container } = render(<BasicUpload maxFiles={1} onFileReject={onReject} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file1 = createFile('a.txt', 100, 'text/plain');
      const file2 = createFile('b.txt', 100, 'text/plain');

      fireEvent.change(input, { target: { files: [file1, file2] } });
      expect(onReject).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            errors: expect.arrayContaining([
              expect.objectContaining({ code: 'too-many-files' }),
            ]),
          }),
        ])
      );
    });

    it('calls custom validate function per file', () => {
      const validate = vi.fn().mockReturnValue('Custom error');
      const onReject = vi.fn();
      const { container } = render(<BasicUpload validate={validate} onFileReject={onReject} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile('test.txt', 100, 'text/plain');

      fireEvent.change(input, { target: { files: [file] } });
      expect(validate).toHaveBeenCalledWith(file);
      expect(onReject).toHaveBeenCalled();
    });
  });

  // === Controlled ===
  describe('controlled', () => {
    it('calls onFilesChange when files are added via input', () => {
      const onChange = vi.fn();
      const { container } = render(<BasicUpload onFilesChange={onChange} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = createFile('test.txt', 100, 'text/plain');

      fireEvent.change(input, { target: { files: [file] } });
      expect(onChange).toHaveBeenCalled();
    });
  });
});
