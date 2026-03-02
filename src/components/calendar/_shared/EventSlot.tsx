'use client';
// Generated from Calendar.spec.ts — shared EventSlot
// Provenance: original-components/calendar/_shared/EventSlot.tsx

import * as React from 'react';
import type { CalendarEvent, RenderEvent } from './types';
import { formatTime } from './dateUtils';
import styles from './EventSlot.module.css';

export interface EventSlotProps {
  event: CalendarEvent;
  locale?: string;
  view?: string;
  isCompact?: boolean;
  isMultiDay?: boolean;
  renderEvent?: RenderEvent;
  onClick?: (event: CalendarEvent, e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

const PRESET_COLORS = ['primary', 'success', 'warning', 'danger', 'info'];

export function EventSlot({
  event,
  locale = 'en-US',
  view,
  isCompact = false,
  isMultiDay = false,
  renderEvent,
  onClick,
  className,
  style,
}: EventSlotProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(event, e);
  };

  if (renderEvent) {
    return (
      <div
        className={`${styles.eventSlot} ${className ?? ''}`}
        style={style}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        data-color={PRESET_COLORS.includes(event.color ?? '') ? event.color : 'primary'}
      >
        {renderEvent(event, { view, isCompact, isMultiDay })}
      </div>
    );
  }

  const isPresetColor = PRESET_COLORS.includes(event.color ?? '');
  const slotStyle: React.CSSProperties = {
    ...style,
    ...(!isPresetColor && event.color
      ? { borderColor: event.color, backgroundColor: `${event.color}20` }
      : {}),
  };

  return (
    <div
      className={`${styles.eventSlot} ${className ?? ''}`}
      style={slotStyle}
      data-color={isPresetColor ? event.color : 'primary'}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      {!event.allDay && !isCompact && (
        <span className={styles.eventTime}>
          {formatTime(event.start, locale)}
        </span>
      )}
      <span className={styles.eventTitle}>{event.title}</span>
    </div>
  );
}
