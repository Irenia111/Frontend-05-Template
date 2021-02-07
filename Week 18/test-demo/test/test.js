var assert = require('assert');
import {add,mul} from  "../add.js";
// var add = require('../add.js').add;
// var mul = require('../add.js').mul;

describe('Add Function Testing ~ ', function() {
    it(' 1 +  2 should be 3', function() {
        assert.equal(add(1,2), 3);
    });

    it(' - +  2 should be 1', function() {
        assert.equal(add(-1,2), 1);
    });

    it(' -1 * 2 ', function() {
        assert.equal(mul(-1,2), -2);
    })
});