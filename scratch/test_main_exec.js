const fs = require('fs');

// Create a minimal DOM mock
const elements = new Map();
function createElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    classList: {
      _classes: new Set(),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      contains(c) { return this._classes.has(c); },
      toggle(c, force) {
        if (force !== undefined) {
          if (force) this._classes.add(c);
          else this._classes.delete(c);
        } else {
          if (this._classes.has(c)) this._classes.delete(c);
          else this._classes.add(c);
        }
      }
    },
    style: {},
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || ''; },
    addEventListener(evt, handler) { this._listeners = this._listeners || {}; (this._listeners[evt] = this._listeners[evt] || []).push(handler); },
    dispatchEvent(evt) { if (this._listeners && this._listeners[evt]) this._listeners[evt].forEach(fn => fn({ preventDefault(){}, stopPropagation(){} })); },
    querySelectorAll(sel) { return []; },
    querySelector(sel) { return null; },
    getBoundingClientRect() { return { top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100 }; },
    getContext() { return { clearRect(){}, scale(){}, createLinearGradient(){ return { addColorStop(){} }; }, createRadialGradient(){ return { addColorStop(){} }; }, fillRect(){}, save(){}, restore(){}, beginPath(){}, arc(){}, fill(){}, stroke(){} }; },
    appendChild() {},
    removeChild() {},
    insertBefore() {}
  };
  return el;
}

global.Image = class Image {
  constructor() {
    setTimeout(() => { if (this.onload) this.onload(); }, 10);
  }
};

global.window = {
  addEventListener() {},
  removeEventListener() {},
  matchMedia() { return { matches: false, addEventListener() {}, addListener() {} }; },
  requestAnimationFrame(fn) { return setTimeout(fn, 16); },
  innerWidth: 1920,
  innerHeight: 1080,
  scrollY: 0
};
global.document = {
  documentElement: createElement('html'),
  body: createElement('body'),
  fonts: { ready: Promise.resolve() },
  readyState: 'complete',
  getElementById(id) {
    if (!elements.has(id)) {
      elements.set(id, createElement('div'));
    }
    return elements.get(id);
  },
  querySelectorAll(sel) {
    if (sel === '.about-slide') {
      return [createElement('div'), createElement('div'), createElement('div'), createElement('div'), createElement('div')];
    }
    if (sel === '.about-deck-tab') {
      return [createElement('button'), createElement('button'), createElement('button'), createElement('button'), createElement('button')];
    }
    if (sel === '.about-go-next') {
      const b = createElement('button');
      elements.set('go-next-btn', b);
      return [b];
    }
    return [];
  },
  querySelector(sel) {
    return createElement('div');
  },
  createElement(tag) { return createElement(tag); },
  addEventListener() {}
};
global.navigator = { userAgent: 'node' };
global.requestAnimationFrame = global.window.requestAnimationFrame;

try {
  require('../assets/js/main.js');
  console.log('main.js loaded successfully without throwing!');
  
  // Test clicking goNext
  const goBtn = elements.get('go-next-btn');
  if (goBtn && goBtn._listeners && goBtn._listeners['click']) {
    console.log('Click listeners attached to .about-go-next:', goBtn._listeners['click'].length);
    goBtn._listeners['click'][0]({ preventDefault(){}, stopPropagation(){} });
    console.log('Successfully called goNext click handler!');
  } else {
    console.log('No click listener attached to go-next-btn!');
  }
} catch (e) {
  console.error('Error in main.js:', e);
}
