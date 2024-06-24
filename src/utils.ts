import React, {useCallback, useEffect, useState} from "react";
import {lookupDetails, MovieDetails, SeriesDetails} from "./api/details";
import {TvSeriesSeason} from "./tmdb/types";

export const formatTime = (minutes: number | undefined) => {
  if (minutes === undefined || isNaN(minutes)) return "?";
  const hours = Math.floor(minutes / 60.0);
  minutes %= 60;
  return (hours > 0 ? (hours.toFixed(0) + "h ") : "") + minutes.toFixed(0).padStart(2, "0") + "m";
};

export const shareAnonymously = (items: Item[]) => {
  const url = `${window.location.origin}/raw?${encodeItems(items)}`;
  shareUrl(url);
};
export const shareAccount = (id: string) => {
  const url = `${window.location.origin}/@${id}`;
  shareUrl(url);
};
export const shareUrl = (url: string) => {
  if (navigator.share) {
    navigator.share({
      title: "check your wasted time watching series",
      url: url,
    })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    navigator.clipboard.writeText(url)
      .then(() => console.log("Successful copy"))
      .catch((error) => console.log("Error copying", error));
  }
};

export const isValidSeason = (season: TvSeriesSeason): boolean => {
  return season.name !== "Specials" && season.episode_count > 0 && season.air_date !== undefined && Date.parse(season.air_date) < Date.now();
};

export interface Item {
  id: number;
  series: boolean; // movie otherwise
  times: number[]; // array for seasons
}

const digit = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const toB64 = (x: number) => x.toString(2).split(/(?=(?:.{6})+(?!.))/g).map(v => digit[parseInt(v, 2)]).join("");
const fromB64 = (x: string) => x.split("").reduce((s, v) => s * 64 + digit.indexOf(v), 0);

export const timesOf = (time: number | undefined) => time === undefined || time === null ? 1 : time;

const arrToB64 = (arr: number[]) => {
  let out = "";

  let stack = [];
  let cursor, counter = 0;
  for (let i = 0; i <= arr.length; i++) {
    if (timesOf(arr[i]) !== cursor || i === arr.length) {
      if (i !== 0) stack.push([cursor as number, counter]);
      cursor = timesOf(arr[i]);
      counter = 1;
      continue;
    }

    counter++;
  }

  for (let [number, counter] of stack) {
    out += toB64(number) + toB64(counter);
  }
  return out;
};
const arrFromB64 = (x: string) => {
  const split = x.split("");
  const arr: number[] = [];
  for (let i = 0; i < split.length; i += 2) {
    const number = fromB64(split[i]);
    const counter = fromB64(split[i + 1]);
    for (let j = 0; j < counter; j++) {
      arr.push(number);
    }
  }
  return arr;
};

export const encodeItems = (items: Item[]): string => {
  let out = "";
  for (let item of items) {
    out += toB64(item.id) + (item.times.length === 0 ? "" : "*" + arrToB64(item.times)) + (item.series ? ":" : ".");
  }
  return out;
};
export const decodeItems = (str: string): Item[] => {
  const arr: Item[] = [];
  for (let i = 0; i < str.length; i++) {
    const t1 = str.indexOf(":", i);
    const t2 = str.indexOf(".", i);
    const terminator = t1 === -1 ? t2 : t2 === -1 ? t1 : Math.min(t1, t2);
    if (terminator === -1) break;

    const sequence = str.substring(i, terminator);

    const split = sequence.split("*");
    const id = fromB64(split[0]);
    const times = split.length > 1 ? arrFromB64(split[1]) : [];

    const series = str.at(terminator) === ":";

    arr.push({id: id, times: times, series: series});
    i = terminator;
  }
  return arr;
};

export const useForceUpdate = (): [number, () => void] => {
  const [updater, setUpdate] = React.useState(0);
  const forceUpdate = () => setUpdate(prev => prev + 1);
  return [updater, forceUpdate];
};

export const mergeItemSets = (itemSet1: Item[], itemSet2: Item[]): Item[] => {
  const newItemSet: Item[] = [];

  itemSet1.forEach(item => {

    let newItem = {...item};

    console.log(newItem);

    let foundSameItem = itemSet2.find(item2 => item2.id === item.id);
    console.log(foundSameItem);

    if (foundSameItem) {

      for (let i = 0; i < Math.max(item.times.length, foundSameItem.times.length); i++) {
        const value1 = item.times[i] || 0;
        const value2 = foundSameItem.times[i] || 0;

        newItem.times[i] = Math.max(value1, value2);
        console.log("Found biggest number for times " + i + " which is " + Math.max(value1, value2));
      }

    }
    newItemSet.push(newItem);

  });

  itemSet2.forEach(item => {
    if (!newItemSet.some(item1 => item1.id === item.id)) {
      newItemSet.push({...item});
    }
  });

  return newItemSet;
};

export const findItemById = (items: Item[], id: number, series: boolean): Item | undefined => items.find(item => item.id === id && item.series === series);

export type CompiledValue = { item: Item, details: SeriesDetails | MovieDetails, runtime: number }

type CalculateProps = {
  values: CompiledValue[] | undefined,
  time: number,
  finished: boolean,
}

export const useCalculateSummary = (items: Item[]): CalculateProps => {
  const [values, setValues] = useState<CompiledValue[] | undefined>(undefined);
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);

  const calculateTime = useCallback(() => {
    console.log("RECALC");

    const promises = items.map(async (item): Promise<CompiledValue> => {
      const details = await lookupDetails(item);
      let runtime = 0;
      if (item.series) {
        const series = details as SeriesDetails;
        for (let season of series.seasons) {
          runtime += season.runtime * timesOf(item.times[season.number]);
        }
      } else {
        runtime = (details as MovieDetails).runtime * timesOf(item.times[0]);
      }
      return {item, details, runtime};
    });
    Promise.all(promises).then(values => {
      setValues(values);
      setTime(values.reduce((prev, {runtime}) => prev + runtime, 0));
      setFinished(true);
    });
  }, [items, setValues, setTime, setFinished]);

  useEffect(() => {
    console.log("EFFECRT°!");
    calculateTime();
  }, [calculateTime, items]);

  return {finished, time, values};
};
