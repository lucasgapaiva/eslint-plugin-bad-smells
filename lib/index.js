/**
 * @fileoverview This plugin looks for bad smells in JavaScript
 * @author Lucas Paiva
 */
"use strict";


//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = {
  'long-method': require('./rules/long-method'),
  'long-parameter-list': require('./rules/long-parameter-list'),
  'empty-catch': require('./rules/empty-catch'),
  'nested-callbacks': require('./rules/nested-callbacks'),
  'long-message-chain': require('./rules/long-message-chain'),
};

