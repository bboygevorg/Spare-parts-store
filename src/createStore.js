import { createStore, applyMiddleware } from 'redux';
import reducers from 'store/reducers';
import thunk from 'redux-thunk';

export default () => {
    const store = createStore(reducers, {}, applyMiddleware(thunk));
    return store;
}