var {
  accAdd,
  accMul,
  accDiv
} = require("babel-plugin-arithmetic/calc.js");

var x = accAdd(accMul(accAdd(b, c), d), accDiv(e, f));