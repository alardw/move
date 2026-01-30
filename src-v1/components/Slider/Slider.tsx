'use client';

import * as React from 'react';
import { Slider as RadixSlider } from 'radix-ui';
import styles from './Slider.module.css';

export interface SliderRootProps extends React.ComponentPropsWithoutRef<typeof RadixSlider.Root> {
  className?: string;
}

const SliderRoot = React.forwardRef<
  React.ElementRef<typeof RadixSlider.Root>,
  SliderRootProps
>(({ className, ...props }, ref) => (
  <RadixSlider.Root
    ref={ref}
    className={`${styles.root} ${className || ''}`}
    {...props}
  />
));
SliderRoot.displayName = 'Slider.Root';

export interface SliderTrackProps extends React.ComponentPropsWithoutRef<typeof RadixSlider.Track> {
  className?: string;
}

const SliderTrack = React.forwardRef<
  React.ElementRef<typeof RadixSlider.Track>,
  SliderTrackProps
>(({ className, ...props }, ref) => (
  <RadixSlider.Track
    ref={ref}
    className={`${styles.track} ${className || ''}`}
    {...props}
  />
));
SliderTrack.displayName = 'Slider.Track';

export interface SliderRangeProps extends React.ComponentPropsWithoutRef<typeof RadixSlider.Range> {
  className?: string;
}

const SliderRange = React.forwardRef<
  React.ElementRef<typeof RadixSlider.Range>,
  SliderRangeProps
>(({ className, ...props }, ref) => (
  <RadixSlider.Range
    ref={ref}
    className={`${styles.range} ${className || ''}`}
    {...props}
  />
));
SliderRange.displayName = 'Slider.Range';

export interface SliderThumbProps extends React.ComponentPropsWithoutRef<typeof RadixSlider.Thumb> {
  className?: string;
}

const SliderThumb = React.forwardRef<
  React.ElementRef<typeof RadixSlider.Thumb>,
  SliderThumbProps
>(({ className, ...props }, ref) => (
  <RadixSlider.Thumb
    ref={ref}
    className={`${styles.thumb} ${className || ''}`}
    {...props}
  />
));
SliderThumb.displayName = 'Slider.Thumb';

export const Slider = {
  Root: SliderRoot,
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
};
