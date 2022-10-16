import React, {useState, useEffect} from "react";
import packageJson from "../../package.json";
import dayjs from "dayjs";

const buildDateGreaterThan = (latestDate, currentDate) => {
    const djsLatestDateTime = dayjs(latestDate);
    const djsCurrentDateTime = dayjs(currentDate);

    if(djsLatestDateTime.isAfter(djsCurrentDateTime)) {
        return true;
    } else {
        return false;
    }
};

function withClearCache(Component) {
    function ClearCacheComponent(props) {
        const [isLatestBuildDate, setIsLatestBuildDate] = useState(false);

        useEffect(() => {
            fetch("/meta.json")
                .then(response => response.json())
                .then(meta => {
                    const latestVersionDate = meta.buildDate;
                    const currentVersionDate = packageJson.buildDate;

                    const shouldForceRefresh = buildDateGreaterThan(latestVersionDate, currentVersionDate);
                    if(shouldForceRefresh) {
                        setIsLatestBuildDate(false);
                        refreshCacheAndReload();
                    } else {
                        setIsLatestBuildDate(true);
                    }
                });
        }, []);

        const refreshCacheAndReload = () => {
            if(caches) {
                // Service worker cahce should be cleared with caches.delete()
                caches.keys().then((names) => {
                    for(const name of names) {
                        caches.delete(name);
                    }
                });
            }
            //delete browser cache and hard reload
            window.location.reload();
        };
        return (
            <React.Fragment>
                {isLatestBuildDate ? <Component {...props} /> : null}
            </React.Fragment>
        );
    }

    return ClearCacheComponent;
}

export default withClearCache;