import { AudioPlayer } from 'move';

const SAMPLE_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

export default function BasicSample() {
  return <AudioPlayer src={SAMPLE_SRC} radius="md" />;
}
