# Zotero Babel

I like to have the full texts of items in my own local directory (which is called Babel in my case). This plugin adds two commands to the item context menu: 'Create Babel Folder' and 'Create Babel Summary Stub'. The first creates a folder in the library directory of your choice<sup>1</sup> based on an /author_name/title pattern. This is where I would store my full text for that specific title. The second command does the same but adds a sub directory /Summary with a summary.txt stub inside it. The summary stub contains markdown representing the Harvard 1 author date bibliographic description for the title.

*This extension will only work with Zotero stand alone version.*

## Installation

Download zotero-babel.xpi. In Zotero stand alone choose 'Tools' -> 'Add-ons' -> 'Extensions' -> 'Install add-on from file…'. Select the downloaded file. Set the base directory for your library via the Zotero Preferences menu -> 'Advanced' -> 'Open about:config' and adjust the value of the zotero-babel.path preference as appropriate.

1) This defaults to /Path/To/Babel, you can change this value in defaults.js or via the Zotero Preferences menu -> 'Advanced' -> 'Open about:config' and changing the value of the zotero-babel.path preference.
