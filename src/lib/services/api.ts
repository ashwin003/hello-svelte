import axios from 'axios';

const availableServers = [
	'https://at1.api.radio-browser.info/json/',
	'https://de1.api.radio-browser.info/json/',
	'https://nl1.api.radio-browser.info/json/'
];

const axiosAPI = axios.create({
	baseURL: availableServers[Math.floor(Math.random() * availableServers.length)]
});

const apiRequest = <T>(method: string, url: string) => {
	return axiosAPI({ method, url })
		.then((res) => Promise.resolve<T>(res.data))
		.catch((err) => Promise.reject(err));
};

export const get = <T>(url: string) => apiRequest<T>('get', url);
