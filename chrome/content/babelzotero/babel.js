Zotero.BabelZotero = {
	base_dir: null,

	init: function() {
		// Register to receive notifications of preference changes
		// Looking for explanations? See: https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Preferences
		this.prefs = Components.classes[ "@mozilla.org/preferences-service;1" ]
				.getService( Components.interfaces.nsIPrefService )
				.getBranch( "zotero-babel." );
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.prefs.addObserver("", this, false);
		this.base_dir = this.prefs.getCharPref("path");
		window.addEventListener('unload', function(e) {
			this.prefs.removeObserver("", this);
		}, false);
	},

	observe: function(subject, topic, data) {
		if ( topic == "nsPref:changed" ) {
			if ( data == "path" ) {
				this.base_dir = this.prefs.getCharPref("path");
			}
		}
	},

	create_dir: function( stub ) {
		var sanitize = function( str ) {
			return str.trim().replace(/[^\S ]|[\(\)\{\}\[\]\*\?\.\^\|\\\/!:;"'<>&%$#@]/g, "-");
		}
		var guard_length = function( str ) {
			if ( str.length > 30 ) {
				var str = str.substring(0,29);
			}
			return str;
		}
		var guard_writable = function( base_dir ) {
			var path_nodes = base_dir.split( "/" );
			var path_to_file = Components.classes["@mozilla.org/file/local;1"].createInstance( Components.interfaces.nsILocalFile );
			path_nodes.forEach( function( node ) {
			 	path_to_file.append( node );
			} );
			try {
				if( !path_to_file.isWritable() ) { throw "Not writable" };
				return path_to_file;
			} catch (err) {
				alert( "The path " + base_dir + " is not writable.\nDoes it exist and do you as a user have sufficient permissions to write to it?" );
			}
			return null;
		}
		try {
			var items = Zotero.getActiveZoteroPane().getSelectedItems();
			var item = items[0];
			if ( item.isRegularItem() ) {
				var title = guard_length( sanitize( item.getDisplayTitle() ) );
				if ( title == "" ) { title = "no title" };
				var author_node = "anonymous";
				if ( item.getCreators()[0] != null ) {
					var creator = item.getCreators()[0].ref;
				  author_node = guard_length( sanitize( creator.lastName ) + ", " + sanitize( creator.firstName ) );
				}
				var path_to_file = guard_writable( this.base_dir );
				if ( path_to_file != null ) {
					[ author_node, title ].forEach( function( node ) {
					 	path_to_file.append( node );
					} );
					if ( !path_to_file.exists() ) {
						path_to_file.create( path_to_file.DIRECTORY_TYPE, 0750 );
					}
					if ( stub == true ) {
						path_to_file.append( "Summary" );
						path_to_file.append( "Summary_" + title + ".txt" );
						if ( !path_to_file.exists() ) {
							path_to_file.create( path_to_file.NORMAL_FILE_TYPE, 0750 );
						}
						var qc = Zotero.QuickCopy.getContentFromItems( items, "bibliography=http://www.zotero.org/styles/elsevier-harvard" );
						var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream );
						foStream.init( path_to_file, 0x02 | 0x08 | 0x20, 0666, 0);
						var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance( Components.interfaces.nsIConverterOutputStream );
						converter.init( foStream, "UTF-8", 0, 0 );
						converter.writeString( "## Summary\n\n> " + qc.text );
						converter.close();
					};
					path_to_file.reveal();
				}
			}
		} catch( err ) {
			alert( err.message );
		}
	}

};

// Initialize the utility
window.addEventListener('load', function(e) { Zotero.BabelZotero.init(); }, false);
