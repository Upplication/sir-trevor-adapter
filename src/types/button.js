ButtonAdapter = {
	name: 'ButtonAdapter',

	handles : [
		'button'
	],

	toHTML: function(data) {
		var $div = $('<div>');
		var $a = $('<a>').appendTo($div);
		/*var $clear = */$('<div>', { style: 'clear: both' }).appendTo($div);
		$a.html(data.text);
		if (data.href && data.href.length > 0)
			$a.attr('href', data.href);
		$a.attr('data-st-user-href', data['user-href']);
		// we dont use $a.css('style') because css method use computed style and could change all the style attr of the elem.
		$a.attr('style', 'overflow: hidden; display: block; line-height: normal; box-sizing: border-box; border-style: solid; text-align: center; margin: 0 auto;');
		$a.find('> *').css('margin', '0');

		Object.keys(data).forEach(function(e) {
			if (!/^css\-/.test(e))
				return;
			var cssKey = e.replace(/^css-/, '');
			var cssVal = data[e];
			$a.attr('style', $a.attr('style') + cssKey + ':' + cssVal + ';');
		});

		return $div.html();
	},

	toJSON: function(html) {
		var $a = $(html);

		var data = {};
		data.format = 'html';
		data.text = $a.html();
		data.href = $a.attr('href');
		data['user-href'] = $a.attr('data-st-user-href');
		$a.attr('style').split(';')
			.filter(function(elem) {
				return elem.indexOf(':') != -1
			})
			.forEach(function (e) {
				var v = e.split(':');
				var cssAttr = v[0].replace(/\s/g, '');
				var cssVal = v[1].trim();
				data['css-' + cssAttr] = cssVal;
			});

		return data;
	}
}

module.exports = ButtonAdapter;