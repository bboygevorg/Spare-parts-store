import { createActions } from "redux-actions";
import { phrases } from '../../components/dataLoaders';

export const actions = createActions({
    SET_CURRENT_LANGUAGE: null,
    SET_TRANSLATION: null
});

export const getTranslationsAction = ( getTranslations ) => {
    return (dispatch, getState) => {
        const code = getState().language.currentLanguage;
        if(code) {
            getTranslations({variables: {
                            phrases,
                            storeCode: code
                        }
                }).then(res => {
                    localStorage.setItem('language', code)
                    dispatch(actions.setCurrentLanguage(code))
                    dispatch(actions.setTranslation(res.data.getTranslations));
                })
                .catch(err => console.log(err.message));
        }
    };
};