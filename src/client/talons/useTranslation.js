import { useSelector } from 'react-redux';

const useTranslation = () => {
    const translations = useSelector(state => state.language.data);

    const __ = (value) => {
		if(!value || !translations.length) {
			return '';
		}
		else {
			const translation = translations.find(el => el.original === value);
			if(translation) {
				return translation.translation;
			}
			else {
				return '';
			}
		}
	}

    return __;
}

export default useTranslation;