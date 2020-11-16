const getAnswerStackOverflow = (rootElement) => {
	// Get all answers
	const answerElements = Array.from(
		rootElement.querySelector("#answers").querySelectorAll(".answer")
	);

	// Function to get score from an answer
	const getScore = (answer) => {
		const voteCount = answer.querySelector(".js-vote-count");
		return parseInt(voteCount.textContent);
	};

	// Get the score for each answer, and reduce to find the highest rated answer
	const bestAnswerElement = answerElements
		.map((answer) => ({
			answer,
			score: getScore(answer),
		}))
		.reduce((a1, a2) => (a1.score >= a2.score ? a1 : a2));

	// Return the answer element
	return bestAnswerElement.answer;
};

const getAnswerGitHub = (rootElement) => {
	return "fuck off";
};

const getSite = () => {
	if (window.location.host.includes("stackoverflow")) {
		return 'stackoverflow'; getAnswerStackOverflow(rootElement);
	}
	if (window.location.host.includes("github")) {
		return 'github';
	}
}

// Gets the most popular answer on a supported page
const getAnswer = (site) => {
	const rootElement = document.documentElement;

	switch (site) {
		case 'stackoverflow': return getAnswerStackOverflow(rootElement);
		case 'github': return getAnswerGitHub(rootElement);
		default: return null;
	}
};


chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function () {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			chrome.storage.sync.get(['autoScroll'], function (items) {

				const site = getSite(window.location);
				const autoScroll = items.autoScroll;
				const autoScrollEnabled = autoScroll[site];

				if (autoScrollEnabled) {
					scrollToAnswer(site);
				}
			});
		}
	}, 10);
});

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg) {
	// If the received message has the expected format...
	if (msg.text === "icon_click") {
		const site = getSite(window.location);
		scrollToAnswer(site);
	}
});

const scrollToAnswer = (site) => {
	const answer = getAnswer(site);
	answer.scrollIntoView({ behavior: "smooth", block: "start" });
}
