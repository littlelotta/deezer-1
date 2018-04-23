"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const request = require("request");
const url = "http://play.publicradio.org/rivet/d/podcast/marketplace/segments/2015/09/28/mp_20150928_seg_01_64.mp3";
function writeBytesToFile(data, filename) {
    const wstream = fs_1.createWriteStream(filename);
    wstream.write(data);
    wstream.end();
}
function decryptTrack(data) {
    console.log('Converting into array');
    const buffer = Buffer.from(data);
    const dataArr = Uint8Array.from(data);
    const file = 'test.mp3';
    writeBytesToFile(dataArr, file);
    console.log(file);
}
request({
    url: url,
    method: 'get',
}, (err, httpsResponse, body) => {
    decryptTrack(body);
});
