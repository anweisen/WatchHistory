import {faCoins, faFilm, faInfoCircle, faNotEqual, faTv} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext, useEffect, useRef, useState} from "react";
import {CompiledValue, formatTime, Item} from "../../utils";
import {ModalContext} from "../context/ModalContext";
import WageModal from "../ui/WageModal";
import Card from "./Card";
import {SeriesDetails} from "../../api/details";
import "./NewClock.scss";

const NewClock = ({values, finished, time, openMenu, wage, setWage, currency, setCurrency}: {
  values: CompiledValue[] | undefined,
  finished: boolean,
  time: number,
  openMenu: (item: Item) => void,
  wage: number,
  setWage: (v: number) => void,
  currency: string,
  setCurrency: (v: string) => void
}) => {
  return (
    <div className={"NewClock"}>
      <Card values={values} finished={finished} openMenu={openMenu}/>
      <ClockFace time={time}/>
      <InfoList time={time} values={values} wage={wage} setWage={setWage} currency={currency} setCurrency={setCurrency}/>
    </div>
  );
};

const ClockFace = ({time}: { time: number }) => {
  const [displayTime, setDisplayTime] = useState(0);
  const timeDisplayRef = useRef<HTMLParagraphElement>(null)
  const [timeWidth, setTimeWidth] = useState<number>();

  function ease(t: number) {
    return 1 - Math.pow(1 - t, 5);
  }
  const getTextWidth = (text: string, font: string): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width;
    }
    return 0;
  };

  useEffect(() => {
    const diff = time - displayTime;
    if (diff === 0) return;

    if (timeDisplayRef.current) {
      let computedStyle = window.getComputedStyle(timeDisplayRef.current);
      let width = getTextWidth(formatTime(time), `${computedStyle.fontSize} ${computedStyle.fontFamily}`)
      setTimeWidth(width);
    }

    let progress = 0;
    const intervalId = setInterval(() => {
      progress += 2;
      if (progress >= 100) {
        clearInterval(intervalId);
        setDisplayTime(time);
        setTimeWidth(undefined); // allow resizing
        return;
      }
      setDisplayTime(displayTime + diff * ease(progress / 100));
    }, 1000 / 20);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [time]);

  return (
    <div className={"ClockFace"}>
      <div className={"Text"}>
        <p className={"Time"} ref={timeDisplayRef} style={{width: timeWidth && `${timeWidth}px`}}>{formatTime(displayTime)}</p>
        <div className={"SubTime"} style={{width: timeWidth && `${timeWidth}px`}}>
          <p className={"Or"}>OR</p>
          <p className={"Days"}>{(Math.floor(displayTime / 60 / 24 * 10) / 10).toFixed(1)} days</p>
        </div>
        <div className={"Year"}>{(displayTime / 60 / 24 / 365 * 100).toFixed(2)}% of a year</div>
      </div>
      <div className={"Visual"}>
        {Array(31).fill(0).map((_, index) => (
          <div key={index} className={Math.floor(time / 60 / 24) > index ? "Filled" : ""}/>
        ))}
      </div>
    </div>
  );
};

const InfoList = ({time, wage, setWage, currency, setCurrency, values}: {
  time: number
  wage: number,
  setWage: (v: number) => void,
  currency: string,
  setCurrency: (v: string) => void,
  values: CompiledValue[] | undefined
}) => {
  const {openModal} = useContext(ModalContext);
  const [calculated, setCalculated] = useState<{ series: number, movies: number, total: number, seasons: number, episodes: number }>();

  useEffect(() => {
    if (values === undefined) return;
    const series = values.filter(value => value.item.series);
    const seasons = series.reduce((prev, cur) => prev + (cur.details as SeriesDetails).seasons.length, 0);
    const episodes = series.reduce((prev, cur) => prev + (cur.details as SeriesDetails).seasons.reduce((prev, cur) => prev + cur.episode_count, 0), 0);
    setCalculated({series: series.length, movies: values.length - series.length, total: values.length || 1, episodes: episodes, seasons: seasons});
  }, [values]);

  return (
    <div className={"InfoList"}>
      <div className={"WageDisplay"}>
        <div className={"Text"}>
          <p className={"WageEarned"}>{(time / 60 * (wage <= 0 ? 12 : wage)).toLocaleString("en-US", {maximumFractionDigits: 0})}{currency}</p>
          <p className={"WageAmount"} onClick={() => openModal(<WageModal wage={wage} setWage={setWage} currency={currency} setCurrency={setCurrency}
                                                                          defaultWage={12}
                                                                          defaultCurrency={"€"}/>)}>at {wage <= 0 ? "minimum wage" : wage + currency + "/h"}</p>
        </div>
        <div className={"Icons"}>
          <FontAwesomeIcon icon={faCoins}/>
          <FontAwesomeIcon icon={faNotEqual}/>
          <FontAwesomeIcon icon={faFilm}/>
        </div>
      </div>

      {calculated && <div className={"Infos"}>
        <div className={"Entry"}>
          <FontAwesomeIcon icon={faFilm}/>
          <p>{calculated.movies} movies</p>
          <div className={"Bar"} style={{width: `${calculated.movies / calculated.total * 100}%`}}/>
        </div>
        <div className={"Entry"}>
          <FontAwesomeIcon icon={faTv}/>
          <p>{calculated.series} series</p>
          <div className={"Bar"} style={{width: `${calculated.series / calculated.total * 100}%`}}/>
        </div>
        <div className={"Entry"}>
          <FontAwesomeIcon icon={faInfoCircle}/>
          <span>
            <p>{calculated.episodes} episodes</p>
            <p className={"Seasons"}>{calculated.seasons} seasons</p>
          </span>
          <div className={"Bars"}>
            <div className={"Bar"} style={{width: `${calculated.episodes / ((calculated.seasons + calculated.episodes) || 1) * 100}%`}}/>
            <div className={"Bar"} style={{width: `${calculated.seasons / ((calculated.seasons + calculated.episodes) || 1) * 100}%`}}/>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default NewClock;