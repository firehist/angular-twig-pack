#!/bin/bash

echo 'Build file'
CURRENT=`pwd`
DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
BASEDIR=".."

OUTPUTJS=angular-twig-pack.js
OUTPUTJSMIN=angular-twig-pack.min.js
cd "$DIR"

JSFILES="--js ../src/angular-twig-init.js --js ../src/angular-twig-filters.js --js ../src/angular-twig-tags.js --js ../src/angular-twig-functions.js"

COMPILER=compiler.jar

if [ ! -f $BASEDIR/$OUTPUTJS ]; then
	touch $BASEDIR/$OUTPUTJS
fi

java -jar $COMPILER $JSFILES  \
	 \
	--js_output_file $BASEDIR/$OUTPUTJS \
	--externs externs/angular.js \
	--externs externs/jquery-1.8.js

if [ ! -f $BASEDIR/$OUTPUTJSMIN ]; then
	touch $BASEDIR/$OUTPUTJSMIN
fi

java -jar $COMPILER --compilation_level ADVANCED_OPTIMIZATIONS \
	$JSFILES \
	--js_output_file $BASEDIR/$OUTPUTJSMIN \
	--externs externs/angular.js \
	--externs externs/jquery-1.8.js

echo "--> Minified file: "
echo "  Filename: $OUTPUTJS"
echo "  Filesize: $(stat --printf="%s" ../$OUTPUTJS)"

echo "--> Minified & compressed file: "
echo "  Filename: $OUTPUTJSMIN"
echo "  Filesize: $(stat --printf="%s" ../$OUTPUTJSMIN)"

cd $CURRENT