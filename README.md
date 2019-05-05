# babel-plugin-arithmetic
A babel plugin as a solution for the problem in the calculation precision of the floating points numbers.

## Usage
```bash
npm install babel-plugin-arithmetic --save-dev
```

## Add babel-plugin-arithmetic

#### /.babelrc
```javascript
{
	"plugins": ["arithmetic"]
}
```
or
#### /webpack.config.js
```javascript
...
{
	test: /\.js$/,
	loader: 'babel-loader',
	option: {
		plugins: [
			require('babel-plugin-arithmetic')
		]
	},
},
...
```

## Example
By this plugin, it translate BinaryExpression to FunctionCall for a right result with float number.

```javascript
var a = 0.1 + 0.2;
//0.30000000000000004
	↓ ↓ ↓ ↓ ↓ ↓
var { accAdd } = require('babel-plugin-arithmetic/src/calc.js');
var a = accAdd(0.1, 0.2);
//0.3
```

```javascript
var a = 0.1 + 0.2;
var b = 0.8 - 0.2;
//0.30000000000000004
//0.6000000000000001
	↓ ↓ ↓ ↓ ↓ ↓
var { accAdd, accSub } = require('babel-plugin-arithmetic/src/calc.js');
var a = accAdd(0.1, 0.2);
var a = accSub(0.8, 0.2);
//0.3
//0.6
```
`Note: it doesn't work with eval() And just support (+ - * \ += -=), if the members of the operator is not Number type, it will return the result as it should be`