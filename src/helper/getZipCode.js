import axios from "axios";

export default async () => {
	return axios({
		type: "GET",
		url: `https://pro.ip-api.com/json?key=${process.env.IP_API_KEY}`,
		dataType: "json"}).then(function (response) {
		return response.data.zip ? response.data.zip : false
	}).catch((err) => {
		console.log(err);
	})
}