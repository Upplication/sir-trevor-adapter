ButtonAdapter = {
	handles : [
		'button'
	],

	toHTML: function(data) {
		var $div = $('<div>');
		var $a = $('a').appendTo($div);
		/*var $clear = */$('<div>', { style: 'clear: both' }).appendTo($div);
		$a.html(data.text);
		$a.attr('href', data.href);
		$a.attr('data-st-user-href', data['user-href']);

		Object.keys(data).forEach(function(e) {
			if (!/^css\-/.test(e))
				return;
			var cssKey = e.replace(/^css-/);
			var cssVal = data[e];
			$a.css(cssKey, cssVal);
		});


		$a.find('> *').css('margin', '0');

		return $div.html();
	},
	
	toJSON: function(html) {
		var $html = $(html);
		var $a = $html.find('a');

		var data = {};
		data.format = 'html';
		data.text = $a.html();
		data.href = $a.attr('href');
		data['user-href'] = $a.attr('data-st-user-href');
		$a.attr('style').split(';').forEach(function (e) {
			var v = e.split(':');
			var cssAttr = v[0];
			var cssVal = v[1];
			data['css-' + cssAttr] = cssVal;
		});

		return data;
	}
}

module.exports = ButtonAdapter;