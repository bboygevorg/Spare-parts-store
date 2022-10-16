export const isOnProduction = () => {
    return process.env.REACT_APP_BASE_URL === 'https://www.buildclub.com/';
}