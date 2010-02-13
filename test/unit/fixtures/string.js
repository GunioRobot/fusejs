var attackTarget,
 evalScriptsCounter = 0,
 largeTextEscaped   = '&lt;span&gt;test&lt;/span&gt;', 
 largeTextUnescaped = '<span>test</span>';

// All ECMA 5th edition whitespace chars (7.2 - WhiteSpace, and 7.3 - LineTerminator)
var whitespaceChars = (function() {
  var key, sMap = fuse.RegExp.SPECIAL_CHARS.s, result = '';
  for (key in sMap) result += key;
  return result;
})();

fuse.Number(2048).times(function(){ 
  largeTextEscaped += ' ABC';
  largeTextUnescaped += ' ABC';
});

largeTextEscaped = fuse.String(largeTextEscaped);
largeTextUnescaped = fuse.String(largeTextUnescaped);

/*--------------------------------------------------------------------------*/

var Fixtures = {
  'mixed_dont_enum': { 'a':'A', 'b':'B', 'toString':'bar', 'valueOf':'' }
};