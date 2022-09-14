import useDimensions from 'react-cool-dimensions';
import { extent } from 'd3';
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  format
} from 'date-fns';

import { CHART_HEIGHT, DateSliderTimeDensity } from './constants';

const margin = { top: 0, right: 0, bottom: 0, left: 0 };

export function useChartDimensions() {
  const { observe, width: elementWidth } = useDimensions();

  const outerWidth = elementWidth > 0 ? elementWidth : 100;
  const outerHeight = CHART_HEIGHT - margin.top - margin.bottom;

  return {
    observe,
    // Dimensions of the wrapper.
    outerWidth,
    outerHeight,
    // Dimensions of the visualization.
    width: outerWidth - margin.left - margin.right,
    height: outerHeight - margin.top - margin.bottom,
    margin
  };
}

export function prepareDates(dates: Date[], timeDensityity: DateSliderTimeDensity) {
  const domain = extent<Date, Date>(dates, (d) => d) as Date[];

  const dateFormat = {
    day: 'yyyy-MM-dd',
    month: 'yyyy-MM',
    year: 'yyyy'
  }[timeDensityity];

  const intervalFn = {
    day: eachDayOfInterval,
    month: eachMonthOfInterval,
    year: eachYearOfInterval
  }[timeDensityity];

  const searchStrs = dates.map((d) => format(d, dateFormat));

  const allDates = intervalFn({
    start: domain[0],
    end: domain.last
  });

  return allDates.map((d) => ({
    date: d,
    hasData: searchStrs.includes(format(d, dateFormat))
  }));
}

export function getZoomTranslateExtent(
  data,
  xScale
): [[number, number], [number, number]] {
  const lastDate = data.last.date;
  return [
    [0, 0],
    [xScale(lastDate) + 16, 0]
  ];
}
