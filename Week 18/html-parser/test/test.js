var assert = require('assert');
import {parseHTML} from "../src/parser.js";

describe('html parser: ', function() {
    it('<a>123</a>', function() {
        let tree = parseHTML("<a>123</a>");
        console.log(tree);
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 1);
    });

    it('<a href="//time.geekbang.org"></a>', function() {
        let tree = parseHTML("<a href=\"//time.geekbang.org\"></a>");
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });

    it('<a href=\'abc\' id=\'toto\'></a>', function() {
        let tree = parseHTML("<a href='abc' id='toto'></a>");
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });

    it('<a id=toto />', function() {
        let tree = parseHTML("<a id=toto />");
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });

    it('<a />', function() {
        let tree = parseHTML("<a />");
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });

    it('<a style="color:red;" />', function() {
        let tree = parseHTML("<a style='color:red;' />");
        assert.equal(tree.children[0].tagName, "a");
        assert.equal(tree.children[0].children.length, 0);
    });
});