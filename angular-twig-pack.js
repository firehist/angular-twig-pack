// Declare modules
angular.module('twig.config', []).value('twig.config', {});
angular.module('twig.filters', ['twig.config']);
angular.module('twig.directives', ['twig.config']);
angular.module('twig', ['twig.filters', 'twig.directives', 'twig.config']);

/**
 * Code from https://github.com/angular-ui/angular-ui/blob/master/modules/filters/format/format.js
 * A replacement utility for internationalization very similar to sprintf.
 *
 * @param replace {mixed} The tokens to replace depends on type
 *  string: all instances of $0 will be replaced
 *  array: each instance of $0, $1, $2 etc. will be placed with each array item in corresponding order
 *  object: all attributes will be iterated through, with :key being replaced with its corresponding value
 * @return string
 *
 * @example: 'Hello :name, how are you :day'.format({ name:'John', day:'Today' })
 * @example: 'Records $0 to $1 out of $2 total'.format(['10', '20', '3000'])
 * @example: '$0 agrees to all mentions $0 makes in the event that $0 hits a tree while $0 is driving drunk'.format('Bob')
 */
angular.module('twig.filters').filter('format', function () {
    return function (value, replace) {
        if (!value) {
            return value;
        }
        var target = value.toString(), token;
        if (replace === undefined) {
            return target;
        }
        if (!angular.isArray(replace) && !angular.isObject(replace)) {
            return target.split('$0').join(replace);
        }
        token = angular.isArray(replace) && '$' || ':';

        angular.forEach(replace, function (value, key) {
            target = target.split(token + key).join(value);
        });
        return target;
    };
});

/**
 * Url encode
 *
 * @example: 'Follow this link: http://w3schools.com/my test.asp?name=ståle&car=saab' | url_encode
 */
angular.module('twig.filters').filter('url_encode', function () {
    return function (value) {
        if (!value) {
            return value;
        }
        var target = value.toString();
        return encodeURIComponent(target);
    };
});

/**
 * Json encode
 *
 * @example: {'key':['Thierry', 'Jacques'],'v':0} | json_encode
 */
angular.module('twig.filters').filter('json_encode', function () {
    return function (value) {
        if (!value) {
            return value;
        }
        var target = value.toString();
        return angular.fromJson(target);
    };
});

/**
 * Title
 *
 * @example: 'my title to titled' | title
 */
