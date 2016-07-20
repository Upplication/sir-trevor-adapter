var ImageAdapter = {
	name: 'ImageAdapter',

	handles : [
		'image',
		'image_edit'
	],

	toHTML: function(data) {
		if (!data || !data.file)
			return  '';

		var file = data.file.url || '';
		var href = data.href;

		var result = '<img src="' + file + '"/>';

		if (href && href.length > 0)
			return '<a href="' + href + '">' + result + '</a>';

		return result;
	},

	toJSON: function(html) {
		var file = '';
		var rgxImg = /<img src="(.*?)"\/?>/;
		var matchImg = rgxImg.exec(html);
		if (matchImg)
			file = matchImg[1];

		var href = null;
		var rgxHref = /<a href="(.*?)">/;
		var matchHref = rgxHref.exec(html);
		if (matchHref)
			href = matchHref[1];

		return { 
			href: href,
			file: { url: file }
		};
	}
}

module.exports = ImageAdapter;