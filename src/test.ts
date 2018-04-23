import * as ID3 from 'node-id3'


const tags = ID3.read('test.mp3')
console.log(tags)