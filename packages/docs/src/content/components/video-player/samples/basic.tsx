import { VideoPlayer } from 'move';

// Served from packages/docs/public/sample.mp4 (Vite serves anything in
// /public at the site root). Bundled with the docs so the sample
// never depends on a third-party host being up.
const SRC = '/sample.mp4';

export default function BasicSample() {
  return <VideoPlayer src={SRC} radius="md" />;
}
