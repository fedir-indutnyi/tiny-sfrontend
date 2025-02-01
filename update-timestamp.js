#!/usr/bin/env node
'use strict';

const fs = require('fs');
const stamp = new Date().toISOString();


var dir = 'src/app/timestamp/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}


// The absolute path of the new file with its name
var filepath = "src/app/timestamp/Timestamp.ts";


fs.writeFileSync(filepath, `export class Timestamp { public static readonly stamp = '${stamp}'; }`);