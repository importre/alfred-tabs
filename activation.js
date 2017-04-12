const getTabId = tab => {
	try {
		return tab.id();
	} catch (err) {
		return null;
	}
};

function run(argv) {
	const item = JSON.parse(decodeURI(argv[0]));
	const app = Application(item.appName);
	const window = app.windows()
		.filter(window => window.id() === item.windowId)[0];
	const tab = window.tabs()
		.filter(tab => getTabId(tab) ?
			tab.id() === item.tabId :
			tab.index() === item.tabIndex)[0];

	if (item.appName === 'Safari Technology Preview' || item.appName === 'Safari') {
		window.currentTab = tab;
	} else if (item.appName === 'Google Chrome') {
		window.activeTabIndex = item.tabIndex;
	} else {
		return;
	}

	window.visible = false;
	window.visible = true;
	app.activate();
}

