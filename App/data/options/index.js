/* globals config */
'use strict';

function save() {
	const path = document.getElementById('path').value;
	const protocol = document.getElementById('protocol').value;
	const host = document.getElementById('host').value;
	const port = document.getElementById('port').value;
	const interf = document.getElementById('interf').value;
	const token = document.getElementById('token').value;
	const zoom = document.getElementById('zoom').value;
	const menu = document.getElementById('cm').checked;
	const shutdown = document.getElementById('shut').checked;
	const aggresive = document.getElementById('aggre').checked;
	const windowLoc = document.getElementById('winLoc').checked;
	const auto = document.getElementById('auto').checked;
	const dpHeight = document.getElementById('dpHeight').value;
	const dpWidth = document.getElementById('dpWidth').value;
	if (!windowLoc){
		browser.storage.local.remove(['dpLeft','dpTop']);
	}
	browser.runtime.sendMessage({
		get: "aggressive",
		aggressive: aggresive,
	});
	browser.runtime.sendMessage({
		get: "contextMenus",
		contextMenus: menu,
	});
	browser.storage.local.set({
		path,
		protocol,
		host,
		port,
		interf,
		token,
		zoom,
		menu,
		shutdown,
		aggresive,
		windowLoc,
		auto,
		dpHeight,
		dpWidth
	}, () => {
		const status = document.getElementById('status');
		status.textContent = browser.i18n.getMessage("OP_saveComplete");
		setTimeout(() => {
			status.textContent = '';
			var ariangUrl = "../../data/ariang/index.html#!/settings/rpc/set/"
			ariangUrl += (protocol + "/" + host + "/" + port + "/" + interf + "/" +
				btoa(token));
			browser.tabs.create({
				url: ariangUrl
			});
		}, 750);
		browser.storage.local.set({
			initialize: true
		});
	});
}

function restore() {
	// Use default value color = 'red' and likesColor = true.
	browser.storage.local.get(Object.assign(config.command.guess, {
		cookie: false
	}), prefs => {
		document.getElementById('path').value = prefs.path;
		document.getElementById('protocol').value = prefs.protocol;
		document.getElementById('host').value = prefs.host;
		document.getElementById('port').value = prefs.port;
		document.getElementById('interf').value = prefs.interf;
		document.getElementById('token').value = prefs.token;
		document.getElementById('zoom').value = prefs.zoom;
		document.getElementById('cm').checked = prefs.menu;
		document.getElementById('shut').checked = prefs.shutdown;
		document.getElementById('aggre').checked = prefs.aggressive;
		document.getElementById('winLoc').checked = prefs.windowLoc;
		document.getElementById('auto').checked = prefs.auto;
	});
	browser.storage.local.get(['dpWidth', 'dpHeight'], prefs => {
		document.getElementById('dpWidth').value = prefs.dpWidth;
		document.getElementById('dpHeight').value = prefs.dpHeight;
		document.getElementById('dpWidthN').value = prefs.dpWidth || 0;
		document.getElementById('dpHeightN').value = prefs.dpHeight || 0;
	});
	document.querySelectorAll('[data-message]').forEach(n => {
		n.textContent = browser.i18n.getMessage(n.dataset.message);
	});
	document.body.style = "direction: " + browser.i18n.getMessage("direction");
}

function dpHChange(e) {
	if (e.target.value > 5000)
		e.target.value = 5000;
	else if (e.target.value < -5000)
		e.target.value = -5000;
	else if (e.target.value == "")
		e.target.value = 0;
	console.log(e);
	document.getElementById('dpHeight').value = e.target.value;
	document.getElementById('dpHeightN').value = e.target.value;
}

function dpWChange(e) {
	if (e.target.value > 5000)
		e.target.value = 5000;
	else if (e.target.value < -5000)
		e.target.value = -5000;
	else if (e.target.value == "")
		e.target.value = 0;
	document.getElementById('dpWidth').value = e.target.value;
	document.getElementById('dpWidthN').value = e.target.value;
}

document.addEventListener('DOMContentLoaded', restore);
document.getElementById('save').addEventListener('click', save);
document.getElementById('dpHeight').onchange = dpHChange;
document.getElementById('dpHeightN').onchange = dpHChange;
document.getElementById('dpWidth').onchange = dpWChange;
document.getElementById('dpWidthN').onchange = dpWChange;