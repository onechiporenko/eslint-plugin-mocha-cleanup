/**
 * @fileoverview Unit testing of `obj.js`'s currently unused methods
 */

'use strict';

const assert = require('assert');
const obj = require('../../../lib/utils/obj.js');

describe('obj', function () {
  it('Returns false for absent child path', function () {
    const result = obj.has({ a: { b: { c: 1 } } }, 'a.b.d');
    assert(!result);
  });
  it('Returns true for present child path', function () {
    const result = obj.has({ a: { b: { c: 1 } } }, 'a.b.c');
    assert(result);
  });
});
