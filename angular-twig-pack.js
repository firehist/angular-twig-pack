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
 * @example: 'MY TITLE TO TITLED' | upper // my title to titled
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
 * @example: [0,1,2] | join #returns 012
 * @example: [0,1,2] | join:('|') #returns 0|1|2
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
 * @example: '01234' | reverse #returns 43210
 * @example: [0,1,2] | reverse #returns [2,1,0]
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
 * @example: '01234' | reverse #returns 5
 * @example: [0,1,2] | reverse #returns 3
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
 * @example: ['Zodiac','Benjamin','Alexandre','Julien','Pierre-louis','Marc'] | sort #returns ['Alexandre','Benjamin','Julien','Marc','Pierre-louis','Zodiac']
 * @example: ['Zodiac','Benjamin','Alexandre','Julien','Pierre-louis','Marc'] | sort | reverse #returns ['Zodiac','Pierre-louis','Marc','Julien','Benjamin','Alexandre']
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
 * @example: [9,25,1] | merge:([1,2,3]) #returns [9,25,1,1,2,3]
 * @example: {id:1,version:'1.0.0'} | merge:({key:n,val:0}) | reverse #returns [id:1,version:'1.0.0',key:n,val:0}
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
 * @example: '' | default:('My default') #returns 'My default'
 * @example: null | default:('My default') | reverse #returns 'My default'
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
 * @example: {key1:0,key2:1} | keys #returns ['key1','key2']
 * @example: ['version', 'number'] | keys #returns [0,1]
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