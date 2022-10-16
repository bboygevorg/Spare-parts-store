import {useState, useEffect} from 'react'; 
import { useSelector } from 'react-redux';

const NOTE_KEY = 'legal_info_text_short';
const useCalculateNotes = () => {
    const [notes, setNotes] = useState([])
    const firebaseObj = useSelector(state => state.firebase.config);
    useEffect(() => {
        setNotes(firebaseObj[NOTE_KEY].split('||'))
    }, [])

    return {notes}
}

export default useCalculateNotes;

