/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t$1.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$2="?"+h,n$1=`<${o$2}>`,r$2=document,l=()=>r$2.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r$2.createTreeWalker(r$2,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n$1:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$2)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r$2.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r$2).importNode(i,true);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r$2,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$2.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(false,true,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t$1.litHtmlPolyfillSupport;j?.(N,R),(t$1.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return T}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer((()=>{customElements.define(t,e);})):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

let UniversalControllerCard = class UniversalControllerCard extends i {
    constructor() {
        super();
        this._userCode = '';
        this._htmlTemplate = '';
        this._cssStyles = '';
        this._executionResult = null;
        this._isExecuting = false;
        this._showCodeEditor = false;
        this._cardId = '';
        // Generate unique ID for this card instance
        this._cardId = `uc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static get styles() {
        return i$3 `
      :host {
        display: block;
        padding: 16px;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--divider-color);
      }

      .card-title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--disabled-text-color);
        transition: background 0.3s ease;
      }

      .status-indicator.success {
        background: var(--success-color);
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
      }

      .status-indicator.error {
        background: var(--error-color);
        box-shadow: 0 0 8px rgba(244, 67, 54, 0.4);
      }

      .tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color);
        margin-bottom: 16px;
      }

      .tab {
        flex: 1;
        padding: 8px 16px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: var(--secondary-text-color);
        transition: all 0.3s ease;
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }

      .tab:hover {
        background: var(--hover-color);
      }

      .content-section {
        margin-bottom: 16px;
      }

      .content-section.hidden {
        display: none;
      }

      .code-editor {
        width: 100%;
        min-height: 200px;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        background: var(--code-editor-background, #f8f9fa);
        color: var(--primary-text-color);
        resize: vertical;
      }

      .html-editor {
        width: 100%;
        min-height: 150px;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        background: var(--code-editor-background, #f8f9fa);
        color: var(--primary-text-color);
        resize: vertical;
      }

      .css-editor {
        width: 100%;
        min-height: 120px;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-family: 'Monaco', 'Consolas', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        background: var(--code-editor-background, #f8f9fa);
        color: var(--primary-text-color);
        resize: vertical;
      }

      .button-group {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .execute-btn {
        padding: 8px 16px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }

      .execute-btn:hover:not(:disabled) {
        background: var(--primary-color-dark);
        transform: translateY(-1px);
      }

      .execute-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .save-btn {
        padding: 8px 16px;
        background: var(--success-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }

      .save-btn:hover {
        background: var(--success-color-dark);
      }

      .reset-btn {
        padding: 8px 16px;
        background: var(--warning-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
      }

      .execution-result {
        margin-top: 16px;
        padding: 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 14px;
      }

      .execution-result.success {
        background: var(--success-color-light);
        color: var(--success-color-dark);
        border: 1px solid var(--success-color);
      }

      .execution-result.error {
        background: var(--error-color-light);
        color: var(--error-color-dark);
        border: 1px solid var(--error-color);
      }

      .rendered-content {
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 16px;
        margin-top: 12px;
      }

      .loading {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid var(--disabled-text-color);
        border-top: 2px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Dark theme support */
      @media (prefers-color-scheme: dark) {
        .code-editor,
        .html-editor,
        .css-editor {
          background: var(--code-editor-background, #2d2d2d);
          border-color: var(--border-color, #444);
        }
      }
    `;
    }
    setConfig(config) {
        this.config = config;
        this._showCodeEditor = config.show_code_editor ?? true;
        // Initialize with config data
        this._userCode = config.user_code || '';
        this._htmlTemplate = config.html_template || '';
        this._cssStyles = config.css_styles || '';
        // Load any saved configuration
        this._loadConfiguration();
    }
    firstUpdated() {
        // Set up periodic updates
        const interval = this.config.update_interval || 30000;
        setInterval(() => {
            if (this._userCode.trim()) {
                this._executeCode();
            }
        }, interval);
    }
    updated(changedProps) {
        // Card is self-contained, no entity updates needed
    }
    _loadConfiguration() {
        // Load from Home Assistant storage with unique card ID
        try {
            const storageKey = `universal_controller_${this._cardId}`;
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const data = JSON.parse(saved);
                this._userCode = data.userCode || this._userCode;
                this._htmlTemplate = data.htmlTemplate || this._htmlTemplate;
                this._cssStyles = data.cssStyles || this._cssStyles;
                console.log(`Loaded configuration for card: ${this._cardId}`);
            }
        }
        catch (error) {
            console.error('Failed to load configuration:', error);
        }
    }
    async _executeCode() {
        if (!this._userCode.trim() || this._isExecuting)
            return;
        this._isExecuting = true;
        try {
            // Create execution context
            const context = {
                hass: this.hass,
                states: this.hass.states,
                console: {
                    log: (...args) => console.log('[Universal Controller]', ...args),
                    error: (...args) => console.error('[Universal Controller]', ...args),
                }
            };
            // Execute the TypeScript/JavaScript code
            const result = await this._executeUserCode(this._userCode, context);
            this._executionResult = {
                success: true,
                result,
                timestamp: Date.now()
            };
        }
        catch (error) {
            this._executionResult = {
                success: false,
                error: error instanceof Error ? error.message : String(error),
                timestamp: Date.now()
            };
        }
        finally {
            this._isExecuting = false;
        }
    }
    async _executeUserCode(code, context) {
        // Create a safe execution environment
        const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
        // Prepare the code with context variables
        const contextKeys = Object.keys(context);
        const contextValues = Object.values(context);
        const wrappedCode = `
      "use strict";
      ${code}
    `;
        // Execute the code with the provided context
        const func = new AsyncFunction(...contextKeys, wrappedCode);
        return await func(...contextValues);
    }
    async _saveConfiguration() {
        // Use Home Assistant's storage system for persistence
        try {
            const data = {
                userCode: this._userCode,
                htmlTemplate: this._htmlTemplate,
                cssStyles: this._cssStyles,
                timestamp: Date.now()
            };
            // First try Home Assistant's storage
            if (this.hass.connection) {
                await this.hass.connection.sendMessagePromise({
                    type: 'persistent_notification/create',
                    notification_id: 'universal_controller_save',
                    title: 'Universal Controller',
                    message: 'Configuration saved successfully!'
                });
                // Store in hass user data with unique card ID
                const storageKey = `universal_controller_${this._cardId}`;
                localStorage.setItem(storageKey, JSON.stringify(data));
                console.log(`Configuration saved for card: ${this._cardId}`);
            }
            else {
                // Fallback to localStorage with unique card ID
                const storageKey = `universal_controller_${this._cardId}`;
                localStorage.setItem(storageKey, JSON.stringify(data));
                console.log(`Configuration saved locally for card: ${this._cardId}`);
            }
        }
        catch (error) {
            console.error('Failed to save configuration:', error);
            // Show error notification
            if (this.hass.connection) {
                await this.hass.connection.sendMessagePromise({
                    type: 'persistent_notification/create',
                    notification_id: 'universal_controller_error',
                    title: 'Universal Controller Error',
                    message: `Failed to save: ${error}`
                });
            }
        }
    }
    _resetToDefaults() {
        this._userCode = this.config.user_code || '';
        this._htmlTemplate = this.config.html_template || '';
        this._cssStyles = this.config.css_styles || '';
        this._executionResult = null;
    }
    _renderCustomContent() {
        if (!this._htmlTemplate || !this._executionResult?.success) {
            return x `<div class="rendered-content">No content to display</div>`;
        }
        try {
            // Simple template rendering (in production, you'd use a proper template engine)
            let renderedHtml = this._htmlTemplate;
            // Replace simple template variables
            if (this._executionResult.result) {
                renderedHtml = renderedHtml.replace(/\{\{\s*data\.(\w+)\s*\}\}/g, (match, key) => this._executionResult?.result?.[key] || '');
            }
            return x `
        <div class="rendered-content">
          <style>${this._cssStyles}</style>
          <div .innerHTML="${renderedHtml}"></div>
        </div>
      `;
        }
        catch (error) {
            return x `<div class="rendered-content error">Template rendering error: ${error}</div>`;
        }
    }
    render() {
        return x `
      <div class="card-header">
        <h2 class="card-title">${this.config.name || 'Universal Controller'}</h2>
        <div class="status-indicator ${this._executionResult?.success ? 'success' : this._executionResult ? 'error' : ''}"></div>
      </div>

      <div class="tabs">
        <button class="tab active" @click="${() => this._setActiveTab('preview')}">Preview</button>
        <button class="tab" @click="${() => this._setActiveTab('code')}">TypeScript</button>
        <button class="tab" @click="${() => this._setActiveTab('html')}">HTML</button>
        <button class="tab" @click="${() => this._setActiveTab('css')}">CSS</button>
      </div>

      <div class="content-section" id="preview-section">
        ${this._renderCustomContent()}
        
        ${this._executionResult ? x `
          <div class="execution-result ${this._executionResult.success ? 'success' : 'error'}">
            ${this._executionResult.success
            ? x `<strong>Execution successful:</strong><br>${JSON.stringify(this._executionResult.result, null, 2)}`
            : x `<strong>Error:</strong> ${this._executionResult.error}`}
          </div>
        ` : ''}
      </div>

      <div class="content-section hidden" id="code-section">
        <h3>TypeScript/JavaScript Code</h3>
        <textarea 
          class="code-editor" 
          .value="${this._userCode}"
          @input="${(e) => this._userCode = e.target.value}"
          placeholder="// TypeScript/JavaScript code that runs periodically
// Full access to Home Assistant API

const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

console.log(\`Found \${lights.length} lights\`);

return {
    lights_count: lights.length,
    current_time: new Date().toISOString()
};"
        ></textarea>
        
        <div class="button-group">
          <button class="execute-btn" @click="${this._executeCode}" ?disabled="${this._isExecuting}">
            ${this._isExecuting ? x `<span class="loading"><span class="spinner"></span>Executing...</span>` : 'Execute'}
          </button>
          <button class="save-btn" @click="${this._saveConfiguration}">Save</button>
          <button class="reset-btn" @click="${this._resetToDefaults}">Reset</button>
        </div>
      </div>

      <div class="content-section hidden" id="html-section">
        <h3>HTML Template</h3>
        <textarea 
          class="html-editor" 
          .value="${this._htmlTemplate}"
          @input="${(e) => this._htmlTemplate = e.target.value}"
          placeholder="<div class='custom-content'>
  <h3>{{ data.title }}</h3>
  <p>Lights: {{ data.lights_count }}</p>
</div>"
        ></textarea>
      </div>

      <div class="content-section hidden" id="css-section">
        <h3>CSS Styles</h3>
        <textarea 
          class="css-editor" 
          .value="${this._cssStyles}"
          @input="${(e) => this._cssStyles = e.target.value}"
          placeholder=".custom-content {
  padding: 16px;
  background: var(--card-background-color);
  border-radius: 8px;
}

.custom-content h3 {
  margin: 0 0 8px 0;
  color: var(--primary-text-color);
}"
        ></textarea>
      </div>
    `;
    }
    _setActiveTab(tab) {
        // Hide all sections
        this.shadowRoot?.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        // Remove active class from all tabs
        this.shadowRoot?.querySelectorAll('.tab').forEach(tabEl => {
            tabEl.classList.remove('active');
        });
        // Show selected section and activate tab
        const section = this.shadowRoot?.querySelector(`#${tab}-section`);
        const tabEl = this.shadowRoot?.querySelectorAll('.tab')[['preview', 'code', 'html', 'css'].indexOf(tab)];
        if (section)
            section.classList.remove('hidden');
        if (tabEl)
            tabEl.classList.add('active');
    }
    getCardSize() {
        return 6;
    }
    // Required for Home Assistant card picker
    static getConfigElement() {
        // For now, return null - users can configure in the GUI
        return null;
    }
    static getStubConfig() {
        return {
            type: 'custom:universal-controller-card',
            name: 'Universal Controller',
            user_code: `// TypeScript/JavaScript code that runs periodically
// Full access to Home Assistant API

const lights = Object.values(hass.states).filter(entity => 
    entity.entity_id.startsWith('light.')
);

console.log(\`Found \${lights.length} lights\`);

return {
    lights_count: lights.length,
    current_time: new Date().toISOString()
};`,
            html_template: `<div class='custom-content'>
  <h3>Universal Controller</h3>
  <p>Lights: {{ data.lights_count }}</p>
  <p>Time: {{ data.current_time }}</p>
</div>`,
            css_styles: `.custom-content {
  padding: 16px;
  background: var(--card-background-color);
  border-radius: 8px;
}

.custom-content h3 {
  margin: 0 0 8px 0;
  color: var(--primary-text-color);
}`
        };
    }
};
__decorate([
    n({ attribute: false })
], UniversalControllerCard.prototype, "hass", void 0);
__decorate([
    n({ attribute: false })
], UniversalControllerCard.prototype, "config", void 0);
__decorate([
    r()
], UniversalControllerCard.prototype, "_userCode", void 0);
__decorate([
    r()
], UniversalControllerCard.prototype, "_htmlTemplate", void 0);
__decorate([
    r()
], UniversalControllerCard.prototype, "_cssStyles", void 0);
__decorate([
    r()
], UniversalControllerCard.prototype, "_executionResult", void 0);
__decorate([
    r()
], UniversalControllerCard.prototype, "_isExecuting", void 0);
__decorate([
    r()
], UniversalControllerCard.prototype, "_showCodeEditor", void 0);
__decorate([
    r()
], UniversalControllerCard.prototype, "_cardId", void 0);
UniversalControllerCard = __decorate([
    t('universal-controller-card')
], UniversalControllerCard);
// Register for the card picker
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'custom:universal-controller-card',
    name: 'Universal Controller Card',
    description: 'A customizable card with TypeScript code execution, HTML templates, and CSS styling',
});

export { UniversalControllerCard };
