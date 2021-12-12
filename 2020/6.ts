import { intersect, read, sum } from '@core/utilityBelt';

async function main1() {
  const text = await read('./6.txt');
  const groupAnswers = text.split('\n\n').map((group) => {
    return new Set(group.split('\n').join('').split(''));
  });
  const countSum = sum(groupAnswers.map((ga) => ga.size));

  console.log(countSum);
}

async function main2() {
  const text = await read('./6.txt');
  const groupIntersections = text.split('\n\n').map((group) => {
    return intersect(...group.split('\n').map((row) => new Set(row.split(''))));
  });
  const countSum = sum(groupIntersections.map((gi) => gi.size));
  console.log(countSum);
}

main2()