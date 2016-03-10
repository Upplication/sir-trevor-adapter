module.exports = [
	{
		type: 'image',
		data: {
			href: null,
			file: {
				url: 'https://example.com/some/random/path/some-random-image.png'
			}
		},
		html: '<img src="https://example.com/some/random/path/some-random-image.png">'
	},
	{
		type: 'image',
		data: {
			href: 'https://action.none/',
			file: {
				url: 'https://example.com/some/random/path/some-random-image.png'
			}
		},
		html: '<a href="https://action.none/"><img src="https://example.com/some/random/path/some-random-image.png"/></a>'
	}
];
