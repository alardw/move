export interface VTTCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

function parseTimestamp(raw: string): number {
  const parts = raw.trim().split(':');
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    seconds = parseFloat(parts[2]);
  } else if (parts.length === 2) {
    minutes = parseInt(parts[0], 10);
    seconds = parseFloat(parts[1]);
  }

  return hours * 3600 + minutes * 60 + seconds;
}

export function parseVTT(content: string): VTTCue[] {
  const cues: VTTCue[] = [];
  const blocks = content.replace(/\r\n/g, '\n').split('\n\n');
  let cueIndex = 0;

  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length === 0) continue;

    // Find the line with the timestamp arrow
    let tsLineIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('-->')) {
        tsLineIdx = i;
        break;
      }
    }

    if (tsLineIdx === -1) continue;

    const id = tsLineIdx > 0 ? lines[tsLineIdx - 1].trim() : String(cueIndex);
    const tsParts = lines[tsLineIdx].split('-->');
    if (tsParts.length !== 2) continue;

    const startTime = parseTimestamp(tsParts[0]);
    const endTime = parseTimestamp(tsParts[1].trim().split(/\s+/)[0]);
    const text = lines.slice(tsLineIdx + 1).join('\n').trim();

    if (text) {
      cues.push({ id, startTime, endTime, text });
      cueIndex++;
    }
  }

  return cues;
}
