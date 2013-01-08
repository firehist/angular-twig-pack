var app = angular.module('frAngular', ['twig']);

function MainCtrl($scope, $filter) {
    $scope.name = 'angular-twig-pack';

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



}