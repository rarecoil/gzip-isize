const isz = require('../dist/isize.js').ISize;

isz.get('../test/file.tgz')
    .then((result) => {
        console.log(result);
    });
