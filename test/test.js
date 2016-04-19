var assert = require('assert');
var should = require('should');
var auto = require('./automated');
var testCases = require('./data');

describe('SirTrevorAdapter', function() {
	describe('#isSirTrevorData()', function() {
		it('should be true when is a valid SirTrevorData', function() {
			should(sta.isSirTrevorData({ type: 'type', data: {} })).be.exactly(true);
		})
		it('should be false when is not an object', function() {
			should(sta.isSirTrevorData( false )).be.exactly(false);
			should(sta.isSirTrevorData( 1234 )).be.exactly(false);
			should(sta.isSirTrevorData( [] )).be.exactly(false);
			should(sta.isSirTrevorData( 'thisIsAString' )).be.exactly(false);
			should(sta.isSirTrevorData( function() {} )).be.exactly(false);
		})
		it('should be false when object does not contain type attribute or it is empty', function() {
			should(sta.isSirTrevorData( {} )).be.exactly(false);
			should(sta.isSirTrevorData( { data: 'some data' } )).be.exactly(false);
			should(sta.isSirTrevorData( { type: undefined } )).be.exactly(false);
			should(sta.isSirTrevorData( { type: null } )).be.exactly(false);
		})
		it('should be false when object does not contain data attribute or it is empty', function() {
			should(sta.isSirTrevorData( {} )).be.exactly(false);
			should(sta.isSirTrevorData( { type: 'some type' } )).be.exactly(false);
			should(sta.isSirTrevorData( { data: undefined } )).be.exactly(false);
			should(sta.isSirTrevorData( { data: null } )).be.exactly(false);
		})
		it('should be false when object attribute type is not a String', function() {
			should(sta.isSirTrevorData( { type: false, data: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { type: 123, data: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { type: [], data: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { type: {}, data: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { type: function() {}, data: {} } )).be.exactly(false);
		})
		it('should be false when object attribute data is not an Object', function() {
			should(sta.isSirTrevorData( { data: false, type: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { data: 123, type: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { data: [], type: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { data: 'data', type: {} } )).be.exactly(false);
			should(sta.isSirTrevorData( { data: function() {}, type: {} } )).be.exactly(false);
		})
	})
	describe('#getAdapterFor()', function() {
		[
			{ type: 'button', 		expectedAdapter: 'ButtonAdapter' },
			{ type: 'image', 		expectedAdapter: 'ImageAdapter' },
			{ type: 'image_edit', 	expectedAdapter: 'ImageAdapter' },
			{ type: 'list', 		expectedAdapter: 'ListAdapter' },
			{ type: 'map', 			expectedAdapter: 'MapAdapter' },
			{ type: 'spacer', 		expectedAdapter: 'SpacerAdapter' },
			{ type: 'text', 		expectedAdapter: 'TextAdapter' },
			{ type: 'heading', 		expectedAdapter: 'TextAdapter' },
			{ type: 'ck_editor', 	expectedAdapter: 'TextAdapter' },
			{ type: 'quote', 		expectedAdapter: 'TextAdapter' },
			{ type: 'widget', 		expectedAdapter: 'TextAdapter' },
			{ type: 'video', 		expectedAdapter: 'VideoAdapter' },
			{ type: 'columns', 		expectedAdapter: 'ColumnsAdapter' },
		].forEach(function (e) {
			it('should be ' + e.expectedAdapter + ' when type is ' + e.type, function() {
				should(sta.getAdapterFor( e.type )).equal(SirTrevorAdapter[e.expectedAdapter]);
				should(sta.getAdapterFor( { type: e.type } )).equal(SirTrevorAdapter[e.expectedAdapter]);
			})
		})
		it('should be null if an unhandled type', function() {
			should(sta.getAdapterFor( 'nonexistanttype' )).equal(null);
			should(sta.getAdapterFor( { type: 'nonexistanttype' } )).equal(null);
		})
		it('should be null if no arguments', function() {
			should(sta.getAdapterFor()).equal(null);
		})
	})

	describe('#toHTML()', function() {
		context('when applied to single element', function() {
			it('should throw exception if a not valid SirTrevorData', function() {
				sta.toHTML.bind(sta).should.throw(/^No valid SirTrevorData/); // Nothing given
				sta.toHTML.bind(sta, null ).should.throw(/^No valid SirTrevorData/); // null given
				sta.toHTML.bind(sta, undefined ).should.throw(/^No valid SirTrevorData/); // undegined given
				sta.toHTML.bind(sta, {} ).should.throw(/^No valid SirTrevorData/); // Empty object
				sta.toHTML.bind(sta, { data: {} } ).should.throw(/^No valid SirTrevorData/); // No type field
				sta.toHTML.bind(sta, { type: null } ).should.throw(/^No valid SirTrevorData/); // null type field
				sta.toHTML.bind(sta, { type: undefined } ).should.throw(/^No valid SirTrevorData/); // undefined type field
				sta.toHTML.bind(sta, { type: 'type' } ).should.throw(/^No valid SirTrevorData/); // No type field
				sta.toHTML.bind(sta, { data: '', type: 'type' } ).should.throw(/^No valid SirTrevorData/); // Data is not an object
			})
			it('should be wrapped arround instance configuration parameters', function() {
				testCases.forEach(function (testCase) {
					var html = sta.toHTML({ type: testCase.type, data: testCase.data });
					var $elem = $(html);
					assert($elem.is(sta.config.elementEnclosingTag), 'element is not wrapped arroud the elementEnclosingTag: ' + sta.config.elementEnclosingTag);
					assert($elem.is('[data-' + sta.config.attrType + ']'), 'element does not have type attribute attrType: ' + sta.config.attrType);
					if (sta.config.addElementTypeClass)
						assert($elem.is('.' + sta.config.elementClass), 'element is not wrapped arroud the elementEnclosingTag');
					should($elem.data(sta.config.attrType)).be.equal(testCase.type);

				})	
			})
		})
	})
})

auto('text');
auto('image');
auto('columns');