const getAnswerStackOverflow = (rootElement) => {
	const answerElements = Array.from(
		rootElement.querySelector('#answers').querySelectorAll('.answer')
	);

	const getScore = (answer) => {
		const voteCount = answer.querySelector('.js-vote-count');
		return parseInt(voteCount.textContent)
	}

	const bestAnswerElement = answerElements.map((answer) => ({
			answer,
			score: getScore(answer)
	})).reduce((a1, a2) => a1.score >= a2.score ? a1 : a2)

	return bestAnswerElement.answer;
}

const getAnswerGitHub = (rootElement) => {
	return 'fuck off'
}

const getAnswer = (location, document) => {
	const rootElement = document.documentElement;
	if (location.host.includes('stackoverflow')) {
		return getAnswerStackOverflow(rootElement);
	}
	if (location.host.includes('github')) {
		return getAnswerGitHub(rootElement);
	}
}

chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		const location = window.location;
		const answer = getAnswer(location, document);
		answer.scrollIntoView({behavior: "smooth", block: "start"});
	}
	}, 10);
});