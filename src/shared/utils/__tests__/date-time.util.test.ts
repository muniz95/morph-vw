import { describe, expect, it } from 'vitest';
import { formatClockTime, formatDateTime } from '@/shared/utils/date-time.util';

describe('Date-time util', () => {
  it('must print a time in a human-legible format', () => {
    const tenOClock = formatClockTime(new Date(2000, 1, 1, 10, 0, 0));

    expect(tenOClock).eq('10:00');
  });

  it('must print hours, minutes and seconds', () => {
    const tenOClock = formatClockTime(new Date(2000, 1, 1, 10, 0, 0), {
      options: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    });

    expect(tenOClock).eq('10:00:00');
  });

  it('must print basic date', () => {
    const mayTwelfth = formatDateTime(new Date(2000, 4, 12));

    expect(mayTwelfth).eq('05/12');
  });

  it('must print full date', () => {
    const mayTwelfth = formatDateTime(new Date(2000, 4, 12), {
      options: { year: '2-digit', month: '2-digit', day: '2-digit' },
    });

    expect(mayTwelfth).eq('05/12/00');
  });
});
