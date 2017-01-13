const hasApp = name => {
	try {
		Application(name);
		return true;
	} catch (err) {
		return false;
	}
};

const hasTabs = window => {
	try {
		window.tabs();
		return true;
	} catch (err) {
		return false;
	}
};

const getAppWindows = app => app
	.windows()
	.filter(window => window.name() && hasTabs(window))
	.map(window => ({
		app,
		window
	}));

const isTabValid = tab => {
	try {
		return tab.url().length > 0;
	} catch (err) {
		return false;
	}
};

const getAppWindowTabs = item => item.window.tabs().filter(isTabValid)
	.map((tab, tabIndex) => ({
		app: item.app,
		window: item.window,
		tab,
		tabIndex: tabIndex + 1
	}));

const getTabId = tab => {
	try {
		return tab.id();
	} catch (err) {
		return null;
	}
};

const getAppWindowTabData = item => ({
	title: item.tab.name(),
	subtitle: item.tab.url(),
	arg: encodeURI(JSON.stringify({
		appName: item.app.name(),
		windowId: item.window.id(),
		tabId: getTabId(item.tab),
		tabIndex: item.tabIndex
	})),
	icon: {
		path: './icons/' + item.app.name() + '.png'
	}
});

const matches = (item, query) => {
	return item.title.toLowerCase().normalize().includes(query) ||
		item.subtitle.toLowerCase().normalize().includes(query);
};

function run(argv) {
	const query = argv[0].toLowerCase().normalize();
	const tabs = ['Safari', 'Google Chrome']
		.filter(hasApp)
		.map(name => Application(name))
		.map(getAppWindows)
		.reduce((a, b) => a.concat(b), [])
		.map(getAppWindowTabs)
		.reduce((a, b) => a.concat(b), [])
		.map(getAppWindowTabData)
		.filter(item => matches(item, query));
	return JSON.stringify({
		items: tabs
	});
}

