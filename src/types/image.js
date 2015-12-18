ImageAdapter = {
	name: 'ImageAdapter',

	handles : [
		'image',
		'image_edit'
	],

	toHTML: function(data) {
		var file = data.file || '';
		return '<img src="' + file + '"/>';
	},

	toJSON: function(html) {
		var file = '';
		var rgx = /<img src="(.*)"\/?>/;
		var match = rgx.exec(html);
		if (match)
			file = match[0];

		return { file: { url: file } };
	}
}

module.exports = ImageAdapter;