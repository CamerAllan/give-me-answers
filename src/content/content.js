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
	return bestAnswerElement;
};

const getAnswerGitHub = (rootElement) => {
	// Get all answers
	const answerElements = Array.from(
		rootElement.querySelector(".js-issue-timeline-container").querySelectorAll(".js-comment-container")
	);

	const getNumReacts = (element) => {
		const numReacts = parseInt(element.textContent.replace(/\D/g, ''));
		return numReacts ? numReacts : 0;
	}

	// Function to get score from an answer
	const getScore = (answer) => {
		// Get all types of reaction
		const reacts = Array.from(answer.querySelectorAll(".reaction-summary-item"));
		const allReactsCount = reacts.map((r) => getNumReacts(r)).reduce((r1, r2) => r1 + r2, 0);
		return allReactsCount;
	};

	// Get the score for each answer, and reduce to find the highest rated answer
	const bestAnswerElement = answerElements
		.map((answer) => ({
			answer,
			score: getScore(answer),
		}))
		.reduce((a1, a2) => (a1.score >= a2.score ? a1 : a2));

	// Return the answer element
	return bestAnswerElement;
};

const getSite = () => {
	if (window.location.host.includes("stackoverflow")) {
		return 'stackoverflow';
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

const scrollToAnswer = (site) => {
	const result = getAnswer(site);
	result.answer.scrollIntoView({ behavior: "smooth", block: "start" });
}

chrome.runtime.onMessage.addListener(function (msg) {
	if (msg.text === "url_update") {
		var readyStateCheckInterval = setInterval(function () {
			if (document.readyState === "complete") {
				clearInterval(readyStateCheckInterval);
				chrome.storage.sync.get(['autoScroll'], function (items) {
					const site = getSite(window.location);
					const autoScroll = items.autoScroll;
					if (autoScroll) {
						const autoScrollEnabled = autoScroll[site];
						if (autoScrollEnabled) {
							scrollToAnswer(site);
						}
					}
				});
			}
		}, 10);
	}
});

chrome.runtime.onMessage.addListener(function (msg) {
	if (msg.text === "icon_click") {
		const site = getSite(window.location);
		scrollToAnswer(site);
	}
});

