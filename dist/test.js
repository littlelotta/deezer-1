"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ID3 = require("node-id3");
const tags = ID3.read('Unendlichkeit.mp3');
console.log(tags);
