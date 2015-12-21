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
		$a.attr('href', data.href);
		$a.attr('data-st-user-href', data['user-href']);

		Object.keys(data).forEach(function(e) {
			if (!/^css\-/.test(e))
				return;
			var cssKey = e.replace(/^css-/, '');
			var cssVal = data[e];
			$a.attr('style', $a.attr('style') + cssKey + ':' + cssAttr + ';');
			$a.css(cssKey, cssVal);
		});

		$a.css('overflow', 'hidden');
		$a.css('display', 'block');
		$a.css('line-height', 'normal');
		$a.css('box-sizing', 'border-box');
		$a.css('border-style', 'solid');
		$a.css('text-align', 'center');
		$a.css('margin', '0 auto');
		$a.find('> *').css('margin', '0');

		return $div.html();
	},
	
	toJSON: function(html) {
		var $a = $(html);

		var data = {};
		data.format = 'html';
		data.text = $a.html();
		data.href = $a.attr('href');
		data['user-href'] = $a.attr('data-st-user-href');
		$a.attr('style').split(';').forEach(function (e) {
			var v = e.replace(/\s/g, '').split(':');
			var cssAttr = v[0];
			var cssVal = v[1];
			data['css-' + cssAttr] = cssVal;
		});

		return data;
	}
}

module.exports = ButtonAdapter;