import axios from 'axios';
import useLocalStorage from './useLocalStorage';

// custom hook to pull data from API with axios
function useAxios(keyValLS, baseUrl) {
	const [responses, setResponses] = useLocalStorage(keyValLS);

	// pulling response data from api
	const addResponseData = async (
		formatter = (data) => data,
		restOfUrl = ''
	) => {
		const response = await axios.get(`${baseUrl}${restOfUrl}`);
		setResponses((data) => [...data, formatter(response.data)]);
	};

	// clearing data from board/local storage
	const clearResponses = () => setResponses([]);

	return [responses, addResponseData, clearResponses];
}

export default useAxios;