angular.module('twig.filters').filter('title', function () {
    return function (value) {
        if (!value) {
            return value;
        }
        var target = value.toString();
        return target.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
});

/**
 * Capitalize
 *
 * @example: 'my title to titled' | capitalize
 */
angular.module('twig.filters').filter('capitalize', function () {
    return function (value) {
        if (!value) {
            return value;
        }
        var target = value.toString().toLowerCase();
        return target.charAt(0).toUpperCase() + target.slice(1);
    };
});

/**
 * Upper
 *
 * @example: 'my title to titled' | upper // MY TITLE TO TITLED
 */
angular.module('twig.filters').filter('upper', function () {
    return function (value) {
        if (!value) {
            return value;
        }
        return target = value.toString().toUpperCase();
    };
});

/**
 * lower
 *
 * @example: 'MY TITLE TO TITLED' | upper // my title to titled
 */
angular.module('twig.filters').filter('lower', function () {
    return function (value) {
        if (!value) {
            return value;
        }
        return target = value.toString().toLowerCase();
    };
});

/**
 * striptag
 *
 * @author http://kevin.vanzonneveld.net
 * @example: 'MY TITLE TO TITLED' | upper 
 *		#returns 'my title to titled'
 */
angular.module('twig.filters').filter('striptags', function () {
    return function (value, allowed) {
        if (!value) {
            return value;
        }
        allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return value.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    };
});

/**
 * join
 *
 * @param separator {string} The separator to join each array item
 *
 * @example: [0,1,2] | join
 *		#returns 012
 * @example: [0,1,2] | join:('|')
 *		#returns 0|1|2
 */
angular.module('twig.filters').filter('join', function () {
    return function (value, separator) {
        if (!value || !angular.isArray(value)) {
            return value;
        }
        return value.join(separator || '');
    };
});

/**
 * reverse
 *
 * @example: '01234' | reverse
 *		#returns 43210
 * @example: [0,1,2] | reverse
 *		#returns [2,1,0]
 */
angular.module('twig.filters').filter('reverse', function () {
    return function (value) {
        if (!value) {
            return value;
        }

        if (angular.isString(value)) return value.split("").reverse().join("");
        else if (angular.isArray(value)) return angular.copy(value).reverse();
        return value;
    };
});

/**
 * length
 *
 * @example: '01234' | reverse
 *		#returns 5
 * @example: [0,1,2] | reverse
 *		#returns 3
 */
angular.module('twig.filters').filter('length', function () {
    return function (value) {
        if (!value) {
            return 0;
        }
        if (angular.isString(value)) return value.split("").length;
        else if (angular.isArray(value)) return value.length;
        return 0;
    };
});

/**
 * sort
 *
 * @example: ['Zodiac','Benjamin','Alexandre','Julien','Pierre-louis','Marc'] | sort
 *		#returns ['Alexandre','Benjamin','Julien','Marc','Pierre-louis','Zodiac']
 * @example: ['Zodiac','Benjamin','Alexandre','Julien','Pierre-louis','Marc'] | sort | reverse
 *		#returns ['Zodiac','Pierre-louis','Marc','Julien','Benjamin','Alexandre']
 */
angular.module('twig.filters').filter('sort', function () {
    return function (value) {
        if (!value || !angular.isArray(value)) {
            return value;
        }
        return angular.copy(value).sort();
    };
});

/**
 * merge
 *
 * @example: [9,25,1] | merge:([1,2,3])
 *		#returns [9,25,1,1,2,3]
 * @example: {id:1,version:'1.0.0'} | merge:({key:n,val:0}) | reverse
 *		#returns [id:1,version:'1.0.0',key:n,val:0}
 */
angular.module('twig.filters').filter('merge', function () {
    return function (value, merge) {
        if (!value || !merge) {
            return value;
        }
        var target          = angular.copy(value),
            targetConcat    = angular.copy(merge);
        if (angular.isArray(value) && angular.isArray(merge)) return target.concat(targetConcat);
        else if (angular.isObject(value) && angular.isObject(merge)) return angular.extend({}, target, targetConcat);
        return value;
    };
});

/**
 * default
 *
 * @example: '' | default:('My default')
 *		#returns 'My default'
 * @example: null | default:('My default') | reverse
 *		#returns 'My default'
 */
angular.module('twig.filters').filter('default', function () {
    return function (value, def) {
        if (!def) {
            return value;
        }
        if (!value || value == '' || value == null) return def;
        return value;
    };
});

/**
 * keys
 *
 * @example: {key1:0,key2:1} | keys
 *		#returns ['key1','key2']
 * @example: ['version', 'number'] | keys 
 *		returns [0,1]
 */
angular.module('twig.filters').filter('keys', function () {
    return function (value) {
        if (!value || (!angular.isArray(value) && !angular.isObject(value))) {
            return [];
        }
        var target = angular.copy(value),
            keys = [];
        for (var key in target) keys.push(key);
        return keys;
    };
});

/**
 * escape HTML, js, css, url, html_attr
 *
 * @example: '<p><strong>My</strong> exemple!</p>' | escape('html')
 *		#returns "&#60;p&#62;&#60;strong&#62;My&#60;/strong&#62; exemple!&#60;/p&#62;"
 * @example: '<script type="text/javascript">(function() { var a=window,b="jstiming",d="tick";</script>' | escape('js')
 *		#returns "<script type=\"text/javascript\">(function() { var a=window,b=\"jstiming\",d=\"tick\";</script>"
 * @example: 'http://www.frangular.com/2013/01/angularjs-service-raccourcis-clavier.html' | escape('url')
 *		#returns "http%3A%2F%2Fwww.frangular.com%2F2013%2F01%2Fangularjs-service-raccourcis-clavier.html"
 */
angular.module('twig.filters').filter('escape', function () {
    return function (value, type) {
        if (!value || !angular.isString(value)) {
            return value;
        }
		if (angular.isUndefined(type)) {
			type = 'html';
		}
		switch(type) {
			case 'html':
				return value.replace(/[&<>"'`]/g, function (chr) {
					return '&#' + chr.charCodeAt(0) + ';';
				});
				break;
			case 'js':
				return value.replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
				break;
			case 'url':
				return encodeURIComponent(value);
				break;				
		}
    };
});

/**
 * abs
 *
 * @example: -5 | abs
 *		#returns 5
 */
angular.module('twig.filters').filter('abs', function () {
    return function (value) {
        if (!value || !angular.isNumber(value)) {
            return value;
        }
		return Math.abs(value);
    };
});

/**
 * nl2br
 *
 * @example: 'FR\nangular\nJS' | nl2br
 *		#returns 'FR<br />\nangular<br />\nJS'
 */
angular.module('twig.filters').filter('nl2br', function () {
    return function (value) {
        if (!value || !angular.isString(value)) {
            return value;
        }
		return value.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br ' + '/>$2');
    };
});

/**
 * number_format
 * 
 * Strip all characters but numerical ones.
 * 
 * http://kevin.vanzonneveld.net
 * @example 1: number_format(1234.56);
 *     returns 1: '1,235'
 * @example 2: number_format(1234.56, 2, ',', ' ');
 *     returns 2: '1 234,56'
 * @example 3: number_format(1234.5678, 2, '.', '');
 *     returns 3: '1234.57'
 * @example 4: number_format(67, 2, ',', '.');
 *     returns 4: '67,00'
 * @example 5: number_format(1000);
 *     returns 5: '1,000'
 * @example 6: number_format(67.311, 2);
 *     returns 6: '67.31'
 * @example 7: number_format(1000.55, 1);
 *     returns 7: '1,000.6'
 * @example 8: number_format(67000, 5, ',', '.');
 *     returns 8: '67.000,00000'
 * @example 9: number_format(0.9, 0);
 *     returns 9: '1'
 * @example 10: number_format('1.20', 2);
 *    returns 10: '1.20'
 * @example 11: number_format('1.20', 4);
 *    returns 11: '1.2000'
 * @example 12: number_format('1.2000', 3);
 *    returns 12: '1.200'
 * @example 13: number_format('1 000,50', 2, '.', ' ');
 *    returns 13: '100 050.00'
 */
angular.module('twig.filters').filter('number_format', function () {
    return function (value, decimals, dec_point, thousands_sep) {
        if (!value) {
            return value;
        }
		value = (value + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+value) ? 0 : +value,
		  prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		  sep = angular.isUndefined(thousands_sep) ? ',' : thousands_sep,
		  dec = angular.isUndefined(dec_point) ? '.' : dec_point,
		  s = '',
		  toFixedFix = function (n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		  };
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
		  s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
		  s[1] = s[1] || '';
		  s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
    };
});

/**
 * slice
 * 
 * The slice filter extracts a slice of a sequence, a mapping, or a string
 * 
 * @example 1: slice([1, 2, 3, 4], 1, 2);
 *     returns 1: [2, 3]
 * @example 2: slice('1234', 1, 2);
 *     returns 2: '23'
 */
angular.module('twig.filters').filter('slice', function () {
    return function (value, start, length) {
		if ((!angular.isString(value) && !angular.isArray(value)) || !angular.isNumber(start)) {
            return value;
		}
		if (!angular.isNumber(length)) {
			length = 0;
		}
		return value.slice(start, start+length);
    };
});

/**
 * trim
 * 
 * The trim filter strips whitespace (or other characters) from the beginning and end of a string
 * 
 * @see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/Trim
 * 
 * @param {string} char_mask The characters to strip
 * 
 * @example 1: trim('  I like AngularJS.  ');
 *     returns 1: 'I like AngularJS.'
 * @example 2: slice('  I like AngularJS.  ', '.');
 *     returns 2: 'I like AngularJS'
 */
angular.module('twig.filters').filter('trim', function () {
    return function (value, char_mask) {
		if (!value) {
            return value;
		}
		// Backward compatibility
		if(!String.prototype.trim) {
			String.prototype.trim = function () {
				return this.replace(/^\s+|\s+$/g,'');
			};
		}
		var returnValue = value.trim();
		if (angular.isDefined(char_mask) && angular.isString(char_mask)) {
			return returnValue.replace(char_mask, '');
		}
		return returnValue;
    };
});