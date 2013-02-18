"use strict";
// Declare modules
angular.module('twig.config', [])
	.value('twig.config', {
		'macroCache': null,
		'lowercase': function(string){
			return isString(string) ? string.toLowerCase() : string;
		},
		'toBoolean': function(value) {
			if (value && value.length !== 0) {
				var v = angular.isString(value) ? ("" + value).toLowerCase() : value;
				value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
			} else {
				value = false;
			}
			return value;
		},
		'random': function(param) {
			if (angular.isArray(param) || angular.isString(param)) {
				return param[ Math.floor(Math.random() * param.length) ];
			} else if (angular.isNumber(param)) {
				return Math.floor(Math.random() * param);
			} else {
				return Math.floor(Math.random() * 1000000000);
			}
		},
		'divisibleby': function(num, div) {
			return angular.isNumber(num) && angular.isNumber(div) && Math.floor(num/div) === num/div;
		},
		'even': function(num) {
			return num%2 === 0;
		},
		'odd': function(num) {
			return num%2 !== 0;
		}
	});
angular.module('twig.filters', ['twig.config']);
angular.module('twig.directives', ['twig.config'])
	.factory('twig', ['twig.config', function(twigConfig){
		/**
		* divisibleby 
		* 
		* The random function returns a random value depending on the supplied parameter type
		* - a random item from a sequence;
		* - a random character from a string;
		* - a random integer between 0 and the integer parameter (inclusive).
		* 
		* @see http://twig.sensiolabs.org/doc/functions/random.html
		*/
		this['random']= twigConfig['random'];
		/**
		* divisibleby 
		* 
		* divisibleby checks if a variable is divisible by a number
		* 
		* @see http://twig.sensiolabs.org/doc/tests/divisibleby.html
		*/
		this['divisibleby'] = twigConfig['divisibleby'];
		/**
		* even 
		* 
		* returns true if the given number is even
		* 
		* @see http://twig.sensiolabs.org/doc/tests/even.html
		*/
		this['even'] = twigConfig['even'];
		/**
		* even 
		* 
		* returns true if the given number is odd
		* 
		* @see http://twig.sensiolabs.org/doc/tests/odd.html
		*/
		this['odd'] = twigConfig['odd'];
		
		return this;
	}]);
angular.module('twig', ['twig.filters', 'twig.directives', 'twig.config']);
// Some cross browser declaration
if (angular.isUndefined(Array['range'])) {
	Array['range'] = function(a, b, step){
		var A= [];
		if(typeof a === 'number'){
			A[0] = a;
			step= step || 1;
			while(a+step<= b){
				A[A.length]= a+= step;
			}
		} else {
			var s = 'abcdefghijklmnopqrstuvwxyz';
			if(a === a.toUpperCase()){
				b=b.toUpperCase();
				s= s.toUpperCase();
			}
			s= s.substring(s.indexOf(a), s.indexOf(b)+ 1);
			A= s.split('');        
		}
		return A;
	};
}
if(!String.prototype['trim']) {
	String.prototype['trim'] = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}