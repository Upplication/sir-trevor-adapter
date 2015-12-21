// Test cases for text module
module.exports = [
	{ // #1		
		type: 'text',
		data: {
			text: '<p>Sample <i>text</i></p>',
			type: 'html'
		},
		html: '<p>Sample <i>text</i></p>'
	},
	{ // #2
		type: 'widget',
		data: {
			text: '<p>Sample <i>text</i></p>',
			type: 'html'
		},
		html: '<p>Sample <i>text</i></p>'
	},
	{ // #3
		type: 'ck_editor',
		data: {
			text: '<p>Sample <i>text</i></p>',
			type: 'html'
		},
		html: '<p>Sample <i>text</i></p>'
	},
	{ // #4
		type: 'heading',
		data: {
			text: '<p>Sample <i>text</i></p>',
			type: 'html'
		},
		html: '<h2><p>Sample <i>text</i></p></h2>'
	},
	{ // #5
		type: 'quote',
		data: {
			text: '<p>Sample <i>text</i></p>',
			type: 'html'
		},
		html: '<quote><p>Sample <i>text</i></p></quote>'
	}
];
