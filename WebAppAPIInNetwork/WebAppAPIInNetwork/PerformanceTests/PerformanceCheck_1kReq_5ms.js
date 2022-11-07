import http from 'k6/http';
import { check, group, sleep, fail } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import exec from 'k6/execution';

// local execution with output to cloud
// https://k6.io/docs/results-output/real-time/cloud/
// https://app.k6.io/account/api-token
// k6 login cloud --token <YOUR_K6_CLOUD_API_TOKEN>
// k6 run --out cloud script.js

// Mission critical 1-10ms (6ms)
// Web <100-200 ms

const DEBUG = true;
var start = Date.now();
var startErr = Date.now();
const apiURL = 'https://appsvcperftuning.azurewebsites.net/api/simpeApiCall';
const apiGUID = 'http://localhost:48891/api/GUID';
const PiGUID = 'http://localhost:48891/api/Pi';
const RandomStringGUID = 'http://localhost:48891/api/RandomString';
const SimpleApiGUID = 'http://localhost:48891/api/SimpleApi';

export const options = {
	discardResponseBodies: true,
	thresholds: {
		"http_req_duration": [{
			threshold: "p(95)<6"
		}],
		"checks": [{
			threshold: "rate>0.9"
		}]
	},
	scenarios: {
		perfTest_scenario: {
			executor: 'ramping-arrival-rate',
			startRate: 5,
			timeUnit: '1s',
			preAllocatedVUs: 500,
			maxVUs: 500,
			gracefulStop: '5s',
			stages: [
				{ duration: '15s', target: 40 }, // Warmup
				{ duration: '10s', target: 100 },
				{ duration: '10s', target: 250 },
				{ duration: '10s', target: 500 },
				{ duration: '10s', target: 750 },
				{ duration: '10s', target: 1000 },
				{ duration: '30s', target: 1000 },
				{ duration: '10s', target: 1500 },
				{ duration: '5s', target: 1000 },
				{ duration: '30s', target: 1000 }
			]
		},
	},
};

function DebugOrLog(textToLog) {
	if (DEBUG) {
		var millis = Date.now() - start; // we get the ms ellapsed from the start of the test
		var time = Math.floor(millis / 1000); // in seconds
		// console.log(`${time}se: ${textToLog}`); // se = Seconds elapsed
		console.log(`${textToLog}`);
	}
}

export default function () {
	//let result = http.get(apiGUID);
	let result = http.get(PiGUID);


	const isSuccessfulRequest = check(result, {
		"Document request succeed": () => result.status == 200
	});

	if (isSuccessfulRequest) {
		var millis = Date.now() - start;
		var time = Math.floor(millis / 1000); // in seconds

		// if 5 seconds have passed, we print a heartbeat with the rate and duration
		//if (time >= 5) {
		//	DebugOrLog(`Heartbeat Active VUs: ${exec.instance.vusActive}`);
		//	DebugOrLog(`Current Duration in ms: ${result.timings.duration}`);
		//	start = Date.now();
        //}
	}
	else {
		var millisErr = Date.now() - startErr;
		var timeErr = Math.floor(millisErr / 1000);
		if (timeErr >= 5) {
			DebugOrLog(`Err Heartbeat Active VUs: ${exec.instance.vusActive}`);
			DebugOrLog(`Err Current Duration in ms: ${result.timings.duration}`);
			startErr = Date.now();
        }

		//fail('status code was *not* 200');
	}

	check(result, {
		"Status is 200": (r) => r.status == 200
	});
}