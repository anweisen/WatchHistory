import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight, faCloudArrowDown} from "@fortawesome/free-solid-svg-icons";
import {useEffect, useState} from "react";
import "./InstallButton.scss";

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(Boolean(localStorage.getItem("installprompt")));

  useEffect(() => {
    const handle = (event: Event) => setDeferredPrompt(event);
    window.addEventListener("beforeinstallprompt", handle);
    return () => window.removeEventListener("beforeinstallprompt", handle);
  }, []);
  useEffect(() => {
    const handle = () => setIsInstalled(true);
    window.addEventListener("appinstalled", handle);
    return () => window.removeEventListener("appinstalled", handle);
  }, []);

  const handleInstallClick = async () => {
    localStorage.setItem("installprompt", "true");
    setIsInstalled(true);

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const {outcome} = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    }
  };

  return (deferredPrompt && !isInstalled) ? (
    <div className={"InstallButton"} onClick={handleInstallClick}>
      <FontAwesomeIcon icon={faCloudArrowDown}/> install as an app
      <FontAwesomeIcon icon={faChevronRight}/>
    </div>
  ) : <></>;
};

export default InstallButton;