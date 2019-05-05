var {
  accAdd,
  accMul,
  accDiv
} = require("babel-plugin-arithmetic/src/calc.js");

var x = accAdd(accMul(accAdd(b, c), d), accDiv(e, f));