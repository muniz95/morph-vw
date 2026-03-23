import { describe, expect, it } from 'vitest';
import { formatClockTime } from '@/shared/utils/date-time.util';

describe('Date-time util', () => {
  it('must print a time in a human-legible format', () => {
    const tenOClock = formatClockTime(new Date(2000, 1, 1, 10, 0, 0));

    expect(tenOClock).eq('10:00:00');
  });
});
