import { useState } from 'react';
import { AudioPlayer, Button, Stack, Text } from 'move';

const SAMPLE_SRC = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3';

/**
 * Pass `playing`, `currentTime`, `volume`, or `playbackRate` (paired
 * with their `onChange` callbacks) to drive the player from your own
 * state — useful when something outside the player needs to start it,
 * jump to a chapter, or display synced UI.
 */
export default function ControlledSample() {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);

  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center" wrap>
        <Button onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </Button>
        <Button variant="secondary" onClick={() => setTime(0)}>Restart</Button>
        <Button variant="secondary" onClick={() => setTime((t) => t + 30)}>+30s</Button>
        <Text size="sm" color="muted">
          state: {playing ? 'playing' : 'paused'} · {Math.floor(time)}s
        </Text>
      </Stack>
      <AudioPlayer
        src={SAMPLE_SRC}
        radius="md"
        playing={playing}
        onPlayingChange={setPlaying}
        currentTime={time}
        onTimeChange={setTime}
      />
    </Stack>
  );
}
