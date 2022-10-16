import { useSelector } from 'react-redux';

export const useLink = () => {
    const currentLanguage  = useSelector(state => state.language.currentLanguage);

    return {
        currentLanguage
    }
}