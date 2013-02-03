// Declare modules
angular.module('twig.config', []).value('twig.config', {
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
	}
});
angular.module('twig.filters', ['twig.config']);
angular.module('twig.directives', ['twig.config']);
angular.module('twig', ['twig.filters', 'twig.directives', 'twig.config']);
// Some cross browser declaration
if (angular.isUndefined(Array.range)) {
	Array.range = function(a, b, step){
		var A= [];
		if(typeof a == 'number'){
			A[0]= a;
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
if(!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}