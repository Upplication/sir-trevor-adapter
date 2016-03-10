var _ = require('lodash');
var should = require('should');

module.exports = function(type) {
	var testCases = require('./data/' + type);
	var adapter = require('../src/types/' + type);

	/* Checks if every data final attribute is contained somehow in the html */
	explore = function(html, data, adapterName) {
		Object.keys(data).forEach(function (key){
			// Exception treatment, ignored keys check
			if (adapterName == 'TextAdapter' && key =='format')
				return;

			var val = data[key];
			if (_.isObject(val))
				explore(html, val);
			else if (val != undefined && val != null)
				should(html).containEql(String(val));

		})
	}

	describe(adapter.name + ' [automated test]', function() {

		describe('#toHTML()', function() {
			testCases.forEach(function (testCase, idx) {
				var html = adapter.toHTML(testCase.data, testCase.type);		
				var json = adapter.toJSON(html, testCase.type);

				it('#' + Number(idx+1) + ': should return valid HTML for test case', function() {
					explore(html, testCase.data, adapter.name);
				})
				it('#' + Number(idx+1) + ': should be deserializable via #toJSON() and equal to the original', function() {
					should(json).eql(testCase.data);
				})
			})
		})

		describe('#toJSON()', function() {
			testCases.forEach(function (testCase, idx) {
				it('#' + Number(idx+1) + ': should return valid json for the given HTML input', function() {
					var data = adapter.toJSON(testCase.html, testCase.type);
					should(data).eql(testCases[idx].data);
				})
			})
		})
	})
}