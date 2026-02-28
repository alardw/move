import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AudioPlayer } from './AudioPlayer';

const SAMPLE_AUDIO = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Media/AudioPlayer',
  component: AudioPlayer,
  args: {
    src: SAMPLE_AUDIO,
    onPlaybackRateChange: fn(),
    onPlayingChange: fn(),
    onVolumeChange: fn(),
    onTimeChange: fn(),
    onEnded: fn(),
    onError: fn(),
    onReady: fn(),
    onQualityChange: fn(),
    onAudioTrackChange: fn(),
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'Audio source URL.',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Start playing automatically.',
    },
    muted: {
      control: 'boolean',
      description: 'Start muted.',
    },
    loop: {
      control: 'boolean',
      description: 'Loop playback.',
    },
    playbackRate: {
      control: 'number',
      description: 'Controlled playback speed.',
    },
    playing: {
      control: 'boolean',
      description: 'Controlled playing state.',
    },
    volume: {
      control: 'number',
      description: 'Controlled volume (0–1).',
    },
    currentTime: {
      control: 'number',
      description: 'Controlled current time in seconds.',
    },
    showSettings: {
      control: 'boolean',
      description: 'Show settings gear menu (speed, quality, audio).',
      table: { defaultValue: { summary: 'true' } },
    },
    showSubtitles: {
      control: 'boolean',
      description: 'Show subtitle toggle (when subtitles provided).',
      table: { defaultValue: { summary: 'true' } },
    },
    showVolume: {
      control: 'boolean',
      description: 'Show volume controls.',
      table: { defaultValue: { summary: 'true' } },
    },
    showTime: {
      control: 'boolean',
      description: 'Show time display.',
      table: { defaultValue: { summary: 'true' } },
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
      description: 'Border radius.',
      table: { defaultValue: { summary: 'none' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Player size.',
      table: { defaultValue: { summary: 'md' } },
    },
    playLabel: {
      control: 'text',
      description: 'i18n label for play button.',
    },
    pauseLabel: {
      control: 'text',
      description: 'i18n label for pause button.',
    },
    muteLabel: {
      control: 'text',
      description: 'i18n label for mute button.',
    },
    unmuteLabel: {
      control: 'text',
      description: 'i18n label for unmute button.',
    },
    settingsLabel: {
      control: 'text',
      description: 'i18n label for settings button.',
    },
    subtitlesLabel: {
      control: 'text',
      description: 'i18n label for subtitles button.',
    },
    onPlaybackRateChange: {
      action: 'onPlaybackRateChange',
      description: 'Called when speed changes.',
    },
    onPlayingChange: {
      action: 'onPlayingChange',
      description: 'Called when playing state changes.',
    },
    onVolumeChange: {
      action: 'onVolumeChange',
      description: 'Called when volume changes.',
    },
    onTimeChange: {
      action: 'onTimeChange',
      description: 'Called on time updates.',
    },
    onEnded: {
      action: 'onEnded',
      description: 'Called when playback ends.',
    },
    onError: {
      action: 'onError',
      description: 'Called on playback error.',
    },
    onReady: {
      action: 'onReady',
      description: 'Called when audio metadata is loaded.',
    },
    onQualityChange: {
      action: 'onQualityChange',
      description: 'Called when quality changes.',
    },
    onAudioTrackChange: {
      action: 'onAudioTrackChange',
      description: 'Called when audio track changes.',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 600 }}>
      <AudioPlayer {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof AudioPlayer>;

export const Default: Story = {};
