import { render, act, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { FileUpload } from './FileUpload';
import type { FileUploadAdapter } from './types';

/**
 * The queue drains once, and every file ends up in exactly one terminal state.
 *
 * Reported from the docs sample: with a longer list, finished files upload a
 * second time and a tail of rows never clears. Concurrency is 3, so anything
 * past the third file goes through the queue rather than starting immediately —
 * which is the path a short list never exercises.
 *
 * Rendered under StrictMode, because the docs app is and that is where it was
 * seen: StrictMode double-invokes effects in development, so anything that
 * starts work from an effect gets to start it twice.
 */
function makeFiles(n: number): File[] {
  return Array.from({ length: n }, (_, i) => new File(['x'], `f${i}.txt`, { type: 'text/plain' }));
}

/** Hand the hidden input a FileList, which is the path a real pick takes. */
function pick(container: HTMLElement, files: File[]) {
  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  // jsdom has no DataTransfer, so the FileList is faked — the component only
  // ever reads length and indices off it.
  const list = {
    ...files,
    length: files.length,
    item: (i: number) => files[i] ?? null,
    [Symbol.iterator]: files[Symbol.iterator].bind(files),
  };
  Object.defineProperty(input, 'files', { value: list, configurable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function Harness({
  adapter,
  removeOnComplete,
}: {
  adapter: FileUploadAdapter;
  removeOnComplete?: number;
}) {
  const [value, setValue] = React.useState<File[]>([]);

  return (
    <FileUpload.Root
      adapter={adapter}
      autoUpload
      maxFiles={20}
      removeOnComplete={removeOnComplete}
      value={value}
      onFilesChange={setValue}
    >
      <FileUpload.Dropzone>
        <span>drop</span>
      </FileUpload.Dropzone>
      <FileUpload.ItemGroup>
        {value.map((f) => (
          <FileUpload.Item key={f.name} file={f}>
            <FileUpload.ItemName />
            <FileUpload.ItemStatus />
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
      <FileUpload.TotalProgress />
    </FileUpload.Root>
  );
}

describe('upload queue', () => {
  it('uploads each file exactly once, past the concurrency limit', async () => {
    const starts: string[] = [];
    const adapter: FileUploadAdapter = async ({ file }) => {
      starts.push(file.name);
      await new Promise((r) => setTimeout(r, 10));
      return { url: `/${file.name}` };
    };

    let container!: HTMLElement;
    await act(async () => {
      container = render(
        <React.StrictMode>
          <Harness adapter={adapter} />
        </React.StrictMode>,
      ).container;
    });
    await act(async () => {
      pick(container, makeFiles(8));
    });

    await waitFor(() => expect(starts.length).toBeGreaterThanOrEqual(8), { timeout: 3000 });
    // Settle, so a second pass would have had time to show up.
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });

    const counts = starts.reduce<Record<string, number>>((acc, n) => {
      acc[n] = (acc[n] ?? 0) + 1;
      return acc;
    }, {});
    const repeated = Object.entries(counts).filter(([, c]) => c > 1);
    expect(repeated).toEqual([]);
    expect(starts.length).toBe(8);
  });

  it('drains the whole queue — no tail is left behind', async () => {
    const done: string[] = [];
    const adapter: FileUploadAdapter = async ({ file }) => {
      await new Promise((r) => setTimeout(r, 10));
      done.push(file.name);
      return { url: `/${file.name}` };
    };

    let container!: HTMLElement;
    await act(async () => {
      container = render(
        <React.StrictMode>
          <Harness adapter={adapter} />
        </React.StrictMode>,
      ).container;
    });
    await act(async () => {
      pick(container, makeFiles(8));
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 800));
    });
    expect(done.length).toBe(8);
  });

  it('does not restart a file that removeOnComplete took away mid-drain', async () => {
    // The reported case: rows are being removed while the queue is still
    // draining, so the map is losing entries under the drain loop.
    const starts: string[] = [];
    const adapter: FileUploadAdapter = async ({ file }) => {
      starts.push(file.name);
      await new Promise((r) => setTimeout(r, 10));
      return { url: `/${file.name}` };
    };

    let container!: HTMLElement;
    await act(async () => {
      container = render(
        <React.StrictMode>
          <Harness adapter={adapter} removeOnComplete={20} />
        </React.StrictMode>,
      ).container;
    });
    await act(async () => {
      pick(container, makeFiles(8));
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1200));
    });

    const counts = starts.reduce<Record<string, number>>((acc, n) => {
      acc[n] = (acc[n] ?? 0) + 1;
      return acc;
    }, {});
    expect(Object.entries(counts).filter(([, c]) => c > 1)).toEqual([]);
    expect(starts.length).toBe(8);
  });

  it('gives every file a visible share of the total, whatever its size', async () => {
    // A 10 MB video beside a 405 kB screenshot: weighted by bytes, the video
    // finishing puts the bar at ~97% while the rest are plainly still waiting.
    // Weighted by file, half done is half the bar.
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const adapter: FileUploadAdapter = async ({ file }) => {
      if (file.name === 'small.txt') await gate;
      return { url: `/${file.name}` };
    };

    const big = new File([new Uint8Array(10_000_000)], 'big.bin', {
      type: 'application/octet-stream',
    });
    const small = new File(['x'], 'small.txt', { type: 'text/plain' });

    let container!: HTMLElement;
    await act(async () => {
      container = render(<Harness adapter={adapter} />).container;
    });
    await act(async () => {
      pick(container, [big, small]);
    });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    // The big one is done, the small one is not. One of two files.
    const bar = container.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute('aria-valuenow')).toBe('50');

    await act(async () => {
      release();
      await new Promise((r) => setTimeout(r, 50));
    });
    expect(container.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow')).toBe(
      '100',
    );
  });
});
