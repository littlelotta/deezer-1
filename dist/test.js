"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ID3 = require("node-id3");
const tags = ID3.read('test.mp3');
console.log(tags);
