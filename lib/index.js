/**
 * @fileoverview eslint-plugin-test
 * @author kronusme
 * @copyright 2015 kronusme. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var path = require('path');
var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(path.resolve(__dirname, './rules'));



