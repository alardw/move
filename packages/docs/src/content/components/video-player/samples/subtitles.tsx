import { VideoPlayer } from 'move';

const SRC = '/sample.mp4';

// VTT tracks live in /public so they're served at the site root next
// to the video. The settings menu inside the player exposes the list;
// `default: true` starts the player with English captions on.
const SUBTITLES = [
  { src: '/sample.en.vtt', label: 'English', language: 'en', default: true },
  { src: '/sample.nl.vtt', label: 'Nederlands', language: 'nl' },
];

export default function SubtitlesSample() {
  return <VideoPlayer src={SRC} radius="md" subtitles={SUBTITLES} />;
}
