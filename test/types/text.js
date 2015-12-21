var should = require('should');
var TextAdapter = require('../../src/types/text');
var testCases = require('../data/text');

describe('TextAdapter', function() {
	describe('#toHTML()', function() {
		testCases.forEach(function (testCase, idx) {
			var html = TextAdapter.toHTML(testCase.data, testCase.type);		
			var json = TextAdapter.toJSON(html, testCase.type);

			it('#' + Number(idx+1) + ': should return valid HTML for test case', function() {
				should(html).containEql(testCase.data.text);
			})
			it('#' + Number(idx+1) + ': should be deserializable via #toJSON() and equal to the original', function() {
				should(json).eql(testCase.data);
			})
		})
	})
	describe('#toJSON()', function() {
		testCases.forEach(function (testCase, idx) {
			it('#' + Number(idx+1) + ': should return expected json for the given HTML input', function() {
				var data = TextAdapter.toJSON(testCase.html, testCase.type);
				should(data).eql(testCases[idx].data);
			})
		})
	})
})