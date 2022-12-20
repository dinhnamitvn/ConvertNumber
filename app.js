var http = require("http");
var fs = require("fs");
var qs = require('querystring');

http.createServer(function (req, res) {
    if (req.url === "/" || req.url === "/index.html") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(__dirname + "/index.html").pipe(res);
    } else if (req.url === "/api/v1/convert-number") {
        let result = {};
        let reqBody = '';

        req.on('data', function (data) {
            reqBody += data;
        }).on('end', function () {
            let params = qs.parse(reqBody);
            let inputValue = params.inputValue;
            if (isRomanNumber(inputValue)) {
                let tmpRes = convertRomanToArabicNumber(inputValue) + "";
                result = { "status": true, res: tmpRes }
            } else {
                result = { "status": false, res: "" }
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(result));
            res.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': "text/plain-text" });
        res.end("Not found the page you requested.");
    }
}).listen(3000);

console.log("Listening on port 3000... ");

const convertRomanToArabicNumber = (input) => {
    return input
        .toUpperCase()
        .split('')
        .reduce(
            (acc, char) => {
                let negativeOffset = 0;
                const arabicValue = RomanLetterToDecimal[char];
                if (acc[1] < arabicValue) {
                    negativeOffset = -(acc[1] * 2);
                }
                return [(acc[0] += arabicValue + negativeOffset), arabicValue];
            },
            [0, 0]
        )[0];
};

// Function check if input is valid roman number
const isRomanNumber = (string) => {
    let regex = new RegExp(/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/);

    if (string == null) {
        return false;
    }
    return  regex.test(string);
}

const RomanLetterToDecimal = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
};
