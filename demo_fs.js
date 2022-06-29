var fs = require('fs');

fs.appendFile('mynewfile1.txt', 'Added some more text...', function (err) {
    if (err) throw err;
    console.log('Saved!');
});