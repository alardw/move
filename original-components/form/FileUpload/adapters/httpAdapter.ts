import type { HttpAdapterOptions, FileUploadAdapter, UploadProgress } from '../types';

/**
 * Creates an HTTP upload adapter using XMLHttpRequest.
 * Uses XHR (not fetch) because fetch does not support upload progress events.
 *
 * @example
 * ```ts
 * const adapter = httpAdapter({
 *   url: '/api/upload',
 *   headers: { Authorization: `Bearer ${token}` },
 *   fieldName: 'file',
 *   data: { folder: 'avatars' },
 * });
 * ```
 */
export function httpAdapter(options: HttpAdapterOptions): FileUploadAdapter {
  const {
    url,
    method = 'POST',
    fieldName = 'file',
    headers = {},
    data = {},
    withCredentials = false,
    responseTransform,
  } = options;

  return ({ file, onProgress, signal }) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Wire up abort signal
      const onAbort = () => {
        xhr.abort();
        reject(new DOMException('Upload aborted', 'AbortError'));
      };
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener('abort', onAbort, { once: true });

      // Progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress: UploadProgress = {
            loaded: e.loaded,
            total: e.total,
            percent: Math.round((e.loaded / e.total) * 100),
          };
          onProgress(progress);
        }
      });

      // Completion
      xhr.addEventListener('load', () => {
        signal.removeEventListener('abort', onAbort);
        if (xhr.status >= 200 && xhr.status < 300) {
          let response: unknown;
          try {
            response = JSON.parse(xhr.responseText);
          } catch {
            response = xhr.responseText;
          }
          const result = responseTransform
            ? responseTransform(response)
            : { response };
          resolve(result);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        signal.removeEventListener('abort', onAbort);
        reject(new Error('Network error during upload'));
      });

      // Build FormData
      const formData = new FormData();
      formData.append(fieldName, file, file.name);
      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }

      // Send
      xhr.open(method, url, true);
      xhr.withCredentials = withCredentials;
      for (const [key, value] of Object.entries(headers)) {
        xhr.setRequestHeader(key, value);
      }
      xhr.send(formData);
    });
  };
}
