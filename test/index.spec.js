import pluginTester from 'babel-plugin-tester'
import arithmeticOverload from '../src/index'

pluginTester({
	pluginName: 'arithmetic-overload',
	plugin: arithmeticOverload,
	filename: __filename,
	fixtures: './fixtures'
})
