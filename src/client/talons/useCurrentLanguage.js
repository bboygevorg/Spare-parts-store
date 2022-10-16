import { useMemo } from 'react';
import { LANGUAGEKEYS } from 'conf/consts';
import { useSelector } from "react-redux";

const useCurrentLanguage = () => {
    const currentLanguage = useSelector(state => state.language.currentLanguage);

    const currentLanguageName = useMemo(() => {
        const currentLan = LANGUAGEKEYS.find(language => language.code === currentLanguage);
        if(currentLan && currentLan.name) {
          return currentLan.name;
        }
    }, [currentLanguage, LANGUAGEKEYS]);
    return { 
        currentLanguageName
    }
}

export default useCurrentLanguage;