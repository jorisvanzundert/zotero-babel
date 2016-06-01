// Only create main object once
if (!Zotero.BabelZotero) {
	let loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
					.getService(Components.interfaces.mozIJSSubScriptLoader);
	loader.loadSubScript("chrome://babelzotero/content/babel.js");
}
