TextAdapter = {
	name: 'TextAdapter',

	handles : [
		'text',
		'heading',
		'ck_editor',
		'quote',
		'widget'
	],

	tags : { // Relates the st type with the html tag for serializing/deserializing
		'heading' : 'h2',
		'quote': 'quote'
	},

	toHTML: function(data, type) {
		if (data.format == 'html') {
			var content = data.text;
			var tag = this.tags[type];

			if (tag)
				content = '<' + tag + '>' + content + '</' + tag + '>';

			return content;
		} else {
			console.error('Invalid type ' + data.format + ' for block type ' + type);
			return '';
		}
	},
	
	toJSON: function(html, type) {
		var tag = this.tags[type];

		if (tag)
			html = html
					.replace(new RegExp('^<' + tag + '>'), '')
					.replace(new RegExp('</' + tag + '>$'), '');

		return { text: html, type: 'html' };
	}
}

module.exports = TextAdapter;