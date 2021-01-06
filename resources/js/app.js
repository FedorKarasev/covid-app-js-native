/* ---------------------------------------------- */
/*            CODE EXPLAINED TUTORIALS            */
/*         www.youtube.com/CodeExplained          */
/* ---------------------------------------------- */

//SELECT ALL ELEMENTS

const countryNameElement = document.querySelector('.country .name');
const totalCasesElement = document.querySelector('.total-cases .value');
const NewCasesElement = document.querySelector('.total-cases .new-value');
const RecoveredElement = document.querySelector('.recovered .value');
const NewRecoveredElement = document.querySelector('.recovered .new-value');
const DeathsElement = document.querySelector('.deaths .value');
const NewDeathsElement = document.querySelector('.deaths .new-value');

const ctx = document.getElementById('axes-linear-chart').getContext('2d');

// APP VARIABLES

let appData = [],
	casesList = [],
	recoveredList = [],
	deathsList = [],
	dates = [];
	formatedDates = [];

// GET USERS COUNTRY CODE

let countryCode = geoplugin_countryCode();
let userCountry;

country_list.forEach(country => {

	if (country.code == countryCode) {
		userCountry = country.name;
	}

});

/* ---------------------------------------------- */
/*                     FETCH                      */
/* ---------------------------------------------- */


function fetchData(country) {

	countryNameElement.innerHTML = 'Loading...';
	userCountry = country;

	appData = [],
	casesList = [],
	recoveredList = [],
	deathsList = [],
	dates = [];
	formatedDates = [];

	const api_fetch = async (country) => {

		await fetch(`https://api.covid19api.com/total/country/${userCountry}/status/confirmed`)
		.then(response => response.json())
		.then(data => {
			console.log(data)
			data.forEach(entry => {
				dates.push(entry.Date);
				casesList.push(entry.Cases);
			});
		});
	
		await fetch(`https://api.covid19api.com/total/country/${userCountry}/status/recovered`)
		.then(response => response.json())
		.then(data => {
			data.forEach(entry => {
				recoveredList.push(entry.Cases);
			});
		});
	
		await fetch(`https://api.covid19api.com/total/country/${userCountry}/status/deaths`)
		.then(response => response.json())
		.then(data => {
			data.forEach(entry => {
				deathsList.push(entry.Cases);
			});
		});

		dates.forEach((date) => {
			formatedDates.push(formatDate(date));
		});

		updateUI();
	}

	api_fetch(userCountry);

}

fetchData(userCountry);

// UPDATING UI

function updateUI() {
	updateStats();
	axesLinearChart();
}

function updateStats() {

	console.log(userCountry)

	countryNameElement.innerHTML = userCountry;

	const totalCases = casesList[casesList.length - 1];
	const newConfirmedCases = totalCases - casesList[casesList.length - 2];

	const totalRecovered = recoveredList[recoveredList.length - 1];
	const newRecovered = totalRecovered - recoveredList[recoveredList.length - 2];

	const totalDeaths = deathsList[deathsList.length - 1];
	const newDeaths = totalDeaths - deathsList[deathsList.length - 2];

	totalCasesElement.innerHTML = totalCases;
	NewCasesElement.innerHTML = `+${newConfirmedCases}` || 0;

	RecoveredElement.innerHTML = totalRecovered;
	NewRecoveredElement.innerHTML = `+${newRecovered}` || 0;

	DeathsElement.innerHTML = totalDeaths;
	NewDeathsElement.innerHTML = `+${newDeaths}` || 0;

}

// Update chart

let myChart;

function axesLinearChart() {

	if(myChart) {
		myChart.destroy();
	}

	myChart = new Chart(ctx, {
		type: 'line',
		data: {
			datasets: [{
					label: 'Cases',
					data: casesList,
					borderWidth: 1,
					borderColor: 'white',
					backgroundColor: 'white',
					fill: false,
				},
				{
					label: 'Recovered',
					data: recoveredList,
					borderWidth: 1,
					borderColor: '#009688',
					backgroundColor: '#009688',
					fill: false,
				},
				{
					label: 'Deaths',
					data: deathsList,
					borderWidth: 1,
					borderColor: '#f44336',
					backgroundColor: '#f44336',
					fill: false,
				},
			],
			labels: formatedDates,
		},
		options: {
			response: true,
			maintainAspectRatio: false,
		},
	});

}

const monthsNames = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
  ];

  function formatDate(dateString) {
	let date = new Date(dateString);
  
	return `${date.getDate()} ${monthsNames[date.getMonth() - 1]}`;
  }
  