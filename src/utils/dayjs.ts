import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(LocalizedFormat);

export const date = (d: any, fmt = 'YYYY-MM-DD') => {
  let str = '-';
  const dayObject = dayjs(d);
  if (d && dayObject.isValid()) {
    str = dayObject.format(fmt);
  }
  return str;
};

export const time = (d: any, fmt = 'YYYY-MM-DD HH:mm:ss') => date(d, fmt);

export const minute = (d: any, fmt = 'YYYY-MM-DD HH:mm') => date(d, fmt);

export const second = (d: any, fmt = 'HH:mm:ss') => date(d, fmt);

export const month = (d: any, fmt = 'YYYY-MM') => date(d, fmt);

export const day = (d: any, fmt = 'MM/DD') => date(d, fmt);

export const hour = (d: any, fmt = 'HH:mm') => date(d, fmt);

export default dayjs;
