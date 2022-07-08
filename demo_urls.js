var url = require('url');
var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log('typeof q: '  + typeof(q));
console.log('q keys: ' + Object.keys(q));

console.log('q.host: ' + q.host);
console.log('q.pathname: ' + q.pathname);
console.log('q.search: ' + q.search);

var qdata = q.query;
console.log('typeof qdata: ' + typeof(qdata));
console.log('qdata keys: ' + Object.keys(qdata));

console.log('qdata.month: ' + qdata.month);


