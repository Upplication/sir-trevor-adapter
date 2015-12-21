ImageAdapter = {
	name: 'ImageAdapter',

	handles : [
		'image',
		'image_edit'
	],

	toHTML: function(data) {
		if (!data || !data.file)
			return  '';

		var file = data.file.url || '';
		return '<img src="' + file + '"/>';
	},

	toJSON: function(html) {
		var file = '';
		var rgx = /<img src="(.*)"\/?>/;
		var match = rgx.exec(html);
		if (match)
			file = match[1];

		return { file: { url: file } };
	}
}

module.exports = ImageAdapter;