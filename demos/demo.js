var app = angular.module('frAngular', ['twig']);
app.config(['$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider){
    $routeProvider
		.when('/filters', {
			templateUrl: 'partial_filter.html',
			controller: FilterCtrl
		})
		.when('/tags', {
			templateUrl: 'partial_tag.html',
			controller: TagCtrl
		})
		.when('/functions', {
			templateUrl: 'partial_functions.html',
			controller: FunctionsCtrl
		})
		.otherwise({ redirectTo: '/filters' });
}]);

app.service('pageService', function() {
    var page = null;
    this.getPage = function() { return page; };
    this.isCurrentPage = function (currentPage) { return page == currentPage; };
    this.setPage = function(newPage) { page = newPage; };
});


function MainCtrl($scope) {
    $scope.name = "angular-twig-pack";
    $scope.page = null;
};

function FunctionsCtrl($scope, pageService, twig) {
    var namePage = 'Function';
	
    var init = function() {
		/**
		 * Random
		 */
		$scope.changeRandom = function() {
			$scope.rndArray = twig.random(['alex','pilou','ju','bennnou']);
			$scope.rndString = twig.random('tartoprune');
			$scope.rndNumber = twig.random(100);
			$scope.rndEmpty = twig.random();
		};
		$scope.changeRandom();
		/**
		 * divisibleby
		 */
		$scope.divbyYes = twig.divisibleby(6,3);
		$scope.divbyNo = twig.divisibleby(5,3);
		/**
		 * even
		 */
		$scope.evenYes = twig.even(6);
		$scope.evenNo = twig.even(5);
		/**
		 * divisibleby
		 */
		$scope.oddYes = twig.odd(5);
		$scope.oddNo = twig.odd(6);
		
    };

	init();
    if (!pageService.isCurrentPage(namePage)) {
        pageService.setPage(namePage);
    }
};

function TagCtrl($scope, pageService) {
    var namePage = 'Tags';
	
    var init = function() {
		/**
		 * FOR
		 */
		$scope.changeFor = function() {
			var rnd = Math.round(Math.random() * 100001);
			$scope.forAttr.push({'status':false, 'label':'part' + rnd});
			$scope.forAttr.push({'status':true, 'label':'part' + rnd});
		};
		$scope.resetFor = function() {
			$scope.forAttr = [
				{'status':true, 'label':'pire-houaithe'},
				{'status':false, 'label':'cacauaitthe'},
				{'status':true, 'label':'aoucheuh'}
			];
		};
		$scope.resetFor();
		/**
		 * IF
		 */
		$scope.ifTest = 10;
		/**
		 * Macros
		 */
		$scope.macroTest = 'mySuper text value!';
		$scope.macroCtrlTest = 'varFromCtrl';
    };

    if (!pageService.isCurrentPage(namePage)) {
        init();
        pageService.setPage(namePage);
    }
};

