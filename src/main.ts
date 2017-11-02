import 'core-js/es7/reflect';
// Angular wants it
import 'zone.js/dist/zone';

// Styles
import "./styles/styles.scss";

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';

import '@angular/platform-browser/animations';

//enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
