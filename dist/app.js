"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Request = require("request");
const md5_1 = require("./md5");
const aesjs = require("./aes");
const request = Request.defaults({
    jar: Request.jar(),
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' }
});
var FILE_TYPES;
(function (FILE_TYPES) {
    FILE_TYPES[FILE_TYPES["MP3_256"] = 1] = "MP3_256";
    FILE_TYPES[FILE_TYPES["MP3_320"] = 3] = "MP3_320";
    FILE_TYPES[FILE_TYPES["FLAC"] = 9] = "FLAC";
})(FILE_TYPES || (FILE_TYPES = {}));
class AuthObject {
    constructor(token) {
        this.token = token;
    }
    static extractTokenFromHtml(html) {
        const tkn = this.rexp.exec(html);
        if (tkn !== null)
            return tkn[0].slice(13, -1);
        return '';
    }
    static async getNewAuth() {
        await new Promise(resolve => {
            request({
                url: 'https://www.deezer.com/ajax/action.php',
                method: 'post',
                form: {
                    type: 'login',
                    mail: 'tibegestep@hu4ht.com',
                    password: 'tibegestep@hu4ht.com',
                }
            }, (err, res, body) => {
                if (body !== 'success')
                    throw new Error('Could not log in');
                resolve();
            });
        });
        const tknBody = await new Promise(resolve => {
            request({
                url: 'https://www.deezer.com/en/',
                method: 'get'
            }, (err, httpsResponse, body) => {
                resolve(body);
            });
        });
        return new this(this.extractTokenFromHtml(tknBody));
    }
}
AuthObject.rexp = /checkForm ?= ?(\"|\').{32}\1/g;
class DZCrypt {
    static bfGenKey2(h1, h2) {
        var l = h1.length, s = [];
        for (var i = 0; i < l; i++)
            s.push(this.bfGK.charCodeAt(i) ^ h1.charCodeAt(i) ^ h2.charCodeAt(i));
        return s;
    }
    static bfGenKey(id, format) {
        var h = md5_1.hex_md5(id + '');
        var h1 = h.substr(0, 16), h2 = h.substr(16, 16);
        var k = this.bfGenKey2(h1, h2);
        if (!format)
            return k;
        return k.map(format == 'hex' ? ((a) => (a + 256).toString(16).substr(-2)) : ((a) => String.fromCharCode(a))).join('');
    }
    static zeroPad(b) {
        const aesBS = 16;
        var l = b.length;
        if (l % aesBS != 0) {
            if (typeof (b) === 'string')
                b += '\0'.repeat(aesBS - (l % aesBS));
            else
                b = b.concat(Array.apply(null, Array(aesBS - (l % aesBS))).map(() => 0));
        }
        return b;
    }
    ;
    static str2bin(s) {
        return s.split('').map(c => c.charCodeAt(0));
    }
    static bin2hex(b) {
        return aesjs.util.convertBytesToString(b, 'hex');
    }
    static encryptURL(track, fmt) {
        const urlsep = '\xa4';
        var str = [track.MD5_ORIGIN, fmt, track.SNG_ID, track.MEDIA_VERSION].join(urlsep);
        str = this.zeroPad([md5_1.hex_md5(str), str, ''].join(urlsep));
        return this.bin2hex(this.urlCryptor.encrypt(this.str2bin(str)));
    }
    static dzDownload(track, fmt = FILE_TYPES.MP3_320) {
        var msg = [
            'https://e-cdns-proxy-' + track.MD5_ORIGIN.charAt(0) + '.dzcdn.net' + '/mobile/1/' + this.encryptURL(track, fmt),
            this.bfGenKey(track.SNG_ID, '')
        ];
        console.log(msg);
    }
}
DZCrypt.bfGK = 'g4el58wc0zvf9na1';
DZCrypt.urlCryptor = new aesjs.ModeOfOperation.ecb(aesjs.util.convertStringToBytes('jo6aey6haid2Teih'));
class DZApi {
    constructor(auth) {
        this.auth = auth;
    }
    getTrackJSON(id) {
        return new Promise((resolve, reject) => {
            request({
                url: `https://www.deezer.com/ajax/gw-light.php?method=deezer.pageTrack&input=3&api_version=1.0&api_token=${this.auth.token}`,
                method: 'POST',
                json: { "sng_id": id, "lang": "en", "tab": 0 }
            }, (err, res, body) => {
                if (Object.keys(body.results).length === 0)
                    reject('Bad request');
                resolve(body.results.DATA);
            });
        });
    }
}
async function entry() {
    try {
        const auth = await AuthObject.getNewAuth();
        const api = new DZApi(auth);
        const info = await api.getTrackJSON(367505291);
        DZCrypt.dzDownload(info);
    }
    catch (err) {
        console.log(err);
    }
}
entry();
