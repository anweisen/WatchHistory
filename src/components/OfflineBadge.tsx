import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlane} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import "./OfflineBadge.scss";

const OfflineBadge = () => {
    const [offline, setOffline] = useState(false);
    const [progress, setProgress] = useState(false);

    useEffect(() => {
      const handler = (event: MessageEvent) => {
        if (event.data && event.data.type === "CACHE_HIT") {
          console.log("CACHE HIT on navigator.serviceWorker");
          setOffline(true);
        }
      };

      navigator.serviceWorker?.addEventListener("message", handler);
      return () => navigator.serviceWorker?.removeEventListener("message", handler);
    }, [setOffline]);

    useEffect(() => {
      const handle = () => {
        if (window.scrollY > 30) {
          setProgress(true);
        } else if (window.scrollY < 10) {
          setProgress(false);
        }
      };
      window.addEventListener("scroll", handle);
      return () => window.removeEventListener("scroll", handle);
    }, [setProgress]);

    return offline ? (
      <div className={"OfflineBadge" + (progress ? " Progressed" : "")}>
        <FontAwesomeIcon key={progress + ""} icon={faPlane}/> offline mode
        <p>your changes will be synced later</p>
      </div>
    ) : <></>;
  }
;

export default OfflineBadge;
