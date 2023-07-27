# Zotero Babel

I like to have the full texts of items in my own local directory (which is called Babel in my case). This plugin adds two commands to the item context menu:

* 'Attach Babel Drop File'
* 'Create Babel Folder' 
* 'Create Babel Summary Stub'

The first command creates a folder in the library directory of your choice<sup>1</sup> based on an /author_name/title pattern. It then moves the first file it finds in the configured Babel Drop folder<sup>2</sup> to this directory. The idea is that you drop a downloaded document in a convenient standard place and once you have created a bibliographic item in Zotero you right click it to attach the downloaded file.

The second command just creates the folder in the library directory. This is where I would store my full text or any related files for that specific title. 

The third command does the same as the previous command but adds a sub directory /Summary with a summary.txt stub inside it. The summary stub contains markdown representing the Harvard 1 author date bibliographic description for the title.

*IMPORTANT: This extension will only work with Zotero stand alone version.*

## Installation

Download zotero-babel.xpi. In Zotero stand alone choose 'Tools' -> 'Add-ons' -> 'Extensions' -> 'Install add-on from file…'. Select the downloaded file. Set the base directory for your library via the Zotero Preferences menu -> 'Advanced' -> 'Open about:config' and adjust the value of the zotero-babel.path preference as appropriate.

#### Notes

<div style="font-size:70%;">
1) This defaults to /Path/To/Babel, you can change this value in defaults.js or via the Zotero Preferences menu -> 'Advanced' -> 'Open about:config' and changing the value of the zotero-babel.path preference. <br/><br/>
2) This defaults to /Path/To/BabelDropDir, you can change this value in defaults.js or via the Zotero Preferences menu -> 'Advanced' -> 'Open about:config' and changing the value of the zotero-babel.path preference.
</div>
