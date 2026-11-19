const chai = require('chai');

const chaiXml = require('chai-xml');
const chaiDatetime = require('chai-datetime');
// dirty-chai v3 is ESM-only; require(esm) returns the module namespace
const {default: dirtyChai} = require('dirty-chai');
global.verquire = require('../utils/verquire');

global.expect = chai.expect;

chai.use(chaiXml);
chai.use(chaiDatetime);
chai.use(dirtyChai);
