// @ts-check
const { srcbin } = require('srcbin.js');

const bin = await srcbin.createBin({
    title: 'Test',
    files: [
        {
            name: 'test.txt',
            content: 'console.log(`Hellow, world!`)'
        }
    ]
});

console.log(bin);