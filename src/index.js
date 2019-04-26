
function pushCache(operation){
    var operationFun;
    switch(operation){
        case '+':
            operationFun = 'accAdd';
            break;
        case '-':
            operationFun = 'accSub';
            break;
        case '*':
            operationFun = 'accMul';
            break;
        case '/':
            operationFun = 'accDiv';
            break;
        case '+=':
            operationFun = 'accAdd';
            break;
        case '-=':
            operationFun = 'accSub';
            break;
        default: 
            operationFun = 'none';
    }
    if(needRequireCache.indexOf(operationFun)>=0) return operationFun;
    operationFun !== 'none' && needRequireCache.push(operationFun);
    return operationFun;
}

var needRequireCache = [];

function exactCal(babel){

    var t = babel.types;
    var template = babel.template;

    var preOperationAST = template('FUN_NAME(ARGS)');
    var requireAST = template('var PROPERTIES = require(SOURCE)');

    function preObjectExpressionAST(keys){
        var properties = keys.map(function(key){
            return t.objectProperty(t.identifier(key),t.identifier(key), false, true);
        });
        return t.ObjectPattern(properties);
    }

    return {
        visitor:{
            Program: {
                exit: function(path){
                    if(needRequireCache.length<=0) return;
                    var directives = path.node.directives;
                    if(directives[0] && directives[0].value.value=='calc polyfill'){
                        return;
                    }
                    path.unshiftContainer('body', requireAST({
                        PROPERTIES: preObjectExpressionAST(needRequireCache),
                        SOURCE: t.stringLiteral("babel-plugin-arithmetic/calc.js")
                    }));
                    needRequireCache = [];
                }
            },
            BinaryExpression: {
                exit: function(path){
                    var Program = path.findParent(path => t.isProgram(path.node));
                    var directives = Program.node.directives;
                    var replaceOperator = pushCache(path.node.operator);

                    if(directives[0] && directives[0].value.value=='calc polyfill'){
                        return;
                    }

                    replaceOperator !== 'none' && path.replaceWith(
                        preOperationAST({
                            FUN_NAME: t.identifier(replaceOperator),
                            ARGS: [path.node.left, path.node.right]
                        })
                    );
                }
            },
            AssignmentExpression: {
                exit: function(path){
                    var Program = path.findParent(path => t.isProgram(path.node));
                    var directives = Program.node.directives;
                    var replaceOperator = pushCache(path.node.operator);

                    if(directives[0] && directives[0].value.value=='calc polyfill'){
                        return;
                    }

                    if(replaceOperator !== 'none'){
                        path.node.right = t.CallExpression(t.Identifier(replaceOperator), [path.node.left, path.node.right]);
                        path.node.operator = '=';
                    }
                }
            }
        }
    }
}

module.exports = exactCal;