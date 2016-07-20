var ListAdapter = {
	name: 'ListAdapter',

	handles : [
		'list'
	],

	toHTML: function(data) {
		return data.listItems.reduce(function (v, c) {
			v += '<li>' + c.content + '</li>';
		}, '<ul>') + '</ul>';
	},
	
	toJSON: function(html) {
		var rgx = /<li>(.*)<\/li>/;
		var listItems = [];
		var match;

		while ((match = rgx.exec(html)) !== null)
			listItems.push({ content: match[1] });

		return { listItems: listItems };
	}
}

module.exports = ListAdapter;