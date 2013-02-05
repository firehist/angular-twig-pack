"use strict";

/**
 * for
 * 
 * Loop over each item in a sequence
 *	loop variable is replace by ng-repeat variables
 *	- $index – {number} – iterator offset of the repeated element (0..length-1)
 *	- $first – {boolean} – true if the repeated element is first in the iterator.
 *	- $middle – {boolean} – true if the repeated element is between the first and last in the iterator.
 *	- $last – {boolean} – true if the repeated element is last in the iterator.
 * 
 * @see http://twig.sensiolabs.org/doc/tags/for.html
 * @see http://docs.angularjs.org/api/ng.directive:ngRepeat
 * 
 * @example 1: for="i in 0..9"
 * @example 2: for="i in -10..2"
 * @example 3: for="i in a..z"
 * @example 4: for="i in 'a'|upper..'z'|upper" else="no data!!!"
 * @example 4: for="users in users if user.status"
 */
angular.module('twig.directives').directive('for', [
	'$compile', 'twig.config',
	function ($compile, twigConfig) {
		return {
			scope:		true,
			restrict:	'A',
			link:		function($scope, element, attr){
				var regexRange = /([\w-'|]*)\.\.([\w-'|]*)/,
					regexIf = /(.*) if (.*)/,
					regex = /(.*)\s*in\s*(.*)/,
					expression = '',
					elseTemplate = angular.isDefined(attr['forElse']) ? attr['forElse'] : 'No data',
					elementToInsert = element.clone().removeAttr('for').removeAttr('for-else'),
					length = 0;

				expression = regex.exec(attr['for']);
				if (expression === null)
					throw Error("For attr no valid " + attr['for']);

				var itemName = expression[1].trim(),
					expressionIf = regexIf.exec(expression[2]),
					expressionRange = null;
				// Detect if part
				if (expressionIf) {
					expressionRange = regexRange.exec(expressionIf[1]);
					expression[2] = expressionIf[2];
				} else {
					expressionRange = regexRange.exec(expression[2]);
				}
				var watchItems = function(items) {
						// Execute condition to remove some elt from items
						$scope['items'] = [];
						angular.forEach(items, function(v, k) {
							$scope[itemName] = v;
							var value = expressionIf ? (angular.isUndefined($scope.$eval(expressionIf[2])) ? eval(expressionIf[2]) : $scope.$eval(expressionIf[2])) : '';
							if (!(expressionIf && twigConfig['toBoolean'](value) === false)) {
								$scope['items'].push(v);
							}
						});
						if (angular.isUndefined($scope['items']) || (angular.isArray($scope['items']) && $scope['items'].length === 0)) {
							element.replaceWith($compile(elementToInsert.html(elseTemplate))($scope));
						} else {
							// Add ng-repeat
							elementToInsert.attr('ng-repeat', itemName + ' in items');
							element.replaceWith($compile(elementToInsert)($scope));
						}
					};
				if (expressionRange) {
					var firstItem = angular.isUndefined($scope.$eval(expressionRange[1])) ? expressionRange[1] : $scope.$eval(expressionRange[1]),
						lastItem = angular.isUndefined($scope.$eval(expressionRange[2])) ? expressionRange[2] : $scope.$eval(expressionRange[2]);
					// Test for number
					if (angular.isNumber(firstItem) && angular.isNumber(lastItem)) {
						if (firstItem > lastItem)
							throw Error("First number have to be lower than second number (" + firstItem + " <= " + lastItem);
					} else if (angular.isString(firstItem) && angular.isString(lastItem)) {
						if (firstItem.length !== 1 || lastItem.length !== 1)
							throw Error("First and second parameters have to be char and not string (" + firstItem + ", " + lastItem);
					} else {
						throw Error("Undefined values (" + firstItem + ", " + lastItem);
					}
					watchItems(angular.copy(Array.range(firstItem, lastItem)));
				} else {
					var expr = expressionIf ? expressionIf[1] : expression[2];
					// Set watch on value
					$scope.$watch(expr, function(items) {
						watchItems(angular.copy(items));
					});
					$scope.$watch(expr + '.length', function(a) {
						if (a != length) {
							watchItems(angular.copy($scope.$eval(expr)));
						}
					});
				}

			}
		};
	}]);


/**
 * if
 * 
 * The if statement in Twig is comparable with the if statements of PHP.
 * 
 * @see http://twig.sensiolabs.org/doc/tags/if.html
 * 
 * @example : <li if="myVar >= 6">
 *				...
 *				<elseif on="myOtherVar >= 6">...</elseif>
 *				<else>Default</else>
 *			  </li>
 */
