import {IconDefinition} from "@fortawesome/free-brands-svg-icons";
import {faCaretDown, faChartSimple, faCircleExclamation, faRepeat, faStopwatch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {FunctionComponent, useEffect, useState} from "react";
import {MovieDetails, TvSeriesDetails} from "../../tmdb/types";
import {provideImageUrl} from "../../tmdb/api";
import {CompiledValue, formatTime, Item} from "../../utils";
import Loader from "../Loader";
import "./Card.scss";

const averageRewatch = (item: Item) => {
  if (item.times.length === 0) return 1;
  const sum = item.times.reduce((prev, cur) => prev + cur, 0);
  const length = item.times[0] === 0 ? item.times.length - 1 : item.times.length;
  return Math.max(1, sum / length);
};
const averageRewatchFormat = (item: Item) => {
  const format = averageRewatch(item).toFixed(1);
  return format.endsWith("0") ? format.slice(0, -2) : format;
};

const LongestSum = ({values, openMenu}: CardProps) => {
  const [value, setValue] = useState<CompiledValue>();
  useEffect(() => {
    const copy = [...values || []];
    copy.sort((a, b) => b.runtime - a.runtime);
    setValue(copy.at(0)!!);
  }, [values]);

  if (value === undefined) return <LoadingCardContent/>;
  return <ExhibitionCard value={value} openMenu={openMenu}/>;
};

const MostWatched = ({values, openMenu}: CardProps) => {
  const [value, setValue] = useState<CompiledValue>();
  useEffect(() => {
    const copy = [...values || []];
    copy.sort((a, b) => averageRewatch(b.item) - averageRewatch(a.item));
    setValue(copy.at(0)!!);
  }, [values]);

  if (value === undefined) return <LoadingCardContent/>;
  return <ExhibitionCard value={value} openMenu={openMenu}/>;
};

const GenresCard = ({values}: CardProps) => {
  const [value, setValue] = useState<[string, number][]>();
  useEffect(() => {
    const genres = values.filter(value => value.details !== undefined)
      .map(value => value.details?.genres || [])
      .reduce<Record<string, number>>((prev, curr) => {
        for (let genre of curr) {
          prev[genre.name] = (prev[genre.name] || 0) + 1;
        }
        return prev;
      }, {});
    const sorted = Object.entries(genres).sort(([_, a], [__, b]) => b - a);
    setValue(sorted);
  }, [values]);

  if (value === undefined) return <LoadingCardContent/>;

  return (
    <div className={"FavGenre CardContent"}>
      {value?.filter((_, index) => index < 5).map(([genre, amount], index) => (
        <div className={"Genre"} key={index}>
          <div className={"Place"}>{index + 1}</div>
          <p className={"Title"}>{genre}</p>
          <p className={"Amount"}>{amount}</p>
        </div>
      ))}
    </div>
  );
};

const ExhibitionCard = ({value, openMenu}: { value: CompiledValue, openMenu: (item: Item) => void }) => {
  return (
    <div className={"CardContent Exhibition"}>
      <span className={"Info"}>
        <div className={"Stats"}>
          <div><FontAwesomeIcon icon={faStopwatch}/> <p>{formatTime(value.runtime)}</p></div>
          <div><FontAwesomeIcon icon={faRepeat}/> <p>{averageRewatchFormat(value.item)}x</p></div>
        </div>
        <div>
          <p className={"Title"}>{(value.details as TvSeriesDetails).name || (value.details as MovieDetails).title}</p>
          <p className={"Tagline"}>{(value.details as TvSeriesDetails).tagline || (value.details as TvSeriesDetails).original_name || (value.details as MovieDetails).original_title}</p>
        </div>
      </span>
      <img src={provideImageUrl((value.details as TvSeriesDetails).poster_path)} alt={""} onClick={() => openMenu(value.item)}/>
    </div>
  );
};

const LoadingCardContent = () => (
  <div className={"CardContent NoAnimation"}>
    <Loader/>
  </div>
);

const EmptyCardContent = () => (
  <div className={"CardContent Empty NoAnimation"}>
    <FontAwesomeIcon icon={faCircleExclamation}/>
    <p>seems like you haven't watched anything</p>
  </div>
);

type CardProps = {
  values: CompiledValue[],
  openMenu: (item: Item) => void
}
type CardType = {
  name: string,
  icon: IconDefinition,
  Component: FunctionComponent<CardProps>
}
const CardTypes: CardType[] = [
  {
    name: "longest sum",
    icon: faChartSimple,
    Component: LongestSum
  },
  {
    name: "most watched",
    icon: faChartSimple,
    Component: MostWatched
  },
  {
    name: "fav genres",
    icon: faChartSimple,
    Component: GenresCard
  }
];

const Card = ({values, openMenu, finished}: { values: CompiledValue[] | undefined, openMenu: (item: Item) => void, finished: boolean }) => {
  const [selected, setSelected] = useState(0);
  const [dropdown, setDropdown] = useState(false);
  const Component = CardTypes[selected].Component;

  useEffect(() => {
    if (dropdown || !finished || values?.length === 0) return;
    const timerId = setInterval(() => {
      setSelected(prev => (prev + 1 >= CardTypes.length) ? 0 :  prev + 1)
    }, 8_000);
    return () => clearInterval(timerId);
  }, [dropdown, finished, values]);

  return (
    <div className={"Card"}>

      <div className={"Select" + (dropdown ? " Expanded" : "")}>
        <div className={"CurrentSelection"} onClick={() => setDropdown(prev => !prev)}>
          <FontAwesomeIcon icon={CardTypes[selected].icon}/>
          <p>{CardTypes[selected].name}</p>
          <FontAwesomeIcon className={"Arrow"} icon={faCaretDown}/>
        </div>

        <div className={"Dropdown"}>
          {CardTypes
            .filter((_, index) => index !== selected)
            .map((value, index) => (
              <div className={"Entry"} key={index} onClick={() => {
                setSelected(index + (selected <= index ? 1 : 0));
                setDropdown(false);
              }}>
                <FontAwesomeIcon icon={value.icon}/>
                <p>{value.name}</p>
              </div>
            ))}
        </div>

        {!dropdown && finished && values && values.length > 0 && <div className={"Indicator"} key={selected + "" + values.length}/>}
      </div>

      {!finished || values === undefined
        ? <LoadingCardContent/>
        : values.length === 0
          ? <EmptyCardContent/>
          : <Component values={values} openMenu={openMenu}/>
      }

    </div>
  );
};

export default Card;