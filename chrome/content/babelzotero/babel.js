Zotero.BabelZotero = {
	base_dir: null,

	init: function() {
	},

	sanitize: function( str ) {
		return str.trim().replace(/[^\S ]|[\(\)\{\}\[\]\*\?\.\^\|\\\/!:;"'<>&%$#@]/g, "-");
	},

	sanitize_except_period: function( str ) {
		return str.trim().replace(/[^\S ]|[\(\)\{\}\[\]\*\?\^\|\\\/!:;"'<>&%$#@]/g, "-");
	},

	guard_length: function( str ) {
		if ( str.length > 30 ) {
			var str = str.substring(0,29);
		}
		return str;
	},

	guard_writable: function( path_dir ) {
		var path_nodes = path_dir.split( "/" );
		var path_to_file = Components.classes["@mozilla.org/file/local;1"].createInstance( Components.interfaces.nsIFile );
		path_nodes.forEach( function( node ) {
			 path_to_file.append( node );
		} );
		try {
			if( !path_to_file.isWritable() ) { throw "Not writable" };
			return path_to_file;
		} catch (err) {
			alert( "The path " + path_dir + " is not writable.\nDoes it exist and do you as a user have sufficient permissions to write to it?" );
		}
		return null;
	},

	guard_title: function( item ) {
		var title = this.guard_length( this.sanitize( item.getDisplayTitle() ) );
		if ( title == "" ) { title = "no title" };
		return title
	},

	create_dir: function( callback_func ) {
		this.base_dir = Zotero.Prefs.get( 'extensions.zotero.babel.basedir', true );
		this.cite_style = 'bibliography=' + Zotero.Prefs.get( 'extensions.zotero.babel.citestyle', true );
		try {
			var items = Zotero.getActiveZoteroPane().getSelectedItems();
			var item = items[0];
			/*
			Beware of Zotero's peculiar ways of offering item data to you, examples that work:
					alert( item.getField('title') );
					alert( item.getCreators().length );
					alert( item.getCreators()[0].lastName );
					alert( item.getField('firstCreator') );
					my_item = Zotero.Items.get( item.itemID );
					alert( JSON.stringify( my_item) );
			Useful sources to scout:
			https://github.com/zotero/zotero/blob/master/test/tests/itemTest.js
			https://github.com/zotero/zotero/blob/master/chrome/content/zotero/zoteroPane.js
			*/
			if ( item.isRegularItem() ) {
				var title = this.guard_title( item );
				var author_node = "anonymous";
				if ( item.getCreators()[0] != null ) {
					var creator = item.getCreators()[0];
				  author_node = this.guard_length( this.sanitize_except_period( creator.lastName ) + ", " + this.sanitize_except_period( creator.firstName ) );
				}
				var path_to_file = this.guard_writable( this.base_dir );
				if ( path_to_file != null ) {
					[ author_node, title ].forEach( function( node ) {
					 	path_to_file.append( node );
					} );
					if ( !path_to_file.exists() ) {
						path_to_file.create( path_to_file.DIRECTORY_TYPE, 0o750 );
					}
					path_to_file.reveal();
					if( typeof( callback_func ) !== 'undefined' ) {
						var qc = Zotero.QuickCopy.getContentFromItems( items, this.cite_style );
						callback_func( path_to_file, title, item.itemID, qc.text );
					}
				}
			}
		} catch( err ) {
			alert( err.message );
		}
	},

	create_stub: function() {
		this.create_dir( function( nsi_file, title, itemID, stub_text ) { 
			nsi_file.append( "Summary" );
			nsi_file.append( "Summary_" + title + ".md" );
			if ( !nsi_file.exists() ) {
				nsi_file.create( nsi_file.NORMAL_FILE_TYPE, 0o750 );
				var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance( Components.interfaces.nsIFileOutputStream );
				foStream.init( nsi_file, 0x02 | 0x08 | 0x20, 0o666, 0);
				var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance( Components.interfaces.nsIConverterOutputStream );
				converter.init( foStream, "UTF-8", 0, 0 );
				converter.writeString( "## Summary\n\n> " + stub_text );
				converter.close();
				Zotero.Attachments.linkFromFile( { file: nsi_file.path, parentItemID: itemID } )
		    } else {
			    alert( "Cannot overwrite an existing summary..." );
		    }
		} );
	},
	
	create_from_drop: function() {
		var drop_dir_path = Zotero.Prefs.get( 'extensions.zotero.babel.dropdir', true );
		var drop_dir =  this.guard_writable( drop_dir_path );
		if( drop_dir.directoryEntries.hasMoreElements() ) {
			file = drop_dir.directoryEntries.getNext().QueryInterface(Components.interfaces.nsIFile);
			this.create_dir( function( nsi_file, title, itemID, stub_text ) {
				file.moveTo( nsi_file, file.leafName );
				nsi_file.append( file.leafName );
				Zotero.Attachments.linkFromFile( { file: nsi_file.path, parentItemID: itemID } );
			} );
		};
	}

};

// Initialize the utility
window.addEventListener( 'load', function(e) { Zotero.BabelZotero.init(); }, false 	);
