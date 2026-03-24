interface IFormatClockTimeProps {
  locale?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
}

const DEFAULT_FORMAT_CLOCK_TIME_PROPS: Required<IFormatClockTimeProps> = {
  locale: 'en-US',
  options: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
};

const DEFAULT_FORMAT_DATE_TIME_PROPS: Required<IFormatClockTimeProps> = {
  locale: 'en-US',
  options: {
    day: '2-digit',
    month: '2-digit',
  },
};

export const formatClockTime = (
  date: Date,
  {
    locale = DEFAULT_FORMAT_CLOCK_TIME_PROPS.locale,
    options = DEFAULT_FORMAT_CLOCK_TIME_PROPS.options,
  }: IFormatClockTimeProps = DEFAULT_FORMAT_CLOCK_TIME_PROPS
) => {
  return date.toLocaleTimeString(locale, {
    ...DEFAULT_FORMAT_CLOCK_TIME_PROPS.options,
    ...options,
  });
};

export const formatDateTime = (
  date: Date,
  {
    locale = DEFAULT_FORMAT_DATE_TIME_PROPS.locale,
    options = DEFAULT_FORMAT_DATE_TIME_PROPS.options,
  }: IFormatClockTimeProps = DEFAULT_FORMAT_DATE_TIME_PROPS
) => {
  return date.toLocaleDateString(locale, {
    ...DEFAULT_FORMAT_DATE_TIME_PROPS,
    ...options,
  });
};
