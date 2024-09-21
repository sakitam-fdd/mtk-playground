import { isUndefined, isNull, isNaN } from 'lodash-es';

export function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    if (isUndefined(v.rank) || isNull(v.rank) || isNaN(v.rank)) v.rank = index + 1;
  });

  return arr.sort((a: { rank: number }, b: { rank: number }) => a.rank - b.rank);
}