angular.module('twig.directives').directive('if', [
	'twig.config',
	function (twigConfig) {
		"use strict";
		return {
			scope:		true,
			restrict:	'A',
			link:		function($scope, element, attr){
				var expression		= angular.isDefined(attr['if']) ? attr['if'] : null,
					clonedElement	= element.clone().removeAttr('if'),
					findElse		= clonedElement.find('else').first(),
					findElseif		= clonedElement.find('elseif'),
					conditions		= [],
					createObj = function(k,v) { return {'cdt':k,'html':v};};
				// Build array of conditions
				clonedElement.find('elseif, else').remove();
				conditions.push(createObj(expression, clonedElement.html()));
				findElseif.each(function() {
					var $this = $(this),
						cdt = $this.attr('on');
					conditions.push(createObj(cdt, $this.html()));
				});
				conditions.push(createObj('_else_', findElse.html()));
				
				var watchData = function() {
					var newHtml = false;
					angular.forEach(conditions, function(item, key) {
						if ( newHtml === false && (item['cdt'] === '_else_' || twigConfig['toBoolean']($scope.$eval(item['cdt'])))) {
							newHtml = item['html'];
						}
					});
					if (newHtml !== false) {element.html(newHtml); }
				};
				
				// Bind watches to follow all conditions data changes
				angular.forEach(conditions, function(condition,k) {
					$scope.$watch(condition['cdt'], watchData);
				});
			}
		};
	}]);

/**
 * macro 
 * 
 * Macros are useful to put often used HTML idioms into reusable elements
 * to not repeat yourself.
 * 
 * @see http://twig.sensiolabs.org/doc/tags/macro.html
 * 
 * @example : <li if="myVar >= 6">
 *				...
 *				<elseif on="myOtherVar >= 6">...</elseif>
 *				<else>Default</else>
 *			  </li>
 */
angular.module('twig.directives').directive('macroGet', [
	'twig.config', '$compile',
	function (twigConfig, $compile) {
		return {
			scope:		true,
			restrict:	'E',
			link:		function($scope, element, attr){
				var name = angular.isDefined(attr['name']) ? attr['name'] : null,
					params = angular.isDefined(attr['param']) ? attr['param'].split(',') : null;
			
				if (!angular.isString(name) || !angular.isArray(params) || params.length === 0) {
					throw new Error('The given expression is not valid "' + name + '" - "' + params + '". SYNTAX: macro name="nameMacro" param="\'param1\',\'param2\',paramFromScope".');
				}
				
				angular.forEach(params, function(param,key) {
					if (param.indexOf("'") > -1) {
						params[key] = param.replace("'", "");
					} else if (angular.isDefined($scope[param])) {
						params[key] = $scope.$eval(param);
					}
				});
				
				// Some vars
				var macroObj		= twigConfig['macroCache'].get(name),
					isolateScope	= $scope.$new();
				// Check if exist
				if (angular.isUndefined(macroObj)) {
					element.html('');
					return false;
				}

				angular.forEach(macroObj['param'], function(paramName, key) {
					if (angular.isDefined(params[key]))
						isolateScope[paramName] = params[key];
				});

				element.replaceWith($compile(macroObj['html'])(isolateScope));
			}
		};
	}]);

angular.module('twig.directives').directive('macroSet', [
	'twig.config', '$cacheFactory',
	function (twigConfig, $cacheFactory) {
		return {
			scope:		true,
			restrict:	'E',
			terminal:	true,
			compile:	function(iElement, sAttr){
				return {
					pre: function($scope, $element, attr) {
						var name = angular.isDefined(attr['name']) ? attr['name'] : null,
							params = angular.isDefined(attr['param']) ? attr['param'].split(',') : null;
						if (!angular.isString(name) || !angular.isArray(params) || params.length === 0) {
							throw new Error('The given expression is not valid "' + name + '" - "' + params + '". SYNTAX: macro-set name="MacroName" param="paramName1,paramName2". ');
						}
						if (angular.isUndefined(twigConfig['macroCache']) || twigConfig['macroCache'] === null) {
							twigConfig['macroCache'] = $cacheFactory('twigMacros');
						}
						// Some vars
						var elementCopy = $element.clone().removeAttr('macro-set');
						
						// Check if already exist
						if (angular.isDefined(twigConfig['macroCache'].get(name)))
							console.error('The given macro name already exist! "' + name + '"');
						// Save data into store
						twigConfig['macroCache'].put(name, {
							'param':	params,
							'html':		elementCopy.html()
						});
						
						$element.css('display','none');
					}
				}
			}
		};
	}]);