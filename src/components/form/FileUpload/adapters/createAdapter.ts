import type { FileUploadAdapter } from '../types';

/**
 * Typed wrapper for creating custom upload adapters.
 * This is an identity function — it exists for TypeScript inference.
 *
 * @example
 * ```ts
 * const s3Adapter = createAdapter(async ({ file, onProgress, signal }) => {
 *   const { url } = await fetch('/api/presign', {
 *     method: 'POST',
 *     body: JSON.stringify({ name: file.name, type: file.type }),
 *   }).then(r => r.json());
 *
 *   const xhr = new XMLHttpRequest();
 *   signal.addEventListener('abort', () => xhr.abort());
 *   xhr.upload.onprogress = (e) => {
 *     if (e.lengthComputable) {
 *       onProgress({ loaded: e.loaded, total: e.total, percent: Math.round((e.loaded / e.total) * 100) });
 *     }
 *   };
 *
 *   return new Promise((resolve, reject) => {
 *     xhr.onload = () => resolve({ url });
 *     xhr.onerror = () => reject(new Error('Upload failed'));
 *     xhr.open('PUT', url);
 *     xhr.send(file);
 *   });
 * });
 * ```
 */
export function createAdapter(adapter: FileUploadAdapter): FileUploadAdapter {
  return adapter;
}
