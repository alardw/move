import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { VideoPlayer } from './VideoPlayer';

const SAMPLE_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_POSTER =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';

const meta: Meta<typeof VideoPlayer> = {
  title: 'Media/VideoPlayer',
  component: VideoPlayer,
  args: {
    src: SAMPLE_VIDEO,
    poster: SAMPLE_POSTER,
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
      description: 'Video source URL.',
    },
    poster: {
      control: 'text',
      description: 'Poster image URL shown before playback.',
    },
    provider: {
      table: { disable: true },
    },
    subtitles: {
      table: { disable: true },
    },
    qualities: {
      table: { disable: true },
    },
    audioTracks: {
      table: { disable: true },
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
    onPlaybackRateChange: {
      action: 'onPlaybackRateChange',
      description: 'Called when speed changes.',
    },
    playing: {
      control: 'boolean',
      description: 'Controlled playing state.',
    },
    onPlayingChange: {
      action: 'onPlayingChange',
      description: 'Called when playing state changes.',
    },
    volume: {
      control: 'number',
      description: 'Controlled volume (0–1).',
    },
    onVolumeChange: {
      action: 'onVolumeChange',
      description: 'Called when volume changes.',
    },
    currentTime: {
      control: 'number',
      description: 'Controlled current time in seconds.',
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
      description: 'Called when video metadata is loaded.',
    },
    onQualityChange: {
      action: 'onQualityChange',
      description: 'Called when quality changes.',
    },
    onAudioTrackChange: {
      action: 'onAudioTrackChange',
      description: 'Called when audio track changes.',
    },
    showSettings: {
      control: 'boolean',
      description: 'Show settings gear menu (speed, quality, audio).',
      table: { defaultValue: { summary: 'true' } },
    },
    showVolume: {
      control: 'boolean',
      description: 'Show volume controls.',
      table: { defaultValue: { summary: 'true' } },
    },
    showSubtitles: {
      control: 'boolean',
      description: 'Show subtitle toggle (when subtitles provided).',
      table: { defaultValue: { summary: 'true' } },
    },
    showFullscreen: {
      control: 'boolean',
      description: 'Show fullscreen button.',
      table: { defaultValue: { summary: 'true' } },
    },
    showTime: {
      control: 'boolean',
      description: 'Show time display.',
      table: { defaultValue: { summary: 'true' } },
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
    fullscreenLabel: {
      control: 'text',
      description: 'i18n label for fullscreen button.',
    },
    exitFullscreenLabel: {
      control: 'text',
      description: 'i18n label for exit-fullscreen button.',
    },
    settingsLabel: {
      control: 'text',
      description: 'i18n label for settings button.',
    },
    subtitlesLabel: {
      control: 'text',
      description: 'i18n label for subtitles button.',
    },
    subtitlesOffLabel: {
      control: 'text',
      description: 'i18n label for "Off" in the subtitle menu.',
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Border radius.',
      table: { defaultValue: { summary: 'none' } },
    },
    aspectRatio: {
      control: 'text',
      description: 'CSS aspect ratio (e.g. "16/9", "4/3").',
    },
    width: {
      control: 'text',
      description: 'Width of the player container.',
    },
    height: {
      control: 'text',
      description: 'Height of the player container.',
    },
    children: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
    style: {
      table: { disable: true },
    },
    sp: {
      table: { disable: true },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <VideoPlayer {...args} />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof VideoPlayer>;

export const Default: Story = {};