function FilterCtrl($scope, $filter, pageService) {
    var namePage = 'filter';

	var init = function() {
		// url_encode
		$scope.strUrlEncode = 'http://w3schools.com/my test.asp?name=ståle&car=saab';
		console.debug('Filter url_encode', $scope.strUrlEncode, $filter('url_encode')($scope.strUrlEncode));

		// json_encode (angular provide fromJson to do this)
		$scope.strJsonEncode = '{"key":["Thierry","Jacques"],"v":0}';
		console.debug('Filter json_encode:', $scope.strJsonEncode, $filter('json_encode')($scope.strJsonEncode));

		// title (uppercase first letter of each word)
		$scope.strTitle = 'my title to titled';
		console.debug('Filter title:', $scope.strTitle, $filter('title')($scope.strTitle));

		// capitalize (uppercase first letter)
		$scope.strCapitalize = 'my title to titled';
		console.debug('Filter capitalize:', $scope.strCapitalize, $filter('capitalize')($scope.strCapitalize));

		// upper
		$scope.strUpper = 'my title to titled';
		console.debug('Filter upper:', $scope.strUpper, $filter('upper')($scope.strUpper));

		// lower
		$scope.strLower = ' MY TITLE TO TITLED';
		console.debug('Filter lower', $scope.strLower, $filter('lower')($scope.strLower));

		// striptags
		$scope.strStriptags = "<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>";
		console.debug('Filter striptags with allowed', $scope.strStriptags, '___', $filter('striptags')($scope.strStriptags, "<b><i>"));
		console.debug('Filter striptags without allowed', $scope.strStriptags, '___', $filter('striptags')($scope.strStriptags));

		// join
		$scope.arrJoin = [0,1,2];
		console.debug('Filter join with separator', $scope.arrJoin, '___', $filter('join')($scope.arrJoin, "|"));
		console.debug('Filter join without separator', $scope.arrJoin, '___', $filter('join')($scope.arrJoin));

		// reverse
		$scope.arrReverse = [0,1,2,3,4];
		$scope.strReverse = '01234';
		console.debug('Filter reverse with separator', $scope.arrReverse, '___', $filter('reverse')($scope.arrReverse));
		console.debug('Filter reverse without separator', $scope.strReverse, '___', $filter('reverse')($scope.strReverse));

		// length
		$scope.arrLength = [0,1,2,3,4];
		$scope.strLength = '0124';
		console.debug('Filter length with array', $scope.arrLength, '___', $filter('length')($scope.arrLength));
		console.debug('Filter length with string', $scope.strLength, '___', $filter('length')($scope.strLength));

		// sort
		$scope.arrSort = ['Zodiac','Benjamin','Alexandre','Julien','Pierre-louis','Marc'];
		console.debug('Filter sort', $scope.arrSort, '___', $filter('sort')($scope.arrSort));
		console.debug('Filter sort with reverse', $scope.arrSort, '___', $filter('reverse')( $filter('sort')($scope.arrSort)) );

		// merge
		$scope.arrMerge = [9,25,1];
		$scope.objMerge = {id:1,version:'1.0.0'};
		console.debug('Filter merge', $scope.arrMerge, '___', $filter('merge')($scope.arrMerge, [1,2,3]));
		console.debug('Filter merge with reverse', $scope.objMerge, '___', $filter('merge')($scope.objMerge, {key:'n',val:0}));

		// default
		$scope.strDefault = '';
		$scope.strMyDefault = 'My defaut';
		console.debug('Filter default', $filter('default')($scope.strDefault, $scope.strMyDefault));
		console.debug('Filter default', $filter('default')(null, $scope.strMyDefault));
		console.debug('Filter default', $filter('default')($scope['tartoprune'], $scope.strMyDefault));

		// keys
		$scope.arrKeys = [9,25,1];
		$scope.objKeys = {'key1':0,'key2':1};
		console.debug('Filter keys with array', $scope.arrKeys, '___', $filter('keys')($scope.arrKeys));
		console.debug('Filter keys with object', $scope.objKeys, '___', $filter('keys')($scope.objKeys));

		// escape
		$scope.strHTML	= '<p><strong>My</strong> exemple!</p>';
		$scope.strURL	= 'http://www.frangular.com/2013/01/angularjs-service-raccourcis-clavier.html';
		$scope.strJS	= '<script type="text/javascript">(function() { var a=window,b="jstiming",d="tick";</script>';
		console.debug('Filter escape HTML', $scope.strHTML, '___', $filter('escape')($scope.strHTML));
		console.debug('Filter escape URL', $scope.strURL, '___', $filter('escape')($scope.strURL, 'url'));
		console.debug('Filter escape JS', $scope.strJS, '___', $filter('escape')($scope.strJS, 'js'));

		// abs
		$scope.strABS	= -5;
		console.debug('Filter abs', $scope.strABS, '___', $filter('abs')($scope.strABS));

		// nl2br
		$scope.strNL2BR	= 'FR\nangular\nJS';
		console.debug('Filter nl2br', $scope.strNL2BR, '___', $filter('nl2br')($scope.strNL2BR));

		// number_format
		$scope.strNumberFormat	= '1 000,50';
		console.debug('Filter number_format', $scope.strNumberFormat, '___', $filter('number_format')($scope.strNumberFormat, 2, '.', ' '));

		// slice
		$scope.strSliceArr		= [1,2,3,4];
		$scope.strSliceString	= '1234';
		console.debug('Filter slice', $scope.strSliceArr, '___', $filter('slice')($scope.strSliceArr, 1, 2));
		console.debug('Filter slice', $scope.strSliceString, '___', $filter('slice')($scope.strSliceString, 1, 2));

		// slice
		$scope.strTrimString	= '  I like AngularJS.  ';
		console.debug('Filter slice', $scope.strTrimString, '___', $filter('trim')($scope.strTrimString));
		console.debug('Filter slice char_mask', $scope.strTrimString, '___', $filter('trim')($scope.strTrimString, '.'));
	};

    if (!pageService.isCurrentPage(namePage)) {
        init();
        pageService.setPage(namePage);
    }
	
}