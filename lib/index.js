/**
 * @fileoverview eslint-plugin-mocha-cleanup
 * @author onechiporenko
 * @copyright 2015 onechiporenko. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var path = require("path");
var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(path.resolve(__dirname, "./rules"));



