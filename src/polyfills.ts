import "core-js/es";
import "core-js/proposals/reflect-metadata";
import {enableProdMode} from '@angular/core';

require('zone.js/dist/zone');

if (process.env.ENV === 'production') {
    // Production
    enableProdMode();
} else {
    // Development
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}
