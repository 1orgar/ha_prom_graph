function t(t,e,i,n){var l,s=arguments.length,r=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var o=t.length-1;o>=0;o--)(l=t[o])&&(r=(s<3?l(r):s>3?l(e,i,r):l(e,i))||r);return s>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),l=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=l.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&l.set(e,t))}return t}toString(){return this.cssText}};const r=t=>new s("string"==typeof t?t:t+"",void 0,n),o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new s(i,t,n)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return r(e)})(t):t,{is:c,defineProperty:u,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:f,getPrototypeOf:p}=Object,g=globalThis,m=g.trustedTypes,_=m?m.emptyScript:"",v=g.reactiveElementPolyfillSupport,x=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},b=(t,e)=>!c(t,e),w={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&u(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:l}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const s=n?.call(this);l?.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(x("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(x("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(x("properties"))){const t=this.properties,e=[...d(t),...f(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),l=e.litNonce;void 0!==l&&n.setAttribute("nonce",l),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const l=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==l?this.removeAttribute(n):this.setAttribute(n,l),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),l="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=n;const s=l.fromAttribute(e,t.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(t,e,i,n=!1,l){if(void 0!==t){const s=this.constructor;if(!1===n&&(l=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??b)(l,e)||i.useDefault&&i.reflect&&l===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:l},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==l||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[x("elementProperties")]=new Map,$[x("finalized")]=new Map,v?.({ReactiveElement:$}),(g.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const k=globalThis,A=t=>t,E=k.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+C,z=`<${P}>`,D=document,T=()=>D.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,H="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,N=/>/g,I=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,W=/"/g,j=/^(?:script|style|textarea|title)$/i,B=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),L=B(1),q=B(2),Y=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),K=new WeakMap,Q=D.createTreeWalker(D,129);function J(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,n=[];let l,s=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let o,a,c=-1,u=0;for(;u<i.length&&(r.lastIndex=u,a=r.exec(i),null!==a);)u=r.lastIndex,r===U?"!--"===a[1]?r=F:void 0!==a[1]?r=N:void 0!==a[2]?(j.test(a[2])&&(l=RegExp("</"+a[2],"g")),r=I):void 0!==a[3]&&(r=I):r===I?">"===a[0]?(r=l??U,c=-1):void 0===a[1]?c=-2:(c=r.lastIndex-a[2].length,o=a[1],r=void 0===a[3]?I:'"'===a[3]?W:V):r===W||r===V?r=I:r===F||r===N?r=U:(r=I,l=void 0);const h=r===I&&t[e+1].startsWith("/>")?" ":"";s+=r===U?i+z:c>=0?(n.push(o),i.slice(0,c)+M+i.slice(c)+C+h):i+C+(-2===c?e:h)}return[J(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class X{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let l=0,s=0;const r=t.length-1,o=this.parts,[a,c]=Z(t,e);if(this.el=X.createElement(a,i),Q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=Q.nextNode())&&o.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(M)){const e=c[s++],i=n.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);o.push({type:1,index:l,name:r[2],strings:i,ctor:"."===r[1]?lt:"?"===r[1]?st:"@"===r[1]?rt:nt}),n.removeAttribute(t)}else t.startsWith(C)&&(o.push({type:6,index:l}),n.removeAttribute(t));if(j.test(n.tagName)){const t=n.textContent.split(C),e=t.length-1;if(e>0){n.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],T()),Q.nextNode(),o.push({type:2,index:++l});n.append(t[e],T())}}}else if(8===n.nodeType)if(n.data===P)o.push({type:2,index:l});else{let t=-1;for(;-1!==(t=n.data.indexOf(C,t+1));)o.push({type:7,index:l}),t+=C.length-1}l++}}static createElement(t,e){const i=D.createElement("template");return i.innerHTML=t,i}}function tt(t,e,i=t,n){if(e===Y)return e;let l=void 0!==n?i._$Co?.[n]:i._$Cl;const s=O(e)?void 0:e._$litDirective$;return l?.constructor!==s&&(l?._$AO?.(!1),void 0===s?l=void 0:(l=new s(t),l._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=l:i._$Cl=l),void 0!==l&&(e=tt(t,l._$AS(t,e.values),l,n)),e}class et{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??D).importNode(e,!0);Q.currentNode=n;let l=Q.nextNode(),s=0,r=0,o=i[0];for(;void 0!==o;){if(s===o.index){let e;2===o.type?e=new it(l,l.nextSibling,this,t):1===o.type?e=new o.ctor(l,o.name,o.strings,this,t):6===o.type&&(e=new ot(l,this,t)),this._$AV.push(e),o=i[++r]}s!==o?.index&&(l=Q.nextNode(),s++)}return Q.currentNode=D,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class it{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),O(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==Y&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new et(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new X(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const l of t)n===e.length?e.push(i=new it(this.O(T()),this.O(T()),this,this.options)):i=e[n],i._$AI(l),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class nt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,l){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=l,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(t,e=this,i,n){const l=this.strings;let s=!1;if(void 0===l)t=tt(this,t,e,0),s=!O(t)||t!==this._$AH&&t!==Y,s&&(this._$AH=t);else{const n=t;let r,o;for(t=l[0],r=0;r<l.length-1;r++)o=tt(this,n[i+r],e,r),o===Y&&(o=this._$AH[r]),s||=!O(o)||o!==this._$AH[r],o===G?t=G:t!==G&&(t+=(o??"")+l[r+1]),this._$AH[r]=o}s&&!n&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class lt extends nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class st extends nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class rt extends nt{constructor(t,e,i,n,l){super(t,e,i,n,l),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??G)===Y)return;const i=this._$AH,n=t===G&&i!==G||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,l=t!==G&&(i===G||n);n&&this.element.removeEventListener(this.name,this,i),l&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const at=k.litHtmlPolyfillSupport;at?.(X,it),(k.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ut extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let l=n._$litPart$;if(void 0===l){const t=i?.renderBefore??null;n._$litPart$=l=new it(e.insertBefore(T(),t),t,void 0,i??{})}return l._$AI(t),l})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}}ut._$litElement$=!0,ut.finalized=!0,ct.litElementHydrateSupport?.({LitElement:ut});const ht=ct.litElementPolyfillSupport;ht?.({LitElement:ut}),(ct.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ft={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:b},pt=(t=ft,e,i)=>{const{kind:n,metadata:l}=i;let s=globalThis.litPropertyMetadata.get(l);if(void 0===s&&globalThis.litPropertyMetadata.set(l,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),s.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const l=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,l,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const l=this[n];e.call(this,i),this.requestUpdate(n,l,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gt(t){return(e,i)=>"object"==typeof i?pt(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function mt(t){return gt({...t,state:!0,attribute:!1})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class _t{constructor(t,e){this.hass=t,this.entryId=e}async instantQuery(t,e){return this.hass.callWS({type:"prometheus_dashboard/query",entry_id:this.entryId,query:t,time:e})}async rangeQuery(t,e,i,n){return this.hass.callWS({type:"prometheus_dashboard/query_range",entry_id:this.entryId,query:t,start:e,end:i,step:n})}async getLabels(){return(await this.hass.callWS({type:"prometheus_dashboard/labels",entry_id:this.entryId})).data}async getLabelValues(t){return(await this.hass.callWS({type:"prometheus_dashboard/label_values",entry_id:this.entryId,label:t})).data}async getMetadata(t){return(await this.hass.callWS({type:"prometheus_dashboard/metadata",entry_id:this.entryId,metric:t})).data}async getSeries(t){return(await this.hass.callWS({type:"prometheus_dashboard/series",entry_id:this.entryId,matchers:t})).data}static async getEntries(t){return t.callWS({type:"prometheus_dashboard/entries"})}}const vt=o`
  ha-card {
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    padding: 16px;
    background: var(--card-background-color, var(--paper-card-background-color, white));
    box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .card-header {
    font-weight: 500;
    font-size: 14px;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
  }

  .card-content {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .value-large {
    font-size: 36px;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.2;
  }

  .value-unit {
    font-size: 16px;
    font-weight: 400;
    color: var(--secondary-text-color);
    margin-left: 4px;
  }

  .icon-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color);
    opacity: 0.1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .error-state {
    color: var(--error-color, #db4437);
    font-size: 14px;
    padding: 16px;
    text-align: center;
  }

  .loading-state {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(
      to right,
      rgba(130, 130, 130, 0.2) 4%,
      rgba(130, 130, 130, 0.3) 25%,
      rgba(130, 130, 130, 0.2) 36%
    );
    background-size: 1000px 100%;
    height: 40px;
    border-radius: 4px;
    width: 100%;
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;class xt extends ut{constructor(){super(...arguments),this._loading=!1}setConfig(t){if(!t.type)throw new Error("Invalid configuration");this._config=t,this._hass&&(this._startAutoRefresh(),this._fetchData())}set hass(t){const e=!this._hass;this._hass=t,e&&this._config&&(this._startAutoRefresh(),this._fetchData())}connectedCallback(){super.connectedCallback(),this._hass&&this._config&&this._startAutoRefresh()}disconnectedCallback(){super.disconnectedCallback(),this._stopAutoRefresh()}get _client(){if(!this._cachedClient||this._config.entry_id!==this._cachedClient.entryId){const t=this._config.entry_id||"default";this._cachedClient=new _t(this._hass,t)}return this._cachedClient}_startAutoRefresh(){this._stopAutoRefresh();const t=1e3*(this._config.refresh_interval||30);this._interval=window.setInterval(()=>this._fetchData(),t)}_stopAutoRefresh(){this._interval&&(clearInterval(this._interval),this._interval=void 0)}getCardSize(){return 3}renderError(){return L`
      <ha-card>
        <div class="error-state">
          ${this._error}
        </div>
      </ha-card>
    `}renderLoading(){return L`
      <ha-card>
        <div class="loading-state"></div>
      </ha-card>
    `}}function yt(t,e=2,i){if(isNaN(t)||null==t)return"-";if("bytes"===i||"B"===i){const i=1024,n=["B","KB","MB","GB","TB","PB"];if(0===t)return"0 B";const l=Math.floor(Math.log(t)/Math.log(i));return parseFloat((t/Math.pow(i,l)).toFixed(e))+" "+n[l]}if("percent"===i||"%"===i)return parseFloat(t.toFixed(e))+"%";if("s"===i||"seconds"===i){if(t<60)return parseFloat(t.toFixed(e))+" s";const i=t/60;if(i<60)return parseFloat(i.toFixed(e))+" m";const n=i/60;if(n<24)return parseFloat(n.toFixed(e))+" h";return parseFloat((n/24).toFixed(e))+" d"}if("short"===i)return function(t){if(0===t)return"0";const e=Math.abs(t);return e>=1e9?(t/1e9).toFixed(1)+"B":e>=1e6?(t/1e6).toFixed(1)+"M":e>=1e3?(t/1e3).toFixed(1)+"K":parseFloat(t.toFixed(2)).toString()}(t);if("bps"===i){const i=1e3,n=["bps","Kbps","Mbps","Gbps","Tbps"];if(0===t)return"0 bps";const l=Math.floor(Math.log(t)/Math.log(i));return parseFloat((t/Math.pow(i,l)).toFixed(e))+" "+n[l]}const n=parseFloat(t.toFixed(e)).toString();return i?`${n} ${i}`:n}xt.styles=vt,t([gt({attribute:!1})],xt.prototype,"_hass",void 0),t([mt()],xt.prototype,"_config",void 0),t([mt()],xt.prototype,"_error",void 0),t([mt()],xt.prototype,"_loading",void 0);const bt=["#4CAF50","#2196F3","#F44336","#FF9800","#9C27B0","#00BCD4","#E91E63","#8BC34A","#FFC107","#795548"];function wt(t,e){if(!e||0===e.length)return bt[0];const i=[...e].sort((t,e)=>e.value-t.value);for(const e of i)if(t>=e.value)return e.color;return i[i.length-1].color||"#4CAF50"}function $t(t,e,i=500){const n=e-t;return`${Math.max(1,Math.floor(n/i))}s`}let kt=class extends ut{constructor(){super(...arguments),this.data=[],this.color="var(--primary-color)",this.fill=!1,this.height=40,this.width="100%"}render(){if(!this.data||0===this.data.length)return L``;const t=Math.min(...this.data),e=Math.max(...this.data)-t||1,i=this.data.map((i,n)=>`${n/(this.data.length-1)*100},${100-(i-t)/e*100}`).join(" "),n=`0,100 ${i} 100,100`;return L`
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style="height: ${this.height}px; width: ${this.width};"
      >
        ${this.fill?q`
          <defs>
            <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${this.color}" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="${this.color}" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <polygon points="${n}" fill="url(#fillGrad)" class="area"></polygon>
        `:""}
        <polyline points="${i}" stroke="${this.color}" class="line"></polyline>
      </svg>
    `}};kt.styles=o`
    :host {
      display: block;
    }
    svg {
      display: block;
      overflow: visible;
    }
    .line {
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .area {
      stroke: none;
    }
  `,t([gt({type:Array})],kt.prototype,"data",void 0),t([gt({type:String})],kt.prototype,"color",void 0),t([gt({type:Boolean})],kt.prototype,"fill",void 0),t([gt({type:Number})],kt.prototype,"height",void 0),t([gt({type:String})],kt.prototype,"width",void 0),kt=t([dt("prometheus-sparkline")],kt);let At=class extends xt{constructor(){super(...arguments),this._currentValue=null,this._sparklineData=[]}static getStubConfig(){return{type:"custom:prometheus-stat-card",name:"Prometheus Stat",query:"",entry_id:"",decimals:1,sparkline:!1}}static getConfigElement(){return document.createElement("prometheus-stat-card-editor")}setConfig(t){super.setConfig(t)}async _fetchData(){if(!this._config||!this._config.query)return;const t=this._config;try{if(this._loading=!0,t.sparkline){const e=t.sparkline_hours||24,i=Math.floor(Date.now()/1e3),n=i-3600*e,l=$t(n,i,100),s=await this._client.rangeQuery(t.query,n,i,l);if(s?.data?.result?.length>0&&s.data.result[0].values){const t=s.data.result[0].values.map(t=>parseFloat(t[1]));this._sparklineData=t,this._currentValue=t.length>0?t[t.length-1]:null}else this._sparklineData=[],this._currentValue=null}else{const e=await this._client.instantQuery(t.query);e?.data?.result?.length>0&&e.data.result[0].value?this._currentValue=parseFloat(e.data.result[0].value[1]):this._currentValue=null,this._sparklineData=[]}this._data=this._currentValue,this._error=void 0}catch(t){this._error=t.message||"Error fetching data"}finally{this._loading=!1}}render(){if(!this._config)return L``;const t=this._config;if(this._error)return this.renderError();if(this._loading&&null===this._currentValue)return this.renderLoading();const e=wt(this._currentValue,t.thresholds||[]),i=void 0!==t.decimals?t.decimals:1,n=null!==this._currentValue?yt(this._currentValue,i):"-";return L`
      <ha-card>
        <div class="stat-container">
          ${t.icon?L`
            <div class="icon-container" style="--icon-color: ${e}">
              <ha-icon .icon="${t.icon}"></ha-icon>
            </div>
          `:""}
          <div class="info-container">
            ${t.name?L`<div class="name">${t.name}</div>`:""}
            <div class="value-container">
              <span class="value">${n}</span>
              ${t.unit?L`<span class="unit">${t.unit}</span>`:""}
            </div>
          </div>
        </div>
        ${t.sparkline&&this._sparklineData.length>0?L`
          <div class="sparkline-container">
            <prometheus-sparkline 
              .data="${this._sparklineData}" 
              .color="${e}"
            ></prometheus-sparkline>
          </div>
        `:""}
      </ha-card>
    `}static get styles(){return[vt,o`
        ha-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .stat-container {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: color-mix(in srgb, var(--icon-color, var(--primary-color)) 20%, transparent);
          color: var(--icon-color, var(--primary-color));
        }
        .info-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .name {
          font-size: 14px;
          color: var(--secondary-text-color);
          font-weight: 500;
        }
        .value-container {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .value {
          font-size: 36px;
          font-weight: 400;
          color: var(--primary-text-color);
        }
        .unit {
          font-size: 16px;
          color: var(--secondary-text-color);
        }
        .sparkline-container {
          height: 40px;
          width: 100%;
        }
      `]}};t([mt()],At.prototype,"_currentValue",void 0),t([mt()],At.prototype,"_sparklineData",void 0),At=t([dt("prometheus-stat-card")],At),window.customCards=window.customCards||[],window.customCards.push({type:"prometheus-stat-card",name:"Prometheus Stat",description:"Display a Prometheus metric as a stat value",preview:!0});let Et=class extends xt{constructor(){super(...arguments),this._currentValue=null}static getStubConfig(){return{type:"custom:prometheus-gauge-card",name:"Prometheus Gauge",query:"",entry_id:"",min:0,max:100,decimals:1,arc_width:8}}static getConfigElement(){return document.createElement("prometheus-gauge-card-editor")}setConfig(t){super.setConfig(t)}async _fetchData(){if(this._config&&this._config.query)try{this._loading=!0;const t=await this._client.instantQuery(this._config.query);t?.data?.result?.length>0&&t.data.result[0].value?this._currentValue=parseFloat(t.data.result[0].value[1]):this._currentValue=null,this._data=this._currentValue,this._error=void 0}catch(t){this._error=t.message||"Error fetching data"}finally{this._loading=!1}}render(){if(!this._config)return L``;const t=this._config;if(this._error)return this.renderError();if(this._loading&&null===this._currentValue)return this.renderLoading();const e=void 0!==t.min?t.min:0,i=void 0!==t.max?t.max:100,n=void 0!==t.decimals?t.decimals:1,l=void 0!==t.arc_width?t.arc_width:8,s=null!==this._currentValue?this._currentValue:e,r=Math.min(Math.max(s,e),i),o=40*Math.PI,a=o*(1-(r-e)/(i-e)),c=wt(this._currentValue,t.thresholds||[]),u=null!==this._currentValue?yt(this._currentValue,n):"-";return L`
      <ha-card>
        ${t.name?L`<div class="name">${t.name}</div>`:""}
        
        <div class="gauge-container">
          <svg viewBox="0 0 100 60" class="gauge-svg">
            <path
              class="arc-bg"
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke-width="${l}"
              stroke-linecap="round"
            ></path>
            
            <path
              class="arc-fg"
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="${c}"
              stroke-width="${l}"
              stroke-linecap="round"
              stroke-dasharray="${o}"
              stroke-dashoffset="${a}"
            ></path>
          </svg>
          
          <div class="value-container">
            <span class="value">${u}</span>
            ${t.unit?L`<span class="unit">${t.unit}</span>`:""}
          </div>
          
          <div class="labels">
            <span class="min-label">${e}</span>
            <span class="max-label">${i}</span>
          </div>
        </div>
      </ha-card>
    `}static get styles(){return[vt,o`
        ha-card {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .name {
          font-size: 14px;
          color: var(--secondary-text-color);
          font-weight: 500;
          align-self: flex-start;
        }
        .gauge-container {
          position: relative;
          width: 100%;
          max-width: 250px;
          aspect-ratio: 100 / 60;
        }
        .gauge-svg {
          width: 100%;
          height: 100%;
        }
        .arc-bg {
          stroke: var(--divider-color, #e0e0e0);
        }
        .arc-fg {
          transition: stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease-in-out;
        }
        .value-container {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .value {
          font-size: 28px;
          font-weight: 400;
          color: var(--primary-text-color);
          line-height: 1;
        }
        .unit {
          font-size: 14px;
          color: var(--secondary-text-color);
        }
        .labels {
          position: absolute;
          bottom: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 5%;
          box-sizing: border-box;
        }
        .min-label, .max-label {
          font-size: 12px;
          color: var(--secondary-text-color);
        }
      `]}};t([mt()],Et.prototype,"_currentValue",void 0),Et=t([dt("prometheus-gauge-card")],Et),window.customCards=window.customCards||[],window.customCards.push({type:"prometheus-gauge-card",name:"Prometheus Gauge",description:"Display a Prometheus metric as a gauge",preview:!0});const St="u-off",Mt="u-label",Ct="width",Pt="height",zt="top",Dt="bottom",Tt="left",Ot="right",Rt="#000",Ht=Rt+"0",Ut="mousemove",Ft="mousedown",Nt="mouseup",It="mouseenter",Vt="mouseleave",Wt="dblclick",jt="change",Bt="dppxchange",Lt="--",qt="undefined"!=typeof window,Yt=qt?document:null,Gt=qt?window:null,Kt=qt?navigator:null;let Qt,Jt;function Zt(t,e){if(null!=e){let i=t.classList;!i.contains(e)&&i.add(e)}}function Xt(t,e){let i=t.classList;i.contains(e)&&i.remove(e)}function te(t,e,i){t.style[e]=i+"px"}function ee(t,e,i,n){let l=Yt.createElement(t);return null!=e&&Zt(l,e),null!=i&&i.insertBefore(l,n),l}function ie(t,e){return ee("div",t,e)}const ne=new WeakMap;function le(t,e,i,n,l){let s="translate("+e+"px,"+i+"px)";s!=ne.get(t)&&(t.style.transform=s,ne.set(t,s),e<0||i<0||e>n||i>l?Zt(t,St):Xt(t,St))}const se=new WeakMap;function re(t,e,i){let n=e+i;n!=se.get(t)&&(se.set(t,n),t.style.background=e,t.style.borderColor=i)}const oe=new WeakMap;function ae(t,e,i,n){let l=e+""+i;l!=oe.get(t)&&(oe.set(t,l),t.style.height=i+"px",t.style.width=e+"px",t.style.marginLeft=n?-e/2+"px":0,t.style.marginTop=n?-i/2+"px":0)}const ce={passive:!0},ue={...ce,capture:!0};function he(t,e,i,n){e.addEventListener(t,i,n?ue:ce)}function de(t,e,i,n){e.removeEventListener(t,i,ce)}function fe(t,e,i,n){let l;i=i||0;let s=(n=n||e.length-1)<=2147483647;for(;n-i>1;)l=s?i+n>>1:De((i+n)/2),e[l]<t?i=l:n=l;return t-e[i]<=e[n]-t?i:n}function pe(t){return(e,i,n)=>{let l=-1,s=-1;for(let s=i;s<=n;s++)if(t(e[s])){l=s;break}for(let l=n;l>=i;l--)if(t(e[l])){s=l;break}return[l,s]}}qt&&function t(){let e=devicePixelRatio;Qt!=e&&(Qt=e,Jt&&de(jt,Jt,t),Jt=matchMedia(`(min-resolution: ${Qt-.001}dppx) and (max-resolution: ${Qt+.001}dppx)`),he(jt,Jt,t),Gt.dispatchEvent(new CustomEvent(Bt)))}();const ge=t=>null!=t,me=t=>null!=t&&t>0,_e=pe(ge),ve=pe(me);function xe(t,e,i,n){let l=Fe(t),s=Fe(e);t==e&&(-1==l?(t*=i,e/=i):(t/=i,e*=i));let r=10==i?Ne:Ie,o=1==s?Oe:De,a=(1==l?De:Oe)(r(ze(t))),c=o(r(ze(e))),u=Ue(i,a),h=Ue(i,c);return 10==i&&(a<0&&(u=ni(u,-a)),c<0&&(h=ni(h,-c))),n||2==i?(t=u*l,e=h*s):(t=ii(t,u),e=ei(e,h)),[t,e]}function ye(t,e,i,n){let l=xe(t,e,i,n);return 0==t&&(l[0]=0),0==e&&(l[1]=0),l}const be={mode:3,pad:.1},we={pad:0,soft:null,mode:0},$e={min:we,max:we};function ke(t,e,i,n){return fi(i)?Ee(t,e,i):(we.pad=i,we.soft=n?0:null,we.mode=n?3:0,Ee(t,e,$e))}function Ae(t,e){return null==t?e:t}function Ee(t,e,i){let n=i.min,l=i.max,s=Ae(n.pad,0),r=Ae(l.pad,0),o=Ae(n.hard,-We),a=Ae(l.hard,We),c=Ae(n.soft,We),u=Ae(l.soft,-We),h=Ae(n.mode,0),d=Ae(l.mode,0),f=e-t,p=Ne(f),g=He(ze(t),ze(e)),m=Ne(g),_=ze(m-p);(f<1e-24||_>10)&&(f=0,0!=t&&0!=e||(f=1e-24,2==h&&c!=We&&(s=0),2==d&&u!=-We&&(r=0)));let v=f||g||1e3,x=Ne(v),y=Ue(10,De(x)),b=ni(ii(t-v*(0==f?0==t?.1:1:s),y/10),24),w=t>=c&&(1==h||3==h&&b<=c||2==h&&b>=c)?c:We,$=He(o,b<w&&t>=w?w:Re(w,b)),k=ni(ei(e+v*(0==f?0==e?.1:1:r),y/10),24),A=e<=u&&(1==d||3==d&&k>=u||2==d&&k<=u)?u:-We,E=Re(a,k>A&&e<=A?A:He(A,k));return $==E&&0==$&&(E=100),[$,E]}const Se=new Intl.NumberFormat(qt?Kt.language:"en-US"),Me=t=>Se.format(t),Ce=Math,Pe=Ce.PI,ze=Ce.abs,De=Ce.floor,Te=Ce.round,Oe=Ce.ceil,Re=Ce.min,He=Ce.max,Ue=Ce.pow,Fe=Ce.sign,Ne=Ce.log10,Ie=Ce.log2,Ve=(t,e=1)=>Ce.asinh(t/e),We=1/0;function je(t){return 1+(0|Ne((t^t>>31)-(t>>31)))}function Be(t,e,i){return Re(He(t,e),i)}function Le(t){return"function"==typeof t}function qe(t){return Le(t)?t:()=>t}const Ye=t=>t,Ge=(t,e)=>e,Ke=t=>null,Qe=t=>!0,Je=(t,e)=>t==e,Ze=/\.\d*?(?=9{6,}|0{6,})/gm,Xe=t=>{if(hi(t)||li.has(t))return t;const e=`${t}`,i=e.match(Ze);if(null==i)return t;let n=i[0].length-1;if(-1!=e.indexOf("e-")){let[t,i]=e.split("e");return+`${Xe(t)}e${i}`}return ni(t,n)};function ti(t,e){return Xe(ni(Xe(t/e))*e)}function ei(t,e){return Xe(Oe(Xe(t/e))*e)}function ii(t,e){return Xe(De(Xe(t/e))*e)}function ni(t,e=0){if(hi(t))return t;let i=10**e,n=t*i*(1+Number.EPSILON);return Te(n)/i}const li=new Map;function si(t){return((""+t).split(".")[1]||"").length}function ri(t,e,i,n){let l=[],s=n.map(si);for(let r=e;r<i;r++){let e=ze(r),i=ni(Ue(t,r),e);for(let o=0;o<n.length;o++){let a=10==t?+`${n[o]}e${r}`:n[o]*i,c=(r>=0?0:e)+(r>=s[o]?0:s[o]),u=10==t?a:ni(a,c);l.push(u),li.set(u,c)}}return l}const oi={},ai=[],ci=[null,null],ui=Array.isArray,hi=Number.isInteger;function di(t){return"string"==typeof t}function fi(t){let e=!1;if(null!=t){let i=t.constructor;e=null==i||i==Object}return e}function pi(t){return null!=t&&"object"==typeof t}const gi=Object.getPrototypeOf(Uint8Array),mi="__proto__";function _i(t,e=fi){let i;if(ui(t)){let n=t.find(t=>null!=t);if(ui(n)||e(n)){i=Array(t.length);for(let n=0;n<t.length;n++)i[n]=_i(t[n],e)}else i=t.slice()}else if(t instanceof gi)i=t.slice();else if(e(t)){i={};for(let n in t)n!=mi&&(i[n]=_i(t[n],e))}else i=t;return i}function vi(t){let e=arguments;for(let i=1;i<e.length;i++){let n=e[i];for(let e in n)e!=mi&&(fi(t[e])?vi(t[e],_i(n[e])):t[e]=_i(n[e]))}return t}function xi(t,e,i){for(let n,l=0,s=-1;l<e.length;l++){let r=e[l];if(r>s){for(n=r-1;n>=0&&null==t[n];)t[n--]=null;for(n=r+1;n<i&&null==t[n];)t[s=n++]=null}}}const yi="undefined"==typeof queueMicrotask?t=>Promise.resolve().then(t):queueMicrotask;const bi=["January","February","March","April","May","June","July","August","September","October","November","December"],wi=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function $i(t){return t.slice(0,3)}const ki=wi.map($i),Ai=bi.map($i),Ei={MMMM:bi,MMM:Ai,WWWW:wi,WWW:ki};function Si(t){return(t<10?"0":"")+t}const Mi={YYYY:t=>t.getFullYear(),YY:t=>(t.getFullYear()+"").slice(2),MMMM:(t,e)=>e.MMMM[t.getMonth()],MMM:(t,e)=>e.MMM[t.getMonth()],MM:t=>Si(t.getMonth()+1),M:t=>t.getMonth()+1,DD:t=>Si(t.getDate()),D:t=>t.getDate(),WWWW:(t,e)=>e.WWWW[t.getDay()],WWW:(t,e)=>e.WWW[t.getDay()],HH:t=>Si(t.getHours()),H:t=>t.getHours(),h:t=>{let e=t.getHours();return 0==e?12:e>12?e-12:e},AA:t=>t.getHours()>=12?"PM":"AM",aa:t=>t.getHours()>=12?"pm":"am",a:t=>t.getHours()>=12?"p":"a",mm:t=>Si(t.getMinutes()),m:t=>t.getMinutes(),ss:t=>Si(t.getSeconds()),s:t=>t.getSeconds(),fff:t=>{return((e=t.getMilliseconds())<10?"00":e<100?"0":"")+e;var e}};function Ci(t,e){e=e||Ei;let i,n=[],l=/\{([a-z]+)\}|[^{]+/gi;for(;i=l.exec(t);)n.push("{"==i[0][0]?Mi[i[1]]:i[0]);return t=>{let i="";for(let l=0;l<n.length;l++)i+="string"==typeof n[l]?n[l]:n[l](t,e);return i}}const Pi=(new Intl.DateTimeFormat).resolvedOptions().timeZone;const zi=t=>t%1==0,Di=[1,2,2.5,5],Ti=ri(10,-32,0,Di),Oi=ri(10,0,32,Di),Ri=Oi.filter(zi),Hi=Ti.concat(Oi),Ui="{YYYY}",Fi="\n"+Ui,Ni="{M}/{D}",Ii="\n"+Ni,Vi=Ii+"/{YY}",Wi="{aa}",ji="{h}:{mm}"+Wi,Bi="\n"+ji,Li=":{ss}",qi=null;function Yi(t){let e=1e3*t,i=60*e,n=60*i,l=24*n,s=30*l,r=365*l;return[(1==t?ri(10,0,3,Di).filter(zi):ri(10,-3,0,Di)).concat([e,5*e,10*e,15*e,30*e,i,5*i,10*i,15*i,30*i,n,2*n,3*n,4*n,6*n,8*n,12*n,l,2*l,3*l,4*l,5*l,6*l,7*l,8*l,9*l,10*l,15*l,s,2*s,3*s,4*s,6*s,r,2*r,5*r,10*r,25*r,50*r,100*r]),[[r,Ui,qi,qi,qi,qi,qi,qi,1],[28*l,"{MMM}",Fi,qi,qi,qi,qi,qi,1],[l,Ni,Fi,qi,qi,qi,qi,qi,1],[n,"{h}"+Wi,Vi,qi,Ii,qi,qi,qi,1],[i,ji,Vi,qi,Ii,qi,qi,qi,1],[e,Li,Vi+" "+ji,qi,Ii+" "+ji,qi,Bi,qi,1],[t,Li+".{fff}",Vi+" "+ji,qi,Ii+" "+ji,qi,Bi,qi,1]],function(e){return(o,a,c,u,h,d)=>{let f=[],p=h>=r,g=h>=s&&h<r,m=e(c),_=ni(m*t,3),v=nn(m.getFullYear(),p?0:m.getMonth(),g||p?1:m.getDate()),x=ni(v*t,3);if(g||p){let i=g?h/s:0,n=p?h/r:0,l=_==x?_:ni(nn(v.getFullYear()+n,v.getMonth()+i,1)*t,3),o=new Date(Te(l/t)),a=o.getFullYear(),c=o.getMonth();for(let s=0;l<=u;s++){let r=nn(a+n*s,c+i*s,1),o=r-e(ni(r*t,3));l=ni((+r+o)*t,3),l<=u&&f.push(l)}}else{let s=h>=l?l:h,r=x+(De(c)-De(_))+ei(_-x,s);f.push(r);let p=e(r),g=p.getHours()+p.getMinutes()/i+p.getSeconds()/n,m=h/n,v=d/o.axes[a]._space;for(;r=ni(r+h,1==t?0:3),!(r>u);)if(m>1){let t=De(ni(g+m,6))%24,i=e(r).getHours()-t;i>1&&(i=-1),r-=i*n,g=(g+m)%24,ni((r-f[f.length-1])/h,3)*v>=.7&&f.push(r)}else f.push(r)}return f}}]}const[Gi,Ki,Qi]=Yi(1),[Ji,Zi,Xi]=Yi(.001);function tn(t,e){return t.map(t=>t.map((i,n)=>0==n||8==n||null==i?i:e(1==n||0==t[8]?i:t[1]+i)))}function en(t,e){return(i,n,l,s,r)=>{let o,a,c,u,h,d,f=e.find(t=>r>=t[0])||e[e.length-1];return n.map(e=>{let i=t(e),n=i.getFullYear(),l=i.getMonth(),s=i.getDate(),r=i.getHours(),p=i.getMinutes(),g=i.getSeconds(),m=n!=o&&f[2]||l!=a&&f[3]||s!=c&&f[4]||r!=u&&f[5]||p!=h&&f[6]||g!=d&&f[7]||f[1];return o=n,a=l,c=s,u=r,h=p,d=g,m(i)})}}function nn(t,e,i){return new Date(t,e,i)}function ln(t,e){return e(t)}ri(2,-53,53,[1]);function sn(t,e){return(i,n,l,s)=>null==s?Lt:e(t(n))}const rn={show:!0,live:!0,isolate:!1,mount:()=>{},markers:{show:!0,width:2,stroke:function(t,e){let i=t.series[e];return i.width?i.stroke(t,e):i.points.width?i.points.stroke(t,e):null},fill:function(t,e){return t.series[e].fill(t,e)},dash:"solid"},idx:null,idxs:null,values:[]};const on=[0,0];function an(t,e,i,n=!0){return t=>{0==t.button&&(!n||t.target==e)&&i(t)}}function cn(t,e,i,n=!0){return t=>{(!n||t.target==e)&&i(t)}}const un={show:!0,x:!0,y:!0,lock:!1,move:function(t,e,i){return on[0]=e,on[1]=i,on},points:{one:!1,show:function(t,e){let i=t.cursor.points,n=ie(),l=i.size(t,e);te(n,Ct,l),te(n,Pt,l);let s=l/-2;te(n,"marginLeft",s),te(n,"marginTop",s);let r=i.width(t,e,l);return r&&te(n,"borderWidth",r),n},size:function(t,e){return t.series[e].points.size},width:0,stroke:function(t,e){let i=t.series[e].points;return i._stroke||i._fill},fill:function(t,e){let i=t.series[e].points;return i._fill||i._stroke}},bind:{mousedown:an,mouseup:an,click:an,dblclick:an,mousemove:cn,mouseleave:cn,mouseenter:cn},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(t,e)=>{e.stopPropagation(),e.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(t,e,i,n,l)=>n-l,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},hn={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},dn=vi({},hn,{filter:Ge}),fn=vi({},dn,{size:10}),pn=vi({},hn,{show:!1}),gn='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',mn="bold "+gn,_n={show:!0,scale:"x",stroke:Rt,space:50,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:mn,side:2,grid:dn,ticks:fn,border:pn,font:gn,lineGap:1.5,rotate:0},vn={show:!0,scale:"x",auto:!1,sorted:1,min:We,max:-We,idxs:[]};function xn(t,e,i,n,l){return e.map(t=>null==t?"":Me(t))}function yn(t,e,i,n,l,s,r){let o=[],a=li.get(l)||0;for(let t=i=r?i:ni(ei(i,l),a);t<=n;t=ni(t+l,a))o.push(Object.is(t,-0)?0:t);return o}function bn(t,e,i,n,l,s,r){const o=[],a=t.scales[t.axes[e].scale].log,c=De((10==a?Ne:Ie)(i));l=Ue(a,c),10==a&&(l=Hi[fe(l,Hi)]);let u=i,h=l*a;10==a&&(h=Hi[fe(h,Hi)]);do{o.push(u),u+=l,10!=a||li.has(u)||(u=ni(u,li.get(l))),u>=h&&(h=(l=u)*a,10==a&&(h=Hi[fe(h,Hi)]))}while(u<=n);return o}function wn(t,e,i,n,l,s,r){let o=t.scales[t.axes[e].scale].asinh,a=n>o?bn(t,e,He(o,i),n,l):[o],c=n>=0&&i<=0?[0]:[];return(i<-o?bn(t,e,He(o,-n),-i,l):[o]).reverse().map(t=>-t).concat(c,a)}const $n=/./,kn=/[12357]/,An=/[125]/,En=/1/,Sn=(t,e,i,n)=>t.map((t,l)=>4==e&&0==t||l%n==0&&i.test(t.toExponential()[t<0?1:0])?t:null);function Mn(t,e,i,n,l){let s=t.axes[i],r=s.scale,o=t.scales[r],a=t.valToPos,c=s._space,u=a(10,r),h=a(9,r)-u>=c?$n:a(7,r)-u>=c?kn:a(5,r)-u>=c?An:En;if(h==En){let t=ze(a(1,r)-u);if(t<c)return Sn(e.slice().reverse(),o.distr,h,Oe(c/t)).reverse()}return Sn(e,o.distr,h,1)}function Cn(t,e,i,n,l){let s=t.axes[i],r=s.scale,o=s._space,a=t.valToPos,c=ze(a(1,r)-a(2,r));return c<o?Sn(e.slice().reverse(),3,$n,Oe(o/c)).reverse():e}function Pn(t,e,i,n){return null==n?Lt:null==e?"":Me(e)}const zn={show:!0,scale:"y",stroke:Rt,space:30,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:mn,side:3,grid:dn,ticks:fn,border:pn,font:gn,lineGap:1.5,rotate:0};const Dn={scale:null,auto:!0,sorted:0,min:We,max:-We},Tn=(t,e,i,n,l)=>l,On={show:!0,auto:!0,sorted:0,gaps:Tn,alpha:1,facets:[vi({},Dn,{scale:"x"}),vi({},Dn,{scale:"y"})]},Rn={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:Tn,alpha:1,points:{show:function(t,e){let{scale:i,idxs:n}=t.series[0],l=t._data[0],s=t.valToPos(l[n[0]],i,!0),r=t.valToPos(l[n[1]],i,!0),o=ze(r-s)/(t.series[e].points.space*Qt);return n[1]-n[0]<=o},filter:null},values:null,min:We,max:-We,idxs:[],path:null,clip:null};function Hn(t,e,i,n,l){return i/10}const Un={time:!0,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},Fn=vi({},Un,{time:!1,ori:1}),Nn={};function In(t,e){let i=Nn[t];return i||(i={key:t,plots:[],sub(t){i.plots.push(t)},unsub(t){i.plots=i.plots.filter(e=>e!=t)},pub(t,e,n,l,s,r,o){for(let a=0;a<i.plots.length;a++)i.plots[a]!=e&&i.plots[a].pub(t,e,n,l,s,r,o)}},null!=t&&(Nn[t]=i)),i}function Vn(t,e,i){const n=t.mode,l=t.series[e],s=2==n?t._data[e]:t._data,r=t.scales,o=t.bbox;let a=s[0],c=2==n?s[1]:s[e],u=2==n?r[l.facets[0].scale]:r[t.series[0].scale],h=2==n?r[l.facets[1].scale]:r[l.scale],d=o.left,f=o.top,p=o.width,g=o.height,m=t.valToPosH,_=t.valToPosV;return 0==u.ori?i(l,a,c,u,h,m,_,d,f,p,g,Kn,Jn,Xn,el,nl):i(l,a,c,u,h,_,m,f,d,g,p,Qn,Zn,tl,il,ll)}function Wn(t,e){let i=0,n=0,l=Ae(t.bands,ai);for(let t=0;t<l.length;t++){let s=l[t];s.series[0]==e?i=s.dir:s.series[1]==e&&(1==s.dir?n|=1:n|=2)}return[i,1==n?-1:2==n?1:3==n?2:0]}function jn(t,e,i,n,l){let s=t.mode,r=t.series[e],o=2==s?r.facets[1].scale:r.scale,a=t.scales[o];return-1==l?a.min:1==l?a.max:3==a.distr?1==a.dir?a.min:a.max:0}function Bn(t,e,i,n,l,s){return Vn(t,e,(t,e,r,o,a,c,u,h,d,f,p)=>{let g=t.pxRound;const m=o.dir*(0==o.ori?1:-1),_=0==o.ori?Jn:Zn;let v,x;1==m?(v=i,x=n):(v=n,x=i);let y=g(c(e[v],o,f,h)),b=g(u(r[v],a,p,d)),w=g(c(e[x],o,f,h)),$=g(u(1==s?a.max:a.min,a,p,d)),k=new Path2D(l);return _(k,w,$),_(k,y,$),_(k,y,b),k})}function Ln(t,e,i,n,l,s){let r=null;if(t.length>0){r=new Path2D;const o=0==e?Xn:tl;let a=i;for(let e=0;e<t.length;e++){let i=t[e];if(i[1]>i[0]){let t=i[0]-a;t>0&&o(r,a,n,t,n+s),a=i[1]}}let c=i+l-a,u=10;c>0&&o(r,a,n-u/2,c,n+s+u)}return r}function qn(t,e,i,n,l,s,r){let o=[],a=t.length;for(let c=1==l?i:n;c>=i&&c<=n;c+=l){if(null===e[c]){let u=c,h=c;if(1==l)for(;++c<=n&&null===e[c];)h=c;else for(;--c>=i&&null===e[c];)h=c;let d=s(t[u]),f=h==u?d:s(t[h]),p=u-l;d=r<=0&&p>=0&&p<a?s(t[p]):d;let g=h+l;f=r>=0&&g>=0&&g<a?s(t[g]):f,f>=d&&o.push([d,f])}}return o}function Yn(t){return 0==t?Ye:1==t?Te:e=>ti(e,t)}function Gn(t){let e=0==t?Kn:Qn,i=0==t?(t,e,i,n,l,s)=>{t.arcTo(e,i,n,l,s)}:(t,e,i,n,l,s)=>{t.arcTo(i,e,l,n,s)},n=0==t?(t,e,i,n,l)=>{t.rect(e,i,n,l)}:(t,e,i,n,l)=>{t.rect(i,e,l,n)};return(t,l,s,r,o,a=0,c=0)=>{0==a&&0==c?n(t,l,s,r,o):(a=Re(a,r/2,o/2),c=Re(c,r/2,o/2),e(t,l+a,s),i(t,l+r,s,l+r,s+o,a),i(t,l+r,s+o,l,s+o,c),i(t,l,s+o,l,s,c),i(t,l,s,l+r,s,a),t.closePath())}}const Kn=(t,e,i)=>{t.moveTo(e,i)},Qn=(t,e,i)=>{t.moveTo(i,e)},Jn=(t,e,i)=>{t.lineTo(e,i)},Zn=(t,e,i)=>{t.lineTo(i,e)},Xn=Gn(0),tl=Gn(1),el=(t,e,i,n,l,s)=>{t.arc(e,i,n,l,s)},il=(t,e,i,n,l,s)=>{t.arc(i,e,n,l,s)},nl=(t,e,i,n,l,s,r)=>{t.bezierCurveTo(e,i,n,l,s,r)},ll=(t,e,i,n,l,s,r)=>{t.bezierCurveTo(i,e,l,n,r,s)};function sl(t){return(t,e,i,n,l)=>Vn(t,e,(e,s,r,o,a,c,u,h,d,f,p)=>{let g,m,{pxRound:_,points:v}=e;0==o.ori?(g=Kn,m=el):(g=Qn,m=il);const x=ni(v.width*Qt,3);let y=(v.size-v.width)/2*Qt,b=ni(2*y,3),w=new Path2D,$=new Path2D,{left:k,top:A,width:E,height:S}=t.bbox;Xn($,k-b,A-b,E+2*b,S+2*b);const M=t=>{if(null!=r[t]){let e=_(c(s[t],o,f,h)),i=_(u(r[t],a,p,d));g(w,e+y,i),m(w,e,i,y,0,2*Pe)}};if(l)l.forEach(M);else for(let t=i;t<=n;t++)M(t);return{stroke:x>0?w:null,fill:w,clip:$,flags:3}})}function rl(t){return(e,i,n,l,s,r)=>{n!=l&&(s!=n&&r!=n&&t(e,i,n),s!=l&&r!=l&&t(e,i,l),t(e,i,r))}}const ol=rl(Jn),al=rl(Zn);function cl(t){const e=Ae(t?.alignGaps,0);return(t,i,n,l)=>Vn(t,i,(s,r,o,a,c,u,h,d,f,p,g)=>{[n,l]=_e(o,n,l);let m,_,v=s.pxRound,x=t=>v(u(t,a,p,d)),y=t=>v(h(t,c,g,f));0==a.ori?(m=Jn,_=ol):(m=Zn,_=al);const b=a.dir*(0==a.ori?1:-1),w={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},$=w.stroke;let k=!1;if(l-n>=4*p){let e,i,s,c=e=>t.posToVal(e,a.key,!0),u=null,h=null,d=x(r[1==b?n:l]),f=x(r[n]),p=x(r[l]),g=c(1==b?f+1:p-1);for(let t=1==b?n:l;t>=n&&t<=l;t+=b){let n=r[t],l=(1==b?n<g:n>g)?d:x(n),s=o[t];l==d?null!=s?(i=s,null==u?(m($,l,y(i)),e=u=h=i):i<u?u=i:i>h&&(h=i)):null===s&&(k=!0):(null!=u&&_($,d,y(u),y(h),y(e),y(i)),null!=s?(i=s,m($,l,y(i)),u=h=e=i):(u=h=null,null===s&&(k=!0)),d=l,g=c(d+b))}null!=u&&u!=h&&s!=d&&_($,d,y(u),y(h),y(e),y(i))}else for(let t=1==b?n:l;t>=n&&t<=l;t+=b){let e=o[t];null===e?k=!0:null!=e&&m($,x(r[t]),y(e))}let[A,E]=Wn(t,i);if(null!=s.fill||0!=A){let e=w.fill=new Path2D($),o=y(s.fillTo(t,i,s.min,s.max,A)),a=x(r[n]),c=x(r[l]);-1==b&&([c,a]=[a,c]),m(e,c,o),m(e,a,o)}if(!s.spanGaps){let c=[];k&&c.push(...qn(r,o,n,l,b,x,e)),w.gaps=c=s.gaps(t,i,n,l,c),w.clip=Ln(c,a.ori,d,f,p,g)}return 0!=E&&(w.band=2==E?[Bn(t,i,n,l,$,-1),Bn(t,i,n,l,$,1)]:Bn(t,i,n,l,$,E)),w})}function ul(t,e,i,n,l,s,r=We){if(t.length>1){let o=null;for(let a=0,c=1/0;a<t.length;a++)if(void 0!==e[a]){if(null!=o){let e=ze(t[a]-t[o]);e<c&&(c=e,r=ze(i(t[a],n,l,s)-i(t[o],n,l,s)))}o=a}}return r}function hl(t,e,i,n,l,s){const r=t.length;if(r<2)return null;const o=new Path2D;if(i(o,t[0],e[0]),2==r)n(o,t[1],e[1]);else{let i=Array(r),n=Array(r-1),s=Array(r-1),a=Array(r-1);for(let i=0;i<r-1;i++)s[i]=e[i+1]-e[i],a[i]=t[i+1]-t[i],n[i]=s[i]/a[i];i[0]=n[0];for(let t=1;t<r-1;t++)0===n[t]||0===n[t-1]||n[t-1]>0!=n[t]>0?i[t]=0:(i[t]=3*(a[t-1]+a[t])/((2*a[t]+a[t-1])/n[t-1]+(a[t]+2*a[t-1])/n[t]),isFinite(i[t])||(i[t]=0));i[r-1]=n[r-2];for(let n=0;n<r-1;n++)l(o,t[n]+a[n]/3,e[n]+i[n]*a[n]/3,t[n+1]-a[n]/3,e[n+1]-i[n+1]*a[n]/3,t[n+1],e[n+1])}return o}const dl=new Set;function fl(){for(let t of dl)t.syncRect(!0)}qt&&(he("resize",Gt,fl),he("scroll",Gt,fl,!0),he(Bt,Gt,()=>{Ml.pxRatio=Qt}));const pl=cl(),gl=sl();function ml(t,e,i,n){return(n?[t[0],t[1]].concat(t.slice(2)):[t[0]].concat(t.slice(1))).map((t,n)=>_l(t,n,e,i))}function _l(t,e,i,n){return vi({},0==e?i:n,t)}function vl(t,e,i){return null==e?ci:[e,i]}const xl=vl;function yl(t,e,i){return null==e?ci:ke(e,i,.1,!0)}function bl(t,e,i,n){return null==e?ci:xe(e,i,t.scales[n].log,!1)}const wl=bl;function $l(t,e,i,n){return null==e?ci:ye(e,i,t.scales[n].log,!1)}const kl=$l;function Al(t,e,i,n,l){let s=He(je(t),je(e)),r=e-t,o=fe(l/n*r,i);do{let t=i[o],e=n*t/r;if(e>=l&&s+(t<5?li.get(t):0)<=17)return[t,e]}while(++o<i.length);return[0,0]}function El(t){let e,i;return[t=t.replace(/(\d+)px/,(t,n)=>(e=Te((i=+n)*Qt))+"px"),e,i]}function Sl(t){t.show&&[t.font,t.labelFont].forEach(t=>{let e=ni(t[2]*Qt,1);t[0]=t[0].replace(/[0-9.]+px/,e+"px"),t[1]=e})}function Ml(t,e,i){const n={mode:Ae(t.mode,1)},l=n.mode;function s(t,e,i,n){let l=e.valToPct(t);return n+i*(-1==e.dir?1-l:l)}function r(t,e,i,n){let l=e.valToPct(t);return n+i*(-1==e.dir?l:1-l)}function o(t,e,i,n){return 0==e.ori?s(t,e,i,n):r(t,e,i,n)}n.valToPosH=s,n.valToPosV=r;let a=!1;n.status=0;const c=n.root=ie("uplot");if(null!=t.id&&(c.id=t.id),Zt(c,t.class),t.title){ie("u-title",c).textContent=t.title}const u=ee("canvas"),h=n.ctx=u.getContext("2d"),d=ie("u-wrap",c);he("click",d,t=>{if(t.target===p){(on!=Li||an!=qi)&&kn.click(n,t)}},!0);const f=n.under=ie("u-under",d);d.appendChild(u);const p=n.over=ie("u-over",d),g=+Ae((t=_i(t)).pxAlign,1),m=Yn(g);(t.plugins||[]).forEach(e=>{e.opts&&(t=e.opts(n,t)||t)});const _=t.ms||.001,v=n.series=1==l?ml(t.series||[],vn,Rn,!1):function(t,e){return t.map((t,i)=>0==i?{}:vi({},e,t))}(t.series||[null],On),x=n.axes=ml(t.axes||[],_n,zn,!0),y=n.scales={},b=n.bands=t.bands||[];b.forEach(t=>{t.fill=qe(t.fill||null),t.dir=Ae(t.dir,-1)});const w=2==l?v[1].facets[0].scale:v[0].scale,$={axes:function(){for(let t=0;t<x.length;t++){let e=x[t];if(!e.show||!e._show)continue;let i,l,s=e.side,r=s%2,a=e.stroke(n,t),c=0==s||3==s?-1:1,[u,d]=e._found;if(null!=e.label){let o=e.labelGap*c,f=Te((e._lpos+o)*Qt);$i(e.labelFont[0],a,"center",2==s?zt:Dt),h.save(),1==r?(i=l=0,h.translate(f,Te(pt+mt/2)),h.rotate((3==s?-Pe:Pe)/2)):(i=Te(ft+gt/2),l=f);let p=Le(e.label)?e.label(n,t,u,d):e.label;h.fillText(p,i,l),h.restore()}if(0==d)continue;let f=y[e.scale],p=0==r?gt:mt,g=0==r?ft:pt,_=e._splits,v=2==f.distr?_.map(t=>gi[t]):_,b=2==f.distr?gi[_[1]]-gi[_[0]]:u,w=e.ticks,$=e.border,k=w.show?w.size:0,A=Te(k*Qt),E=Te((2==e.alignTo?e._size-k-e.gap:e.gap)*Qt),S=e._rotate*-Pe/180,M=m(e._pos*Qt),C=M+(A+E)*c;l=0==r?C:0,i=1==r?C:0,$i(e.font[0],a,1==e.align?Tt:2==e.align?Ot:S>0?Tt:S<0?Ot:0==r?"center":3==s?Ot:Tt,S||1==r?"middle":2==s?zt:Dt);let P=e.font[1]*e.lineGap,z=_.map(t=>m(o(t,f,p,g))),D=e._values;for(let t=0;t<D.length;t++){let e=D[t];if(null!=e){0==r?i=z[t]:l=z[t],e=""+e;let n=-1==e.indexOf("\n")?[e]:e.split(/\n/gm);for(let t=0;t<n.length;t++){let e=n[t];S?(h.save(),h.translate(i,l+t*P),h.rotate(S),h.fillText(e,0,0),h.restore()):h.fillText(e,i,l+t*P)}}}w.show&&Ti(z,w.filter(n,v,t,d,b),r,s,M,A,ni(w.width*Qt,3),w.stroke(n,t),w.dash,w.cap);let T=e.grid;T.show&&Ti(z,T.filter(n,v,t,d,b),r,0==r?2:1,0==r?pt:ft,0==r?mt:gt,ni(T.width*Qt,3),T.stroke(n,t),T.dash,T.cap),$.show&&Ti([M],[1],0==r?1:0,0==r?1:2,1==r?pt:ft,1==r?mt:gt,ni($.width*Qt,3),$.stroke(n,t),$.dash,$.cap)}Tl("drawAxes")},series:function(){if(Ee>0){let t=v.some(t=>t._focus)&&hi!=jt.alpha;t&&(h.globalAlpha=hi=jt.alpha),v.forEach((t,i)=>{if(i>0&&t.show&&(Ei(i,!1),Ei(i,!0),null==t._paths)){let s=hi;hi!=t.alpha&&(h.globalAlpha=hi=t.alpha);let r=2==l?[0,e[i][0].length-1]:function(t){let e=Be(Se-1,0,Ee-1),i=Be(Me+1,0,Ee-1);for(;null==t[e]&&e>0;)e--;for(;null==t[i]&&i<Ee-1;)i++;return[e,i]}(e[i]);t._paths=t.paths(n,i,r[0],r[1]),hi!=s&&(h.globalAlpha=hi=s)}}),v.forEach((t,e)=>{if(e>0&&t.show){let i=hi;hi!=t.alpha&&(h.globalAlpha=hi=t.alpha),null!=t._paths&&Si(e,!1);{let i=null!=t._paths?t._paths.gaps:null,l=t.points.show(n,e,Se,Me,i),s=t.points.filter(n,e,l,i);(l||s)&&(t.points._paths=t.points.paths(n,e,Se,Me,s),Si(e,!0))}hi!=i&&(h.globalAlpha=hi=i),Tl("drawSeries",e)}}),t&&(h.globalAlpha=hi=1)}}},k=(t.drawOrder||["axes","series"]).map(t=>$[t]);function A(t){const e=3==t.distr?e=>Ne(e>0?e:t.clamp(n,e,t.min,t.max,t.key)):4==t.distr?e=>Ve(e,t.asinh):100==t.distr?e=>t.fwd(e):t=>t;return i=>{let n=e(i),{_min:l,_max:s}=t;return(n-l)/(s-l)}}function E(e){let i=y[e];if(null==i){let n=(t.scales||oi)[e]||oi;if(null!=n.from){E(n.from);let t=vi({},y[n.from],n,{key:e});t.valToPct=A(t),y[e]=t}else{i=y[e]=vi({},e==w?Un:Fn,n),i.key=e;let t=i.time,s=i.range,r=ui(s);if((e!=w||2==l&&!t)&&(!r||null!=s[0]&&null!=s[1]||(s={min:null==s[0]?be:{mode:1,hard:s[0],soft:s[0]},max:null==s[1]?be:{mode:1,hard:s[1],soft:s[1]}},r=!1),!r&&fi(s))){let t=s;s=(e,i,n)=>null==i?ci:ke(i,n,t)}i.range=qe(s||(t?xl:e==w?3==i.distr?wl:4==i.distr?kl:vl:3==i.distr?bl:4==i.distr?$l:yl)),i.auto=qe(!r&&i.auto),i.clamp=qe(i.clamp||Hn),i._min=i._max=null,i.valToPct=A(i)}}}E("x"),E("y"),1==l&&v.forEach(t=>{E(t.scale)}),x.forEach(t=>{E(t.scale)});for(let e in t.scales)E(e);const S=y[w],M=S.distr;let C,P;0==S.ori?(Zt(c,"u-hz"),C=s,P=r):(Zt(c,"u-vt"),C=r,P=s);const z={};for(let t in y){let e=y[t];null==e.min&&null==e.max||(z[t]={min:e.min,max:e.max},e.min=e.max=null)}const D=t.tzDate||(t=>new Date(Te(t/_))),T=t.fmtDate||Ci,O=1==_?Qi(D):Xi(D),R=en(D,tn(1==_?Ki:Zi,T)),H=sn(D,ln("{YYYY}-{MM}-{DD} {h}:{mm}{aa}",T)),U=[],F=n.legend=vi({},rn,t.legend),N=n.cursor=vi({},un,{drag:{y:2==l}},t.cursor),I=F.show,V=N.show,W=F.markers;let j,B,L;F.idxs=U,W.width=qe(W.width),W.dash=qe(W.dash),W.stroke=qe(W.stroke),W.fill=qe(W.fill);let q,Y=[],G=[],K=!1,Q={};if(F.live){const t=v[1]?v[1].values:null;K=null!=t,q=K?t(n,1,0):{_:0};for(let t in q)Q[t]=Lt}if(I)if(j=ee("table","u-legend",c),L=ee("tbody",null,j),F.mount(n,j),K){B=ee("thead",null,j,L);let t=ee("tr",null,B);for(var J in ee("th",null,t),q)ee("th",Mt,t).textContent=J}else Zt(j,"u-inline"),F.live&&Zt(j,"u-live");const Z={show:!0},X={show:!1};const tt=new Map;function et(t,e,i,l=!0){const s=tt.get(e)||{},r=N.bind[t](n,e,i,l);r&&(he(t,e,s[t]=r),tt.set(e,s))}function it(t,e,i){const n=tt.get(e)||{};for(let i in n)null!=t&&i!=t||(de(i,e,n[i]),delete n[i]);null==t&&tt.delete(e)}let nt=0,lt=0,st=0,rt=0,ot=0,at=0,ct=ot,ut=at,ht=st,dt=rt,ft=0,pt=0,gt=0,mt=0;n.bbox={};let _t=!1,vt=!1,xt=!1,yt=!1,bt=!1,wt=!1;function $t(t,e,i){(i||t!=n.width||e!=n.height)&&kt(t,e),Fi(!1),xt=!0,vt=!0,pn()}function kt(t,e){n.width=nt=st=t,n.height=lt=rt=e,ot=at=0,function(){let t=!1,e=!1,i=!1,n=!1;x.forEach((l,s)=>{if(l.show&&l._show){let{side:s,_size:r}=l,o=s%2,a=r+(null!=l.label?l.labelSize:0);a>0&&(o?(st-=a,3==s?(ot+=a,n=!0):i=!0):(rt-=a,0==s?(at+=a,t=!0):e=!0))}}),ue[0]=t,ue[1]=i,ue[2]=e,ue[3]=n,st-=$e[1]+$e[3],ot+=$e[3],rt-=$e[2]+$e[0],at+=$e[0]}(),function(){let t=ot+st,e=at+rt,i=ot,n=at;function l(l,s){switch(l){case 1:return t+=s,t-s;case 2:return e+=s,e-s;case 3:return i-=s,i+s;case 0:return n-=s,n+s}}x.forEach((t,e)=>{if(t.show&&t._show){let e=t.side;t._pos=l(e,t._size),null!=t.label&&(t._lpos=l(e,t.labelSize))}})}();let i=n.bbox;ft=i.left=ti(ot*Qt,.5),pt=i.top=ti(at*Qt,.5),gt=i.width=ti(st*Qt,.5),mt=i.height=ti(rt*Qt,.5)}const At=3;if(n.setSize=function({width:t,height:e}){$t(t,e)},null==N.dataIdx){let t=N.hover,i=t.skip=new Set(t.skip??[]);i.add(void 0);let n=t.prox=qe(t.prox),l=t.bias??=0;N.dataIdx=(t,s,r,o)=>{if(0==s)return r;let a=r,c=n(t,s,r,o)??We,u=c>=0&&c<We,h=0==S.ori?st:rt,d=N.left,f=e[0],p=e[s];if(i.has(p[r])){a=null;let t,e=null,n=null;if(0==l||-1==l)for(t=r;null==e&&t-- >0;)i.has(p[t])||(e=t);if(0==l||1==l)for(t=r;null==n&&t++<p.length;)i.has(p[t])||(n=t);if(null!=e||null!=n)if(u){let t=d-(null==e?-1/0:C(f[e],S,h,0)),i=(null==n?1/0:C(f[n],S,h,0))-d;t<=i?t<=c&&(a=e):i<=c&&(a=n)}else a=null==n?e:null==e?n:r-e<=n-r?e:n}else if(u){ze(d-C(f[r],S,h,0))>c&&(a=null)}return a}}const Et=t=>{N.event=t};N.idxs=U,N._lock=!1;let Rt=N.points;Rt.show=qe(Rt.show),Rt.size=qe(Rt.size),Rt.stroke=qe(Rt.stroke),Rt.width=qe(Rt.width),Rt.fill=qe(Rt.fill);const jt=n.focus=vi({},t.focus||{alpha:.3},N.focus),qt=jt.prox>=0,Kt=qt&&Rt.one;let Jt=[],ne=[],se=[];function oe(t,e){let i=Rt.show(n,e);if(i instanceof HTMLElement)return Zt(i,"u-cursor-pt"),Zt(i,t.class),le(i,-10,-10,st,rt),p.insertBefore(i,Jt[e]),i}function ce(t,e){if(1==l||e>0){let e=1==l&&y[t.scale].time,i=t.value;t.value=e?di(i)?sn(D,ln(i,T)):i||H:i||Pn,t.label=t.label||(e?"Time":"Value")}if(Kt||e>0){t.width=null==t.width?1:t.width,t.paths=t.paths||pl||Ke,t.fillTo=qe(t.fillTo||jn),t.pxAlign=+Ae(t.pxAlign,g),t.pxRound=Yn(t.pxAlign),t.stroke=qe(t.stroke||null),t.fill=qe(t.fill||null),t._stroke=t._fill=t._paths=t._focus=null;let e=ni((3+2*(He(1,t.width)||1))*1,3),i=t.points=vi({},{size:e,width:He(1,.2*e),stroke:t.stroke,space:2*e,paths:gl,_stroke:null,_fill:null},t.points);i.show=qe(i.show),i.filter=qe(i.filter),i.fill=qe(i.fill),i.stroke=qe(i.stroke),i.paths=qe(i.paths),i.pxAlign=t.pxAlign}if(I){let i=function(t,e){if(0==e&&(K||!F.live||2==l))return ci;let i=[],s=ee("tr","u-series",L,L.childNodes[e]);Zt(s,t.class),t.show||Zt(s,St);let r=ee("th",null,s);if(W.show){let t=ie("u-marker",r);if(e>0){let i=W.width(n,e);i&&(t.style.border=i+"px "+W.dash(n,e)+" "+W.stroke(n,e)),t.style.background=W.fill(n,e)}}let o=ie(Mt,r);for(var a in t.label instanceof HTMLElement?o.appendChild(t.label):o.textContent=t.label,e>0&&(W.show||(o.style.color=t.width>0?W.stroke(n,e):W.fill(n,e)),et("click",r,e=>{if(N._lock)return;Et(e);let i=v.indexOf(t);if((e.ctrlKey||e.metaKey)!=F.isolate){let t=v.some((t,e)=>e>0&&e!=i&&t.show);v.forEach((e,n)=>{n>0&&Vn(n,t?n==i?Z:X:Z,!0,Rl.setSeries)})}else Vn(i,{show:!t.show},!0,Rl.setSeries)},!1),qt&&et(It,r,e=>{N._lock||(Et(e),Vn(v.indexOf(t),qn,!0,Rl.setSeries))},!1)),q){let t=ee("td","u-value",s);t.textContent="--",i.push(t)}return[s,i]}(t,e);Y.splice(e,0,i[0]),G.splice(e,0,i[1]),F.values.push(null)}if(V){U.splice(e,0,null);let i=null;Kt?0==e&&(i=oe(t,e)):e>0&&(i=oe(t,e)),Jt.splice(e,0,i),ne.splice(e,0,0),se.splice(e,0,0)}Tl("addSeries",e)}n.addSeries=function(t,e){e=null==e?v.length:e,t=1==l?_l(t,e,vn,Rn):_l(t,e,{},On),v.splice(e,0,t),ce(v[e],e)},n.delSeries=function(t){if(v.splice(t,1),I){F.values.splice(t,1),G.splice(t,1);let e=Y.splice(t,1)[0];it(null,e.firstChild),e.remove()}V&&(U.splice(t,1),Jt.splice(t,1)[0].remove(),ne.splice(t,1),se.splice(t,1)),Tl("delSeries",t)};const ue=[!1,!1,!1,!1];function pe(t,e,i,n){let[l,s,r,o]=i,a=e%2,c=0;return 0==a&&(o||s)&&(c=0==e&&!l||2==e&&!r?Te(_n.size/3):0),1==a&&(l||r)&&(c=1==e&&!s||3==e&&!o?Te(zn.size/2):0),c}const we=n.padding=(t.padding||[pe,pe,pe,pe]).map(t=>qe(Ae(t,pe))),$e=n._padding=we.map((t,e)=>t(n,e,ue,0));let Ee,Se=null,Me=null;const De=1==l?v[0].idxs:null;let Fe,Ie,je,Ye,Ze,Xe,ei,ii,ri,hi,gi=null,mi=!1;function xi(t,i){if(e=null==t?[]:t,n.data=n._data=e,2==l){Ee=0;for(let t=1;t<v.length;t++)Ee+=e[t][0].length}else{0==e.length&&(n.data=n._data=e=[[]]),gi=e[0],Ee=gi.length;let t=e;if(2==M){t=e.slice();let i=t[0]=Array(Ee);for(let t=0;t<Ee;t++)i[t]=t}n._data=e=t}if(Fi(!0),Tl("setData"),2==M&&(xt=!0),!1!==i){let t=S;t.auto(n,mi)?bi():Nn(w,t.min,t.max),yt=yt||N.left>=0,wt=!0,pn()}}function bi(){let t,i;mi=!0,1==l&&(Ee>0?(Se=De[0]=0,Me=De[1]=Ee-1,t=e[0][Se],i=e[0][Me],2==M?(t=Se,i=Me):t==i&&(3==M?[t,i]=xe(t,t,S.log,!1):4==M?[t,i]=ye(t,t,S.log,!1):S.time?i=t+Te(86400/_):[t,i]=ke(t,i,.1,!0))):(Se=De[0]=t=null,Me=De[1]=i=null)),Nn(w,t,i)}function wi(t,e,i,n,l,s){t??=Ht,i??=ai,n??="butt",l??=Ht,s??="round",t!=Fe&&(h.strokeStyle=Fe=t),l!=Ie&&(h.fillStyle=Ie=l),e!=je&&(h.lineWidth=je=e),s!=Ze&&(h.lineJoin=Ze=s),n!=Xe&&(h.lineCap=Xe=n),i!=Ye&&h.setLineDash(Ye=i)}function $i(t,e,i,n){e!=Ie&&(h.fillStyle=Ie=e),t!=ei&&(h.font=ei=t),i!=ii&&(h.textAlign=ii=i),n!=ri&&(h.textBaseline=ri=n)}function ki(t,e,i,l,s=0){if(l.length>0&&t.auto(n,mi)&&(null==e||null==e.min)){let e=Ae(Se,0),n=Ae(Me,l.length-1),r=null==i.min?function(t,e,i,n=0,l=!1){let s=l?ve:_e,r=l?me:ge;[e,i]=s(t,e,i);let o=t[e],a=t[e];if(e>-1)if(1==n)o=t[e],a=t[i];else if(-1==n)o=t[i],a=t[e];else for(let n=e;n<=i;n++){let e=t[n];r(e)&&(e<o?o=e:e>a&&(a=e))}return[o??We,a??-We]}(l,e,n,s,3==t.distr):[i.min,i.max];t.min=Re(t.min,i.min=r[0]),t.max=He(t.max,i.max=r[1])}}n.setData=xi;const Ai={min:null,max:null};function Ei(t,e){let i=e?v[t].points:v[t];i._stroke=i.stroke(n,t),i._fill=i.fill(n,t)}function Si(t,i){let l=i?v[t].points:v[t],{stroke:s,fill:r,clip:o,flags:a,_stroke:c=l._stroke,_fill:u=l._fill,_width:d=l.width}=l._paths;d=ni(d*Qt,3);let f=null,p=d%2/2;i&&null==u&&(u=d>0?"#fff":c);let g=1==l.pxAlign&&p>0;if(g&&h.translate(p,p),!i){let t=ft-d/2,e=pt-d/2,i=gt+d,n=mt+d;f=new Path2D,f.rect(t,e,i,n)}i?Pi(c,d,l.dash,l.cap,u,s,r,a,o):function(t,i,l,s,r,o,a,c,u,h,d){let f=!1;0!=u&&b.forEach((p,g)=>{if(p.series[0]==t){let t,m=v[p.series[1]],_=e[p.series[1]],x=(m._paths||oi).band;ui(x)&&(x=1==p.dir?x[0]:x[1]);let y=null;m.show&&x&&function(t,e,i){for(e=Ae(e,0),i=Ae(i,t.length-1);e<=i;){if(null!=t[e])return!0;e++}return!1}(_,Se,Me)?(y=p.fill(n,g)||o,t=m._paths.clip):x=null,Pi(i,l,s,r,y,a,c,u,h,d,t,x),f=!0}}),f||Pi(i,l,s,r,o,a,c,u,h,d)}(t,c,d,l.dash,l.cap,u,s,r,a,f,o),g&&h.translate(-p,-p)}const Mi=3;function Pi(t,e,i,n,l,s,r,o,a,c,u,d){wi(t,e,i,n,l),(a||c||d)&&(h.save(),a&&h.clip(a),c&&h.clip(c)),d?(o&Mi)==Mi?(h.clip(d),u&&h.clip(u),Di(l,r),zi(t,s,e)):2&o?(Di(l,r),h.clip(d),zi(t,s,e)):1&o&&(h.save(),h.clip(d),u&&h.clip(u),Di(l,r),h.restore(),zi(t,s,e)):(Di(l,r),zi(t,s,e)),(a||c||d)&&h.restore()}function zi(t,e,i){i>0&&(e instanceof Map?e.forEach((t,e)=>{h.strokeStyle=Fe=e,h.stroke(t)}):null!=e&&t&&h.stroke(e))}function Di(t,e){e instanceof Map?e.forEach((t,e)=>{h.fillStyle=Ie=e,h.fill(t)}):null!=e&&t&&h.fill(e)}function Ti(t,e,i,n,l,s,r,o,a,c){let u=r%2/2;1==g&&h.translate(u,u),wi(o,r,a,c,o),h.beginPath();let d,f,p,m,_=l+(0==n||3==n?-s:s);0==i?(f=l,m=_):(d=l,p=_);for(let n=0;n<t.length;n++)null!=e[n]&&(0==i?d=p=t[n]:f=m=t[n],h.moveTo(d,f),h.lineTo(p,m));h.stroke(),1==g&&h.translate(-u,-u)}function Oi(t){let e=!0;return x.forEach((i,l)=>{if(!i.show)return;let s=y[i.scale];if(null==s.min)return void(i._show&&(e=!1,i._show=!1,Fi(!1)));i._show||(e=!1,i._show=!0,Fi(!1));let r=i.side,o=r%2,{min:a,max:c}=s,[u,h]=function(t,e,i,l){let s,r=x[t];if(l<=0)s=[0,0];else{let o=r._space=r.space(n,t,e,i,l);s=Al(e,i,r._incrs=r.incrs(n,t,e,i,l,o),l,o)}return r._found=s}(l,a,c,0==o?st:rt);if(0==h)return;let d=2==s.distr,f=i._splits=i.splits(n,l,a,c,u,h,d),p=2==s.distr?f.map(t=>gi[t]):f,g=2==s.distr?gi[f[1]]-gi[f[0]]:u,m=i._values=i.values(n,i.filter(n,p,l,h,g),l,h,g);i._rotate=2==r?i.rotate(n,m,l,h):0;let _=i._size;i._size=Oe(i.size(n,m,l,t)),null!=_&&i._size!=_&&(e=!1)}),e}function Ui(t){let e=!0;return we.forEach((i,l)=>{let s=i(n,l,ue,t);s!=$e[l]&&(e=!1),$e[l]=s}),e}function Fi(t){v.forEach((e,i)=>{i>0&&(e._paths=null,t&&(1==l?(e.min=null,e.max=null):e.facets.forEach(t=>{t.min=null,t.max=null})))})}let Ni,Ii,Vi,Wi,ji,Bi,Li,qi,Yi,nn,on,an,cn=!1,hn=!1,dn=[];function fn(){hn=!1;for(let t=0;t<dn.length;t++)Tl(...dn[t]);dn.length=0}function pn(){cn||(yi(gn),cn=!0)}function gn(){if(_t&&(!function(){for(let t in y){let e=y[t];null==z[t]&&(null==e.min||null!=z[w]&&e.auto(n,mi))&&(z[t]=Ai)}for(let t in y){let e=y[t];null==z[t]&&null!=e.from&&null!=z[e.from]&&(z[t]=Ai)}null!=z[w]&&Fi(!0);let t={};for(let e in z){let i=z[e];if(null!=i){let s=t[e]=_i(y[e],pi);if(null!=i.min)vi(s,i);else if(e!=w||2==l)if(0==Ee&&null==s.from){let t=s.range(n,null,null,e);s.min=t[0],s.max=t[1]}else s.min=We,s.max=-We}}if(Ee>0){v.forEach((i,s)=>{if(1==l){let l=i.scale,r=z[l];if(null==r)return;let o=t[l];if(0==s){let t=o.range(n,o.min,o.max,l);o.min=t[0],o.max=t[1],Se=fe(o.min,e[0]),Me=fe(o.max,e[0]),Me-Se>1&&(e[0][Se]<o.min&&Se++,e[0][Me]>o.max&&Me--),i.min=gi[Se],i.max=gi[Me]}else i.show&&i.auto&&ki(o,r,i,e[s],i.sorted);i.idxs[0]=Se,i.idxs[1]=Me}else if(s>0&&i.show&&i.auto){let[n,l]=i.facets,r=n.scale,o=l.scale,[a,c]=e[s],u=t[r],h=t[o];null!=u&&ki(u,z[r],n,a,n.sorted),null!=h&&ki(h,z[o],l,c,l.sorted),i.min=l.min,i.max=l.max}});for(let e in t){let i=t[e],l=z[e];if(null==i.from&&(null==l||null==l.min)){let t=i.range(n,i.min==We?null:i.min,i.max==-We?null:i.max,e);i.min=t[0],i.max=t[1]}}}for(let e in t){let i=t[e];if(null!=i.from){let l=t[i.from];if(null==l.min)i.min=i.max=null;else{let t=i.range(n,l.min,l.max,e);i.min=t[0],i.max=t[1]}}}let i={},s=!1;for(let e in t){let n=t[e],l=y[e];if(l.min!=n.min||l.max!=n.max){l.min=n.min,l.max=n.max;let t=l.distr;l._min=3==t?Ne(l.min):4==t?Ve(l.min,l.asinh):100==t?l.fwd(l.min):l.min,l._max=3==t?Ne(l.max):4==t?Ve(l.max,l.asinh):100==t?l.fwd(l.max):l.max,i[e]=s=!0}}if(s){v.forEach((t,e)=>{2==l?e>0&&i.y&&(t._paths=null):i[t.scale]&&(t._paths=null)});for(let t in i)xt=!0,Tl("setScale",t);V&&N.left>=0&&(yt=wt=!0)}for(let t in z)z[t]=null}(),_t=!1),xt&&(!function(){let t=!1,e=0;for(;!t;){e++;let i=Oi(e),l=Ui(e);t=e==At||i&&l,t||(kt(n.width,n.height),vt=!0)}}(),xt=!1),vt){if(te(f,Tt,ot),te(f,zt,at),te(f,Ct,st),te(f,Pt,rt),te(p,Tt,ot),te(p,zt,at),te(p,Ct,st),te(p,Pt,rt),te(d,Ct,nt),te(d,Pt,lt),u.width=Te(nt*Qt),u.height=Te(lt*Qt),x.forEach(({_el:t,_show:e,_size:i,_pos:n,side:l})=>{if(null!=t)if(e){let e=l%2==1;te(t,e?"left":"top",n-(3===l||0===l?i:0)),te(t,e?"width":"height",i),te(t,e?"top":"left",e?at:ot),te(t,e?"height":"width",e?rt:st),Xt(t,St)}else Zt(t,St)}),Fe=Ie=je=Ze=Xe=ei=ii=ri=Ye=null,hi=1,nl(!0),ot!=ct||at!=ut||st!=ht||rt!=dt){Fi(!1);let t=st/ht,e=rt/dt;if(V&&!yt&&N.left>=0){N.left*=t,N.top*=e,Vi&&le(Vi,Te(N.left),0,st,rt),Wi&&le(Wi,0,Te(N.top),st,rt);for(let i=0;i<Jt.length;i++){let n=Jt[i];null!=n&&(ne[i]*=t,se[i]*=e,le(n,Oe(ne[i]),Oe(se[i]),st,rt))}}if(Sn.show&&!bt&&Sn.left>=0&&Sn.width>0){Sn.left*=t,Sn.width*=t,Sn.top*=e,Sn.height*=e;for(let t in rl)te(Dn,t,Sn[t])}ct=ot,ut=at,ht=st,dt=rt}Tl("setSize"),vt=!1}nt>0&&lt>0&&(h.clearRect(0,0,u.width,u.height),Tl("drawClear"),k.forEach(t=>t()),Tl("draw")),Sn.show&&bt&&(Tn(Sn),bt=!1),V&&yt&&(el(null,!0,!1),yt=!1),F.show&&F.live&&wt&&(Xn(),wt=!1),a||(a=!0,n.status=1,Tl("ready")),mi=!1,cn=!1}function mn(t,i){let l=y[t];if(null==l.from){if(0==Ee){let e=l.range(n,i.min,i.max,t);i.min=e[0],i.max=e[1]}if(i.min>i.max){let t=i.min;i.min=i.max,i.max=t}if(Ee>1&&null!=i.min&&null!=i.max&&i.max-i.min<1e-16)return;t==w&&2==l.distr&&Ee>0&&(i.min=fe(i.min,e[0]),i.max=fe(i.max,e[0]),i.min==i.max&&i.max++),z[t]=i,_t=!0,pn()}}n.batch=function(t,e=!1){cn=!0,hn=e,t(n),gn(),e&&dn.length>0&&queueMicrotask(fn)},n.redraw=(t,e)=>{xt=e||!1,!1!==t?Nn(w,S.min,S.max):pn()},n.setScale=mn;let $n=!1;const kn=N.drag;let An=kn.x,En=kn.y;V&&(N.x&&(Ni=ie("u-cursor-x",p)),N.y&&(Ii=ie("u-cursor-y",p)),0==S.ori?(Vi=Ni,Wi=Ii):(Vi=Ii,Wi=Ni),on=N.left,an=N.top);const Sn=n.select=vi({show:!0,over:!0,left:0,width:0,top:0,height:0},t.select),Dn=Sn.show?ie("u-select",Sn.over?p:f):null;function Tn(t,e){if(Sn.show){for(let e in t)Sn[e]=t[e],e in rl&&te(Dn,e,t[e]);!1!==e&&Tl("setSelect")}}function Nn(t,e,i){mn(t,{min:e,max:i})}function Vn(t,e,i,s){null!=e.focus&&function(t){if(t!=Ln){let e=null==t,i=1!=jt.alpha;v.forEach((n,s)=>{if(1==l||s>0){let l=e||0==s||s==t;n._focus=e?null:l,i&&function(t,e){v[t].alpha=e,V&&null!=Jt[t]&&(Jt[t].style.opacity=e);I&&Y[t]&&(Y[t].style.opacity=e)}(s,l?1:jt.alpha)}}),Ln=t,i&&pn()}}(t),null!=e.show&&v.forEach((i,n)=>{n>0&&(t==n||null==t)&&(i.show=e.show,function(t){if(v[t].show)I&&Xt(Y[t],St);else if(I&&Zt(Y[t],St),V){let e=Kt?Jt[0]:Jt[t];null!=e&&le(e,-10,-10,st,rt)}}(n),2==l?(Nn(i.facets[0].scale,null,null),Nn(i.facets[1].scale,null,null)):Nn(i.scale,null,null),pn())}),!1!==i&&Tl("setSeries",t,e),s&&Fl("setSeries",n,t,e)}let Wn,Bn,Ln;n.setSelect=Tn,n.setSeries=Vn,n.addBand=function(t,e){t.fill=qe(t.fill||null),t.dir=Ae(t.dir,-1),e=null==e?b.length:e,b.splice(e,0,t)},n.setBand=function(t,e){vi(b[t],e)},n.delBand=function(t){null==t?b.length=0:b.splice(t,1)};const qn={focus:!0};function Gn(t,e,i){let n=y[e];i&&(t=t/Qt-(1==n.ori?at:ot));let l=st;1==n.ori&&(l=rt,t=l-t),-1==n.dir&&(t=l-t);let s=n._min,r=s+(n._max-s)*(t/l),o=n.distr;return 3==o?Ue(10,r):4==o?((t,e=1)=>Ce.sinh(t)*e)(r,n.asinh):100==o?n.bwd(r):r}function Kn(t,e){te(Dn,Tt,Sn.left=t),te(Dn,Ct,Sn.width=e)}function Qn(t,e){te(Dn,zt,Sn.top=t),te(Dn,Pt,Sn.height=e)}I&&qt&&et(Vt,j,t=>{N._lock||(Et(t),null!=Ln&&Vn(null,qn,!0,Rl.setSeries))}),n.valToIdx=t=>fe(t,e[0]),n.posToIdx=function(t,i){return fe(Gn(t,w,i),e[0],Se,Me)},n.posToVal=Gn,n.valToPos=(t,e,i)=>0==y[e].ori?s(t,y[e],i?gt:st,i?ft:0):r(t,y[e],i?mt:rt,i?pt:0),n.setCursor=(t,e,i)=>{on=t.left,an=t.top,el(null,e,i)};let Jn=0==S.ori?Kn:Qn,Zn=1==S.ori?Kn:Qn;function Xn(t,e){if(null!=t&&(t.idxs?t.idxs.forEach((t,e)=>{U[e]=t}):(t=>void 0===t)(t.idx)||U.fill(t.idx),F.idx=U[0]),I&&F.live){for(let t=0;t<v.length;t++)(t>0||1==l&&!K)&&tl(t,U[t]);!function(){if(I&&F.live)for(let t=2==l?1:0;t<v.length;t++){if(0==t&&K)continue;let e=F.values[t],i=0;for(let n in e)G[t][i++].firstChild.nodeValue=e[n]}}()}wt=!1,!1!==e&&Tl("setLegend")}function tl(t,i){let l,s=v[t],r=0==t&&2==M?gi:e[t];K?l=s.values(n,t,i)??Q:(l=s.value(n,null==i?null:r[i],t,i),l=null==l?Q:{_:l}),F.values[t]=l}function el(t,i,s){let r;Yi=on,nn=an,[on,an]=N.move(n,on,an),N.left=on,N.top=an,V&&(Vi&&le(Vi,Te(on),0,st,rt),Wi&&le(Wi,0,Te(an),st,rt));let o=Se>Me;Wn=We,Bn=null;let a=0==S.ori?st:rt,c=1==S.ori?st:rt;if(on<0||0==Ee||o){r=N.idx=null;for(let t=0;t<v.length;t++){let e=Jt[t];null!=e&&le(e,-10,-10,st,rt)}qt&&Vn(null,qn,!0,null==t&&Rl.setSeries),F.live&&(U.fill(r),wt=!0)}else{let t,i,s;1==l&&(t=0==S.ori?on:an,i=Gn(t,w),r=N.idx=fe(i,e[0],Se,Me),s=C(e[0][r],S,a,0));let o=-10,u=-10,h=0,d=0,f=!0,p="",g="";for(let t=2==l?1:0;t<v.length;t++){let m=v[t],_=U[t],x=null==_?null:1==l?e[t][_]:e[t][1][_],b=N.dataIdx(n,t,r,i),w=null==b?null:1==l?e[t][b]:e[t][1][b];if(wt=wt||w!=x||b!=_,U[t]=b,t>0&&m.show){let i=null==b?-10:b==r?s:C(1==l?e[0][b]:e[t][0][b],S,a,0),_=null==w?-10:P(w,1==l?y[m.scale]:y[m.facets[1].scale],c,0);if(qt&&null!=w){let e=1==S.ori?on:an,i=ze(jt.dist(n,t,b,_,e));if(i<Wn){let n=jt.bias;if(0!=n){let l=Gn(e,m.scale),s=l>=0?1:-1;s==(w>=0?1:-1)&&(1==s?1==n?w>=l:w<=l:1==n?w<=l:w>=l)&&(Wn=i,Bn=t)}else Wn=i,Bn=t}}if(wt||Kt){let e,l;0==S.ori?(e=i,l=_):(e=_,l=i);let s,r,a,c,m,v,x=!0,y=Rt.bbox;if(null!=y){x=!1;let e=y(n,t);a=e.left,c=e.top,s=e.width,r=e.height}else a=e,c=l,s=r=Rt.size(n,t);if(v=Rt.fill(n,t),m=Rt.stroke(n,t),Kt)t==Bn&&Wn<=jt.prox&&(o=a,u=c,h=s,d=r,f=x,p=v,g=m);else{let e=Jt[t];null!=e&&(ne[t]=a,se[t]=c,ae(e,s,r,x),re(e,v,m),le(e,Oe(a),Oe(c),st,rt))}}}}if(Kt){let t=jt.prox;if(wt||(null==Ln?Wn<=t:Wn>t||Bn!=Ln)){let t=Jt[0];null!=t&&(ne[0]=o,se[0]=u,ae(t,h,d,f),re(t,p,g),le(t,Oe(o),Oe(u),st,rt))}}}if(Sn.show&&$n)if(null!=t){let[e,i]=Rl.scales,[n,l]=Rl.match,[s,r]=t.cursor.sync.scales,o=t.cursor.drag;if(An=o._x,En=o._y,An||En){let o,u,h,d,f,{left:p,top:g,width:m,height:_}=t.select,v=t.scales[s].ori,x=t.posToVal,b=null!=e&&n(e,s),w=null!=i&&l(i,r);b&&An?(0==v?(o=p,u=m):(o=g,u=_),h=y[e],d=C(x(o,s),h,a,0),f=C(x(o+u,s),h,a,0),Jn(Re(d,f),ze(f-d))):Jn(0,a),w&&En?(1==v?(o=p,u=m):(o=g,u=_),h=y[i],d=P(x(o,r),h,c,0),f=P(x(o+u,r),h,c,0),Zn(Re(d,f),ze(f-d))):Zn(0,c)}else ol()}else{let t=ze(Yi-ji),e=ze(nn-Bi);if(1==S.ori){let i=t;t=e,e=i}An=kn.x&&t>=kn.dist,En=kn.y&&e>=kn.dist;let i,n,l=kn.uni;null!=l?An&&En&&(An=t>=l,En=e>=l,An||En||(e>t?En=!0:An=!0)):kn.x&&kn.y&&(An||En)&&(An=En=!0),An&&(0==S.ori?(i=Li,n=on):(i=qi,n=an),Jn(Re(i,n),ze(n-i)),En||Zn(0,c)),En&&(1==S.ori?(i=Li,n=on):(i=qi,n=an),Zn(Re(i,n),ze(n-i)),An||Jn(0,a)),An||En||(Jn(0,0),Zn(0,0))}if(kn._x=An,kn._y=En,null==t){if(s){if(null!=Hl){let[t,e]=Rl.scales;Rl.values[0]=null!=t?Gn(0==S.ori?on:an,t):null,Rl.values[1]=null!=e?Gn(1==S.ori?on:an,e):null}Fl(Ut,n,on,an,st,rt,r)}if(qt){let t=s&&Rl.setSeries,e=jt.prox;null==Ln?Wn<=e&&Vn(Bn,qn,!0,t):Wn>e?Vn(null,qn,!0,t):Bn!=Ln&&Vn(Bn,qn,!0,t)}}wt&&(F.idx=r,Xn()),!1!==i&&Tl("setCursor")}n.setLegend=Xn;let il=null;function nl(t=!1){t?il=null:(il=p.getBoundingClientRect(),Tl("syncRect",il))}function ll(t,e,i,n,l,s,r){N._lock||$n&&null!=t&&0==t.movementX&&0==t.movementY||(sl(t,e,i,n,l,s,r,!1,null!=t),null!=t?el(null,!0,!0):el(e,!0,!1))}function sl(t,e,i,l,s,r,a,c,u){if(null==il&&nl(!1),Et(t),null!=t)i=t.clientX-il.left,l=t.clientY-il.top;else{if(i<0||l<0)return on=-10,void(an=-10);let[t,n]=Rl.scales,a=e.cursor.sync,[c,u]=a.values,[h,d]=a.scales,[f,p]=Rl.match,g=e.axes[0].side%2==1,m=0==S.ori?st:rt,_=1==S.ori?st:rt,v=g?r:s,x=g?s:r,b=g?l:i,w=g?i:l;if(i=null!=h?f(t,h)?o(c,y[t],m,0):-10:m*(b/v),l=null!=d?p(n,d)?o(u,y[n],_,0):-10:_*(w/x),1==S.ori){let t=i;i=l,l=t}}!u||null!=e&&e.cursor.event.type!=Ut||((i<=1||i>=st-1)&&(i=ti(i,st)),(l<=1||l>=rt-1)&&(l=ti(l,rt))),c?(ji=i,Bi=l,[Li,qi]=N.move(n,i,l)):(on=i,an=l)}Object.defineProperty(n,"rect",{get:()=>(null==il&&nl(!1),il)});const rl={width:0,height:0,left:0,top:0};function ol(){Tn(rl,!1)}let al,cl,ul,hl;function fl(t,e,i,l,s,r,o){$n=!0,An=En=kn._x=kn._y=!1,sl(t,e,i,l,s,r,0,!0,!1),null!=t&&(et(Nt,Yt,Ml,!1),Fl(Ft,n,Li,qi,st,rt,null));let{left:a,top:c,width:u,height:h}=Sn;al=a,cl=c,ul=u,hl=h}function Ml(t,e,i,l,s,r,o){$n=kn._x=kn._y=!1,sl(t,e,i,l,s,r,0,!1,!0);let{left:a,top:c,width:u,height:h}=Sn,d=u>0||h>0,f=al!=a||cl!=c||ul!=u||hl!=h;if(d&&f&&Tn(Sn),kn.setScale&&d&&f){let t=a,e=u,i=c,n=h;if(1==S.ori&&(t=c,e=h,i=a,n=u),An&&Nn(w,Gn(t,w),Gn(t+e,w)),En)for(let t in y){let e=y[t];t!=w&&null==e.from&&e.min!=We&&Nn(t,Gn(i+n,t),Gn(i,t))}ol()}else N.lock&&(N._lock=!N._lock,el(e,!0,null!=t));null!=t&&(it(Nt,Yt),Fl(Nt,n,on,an,st,rt,null))}function Cl(t,e,i,l,s,r,o){N._lock||(Et(t),bi(),ol(),null!=t&&Fl(Wt,n,on,an,st,rt,null))}function Pl(){x.forEach(Sl),$t(n.width,n.height,!0)}he(Bt,Gt,Pl);const zl={};zl.mousedown=fl,zl.mousemove=ll,zl.mouseup=Ml,zl.dblclick=Cl,zl.setSeries=(t,e,i,l)=>{-1!=(i=(0,Rl.match[2])(n,e,i))&&Vn(i,l,!0,!1)},V&&(et(Ft,p,fl),et(Ut,p,ll),et(It,p,t=>{Et(t),nl(!1)}),et(Vt,p,function(t,e,i,n,l,s,r){if(N._lock)return;Et(t);let o=$n;if($n){let t,e,i=!0,n=!0,l=10;0==S.ori?(t=An,e=En):(t=En,e=An),t&&e&&(i=on<=l||on>=st-l,n=an<=l||an>=rt-l),t&&i&&(on=on<Li?0:st),e&&n&&(an=an<qi?0:rt),el(null,!0,!0),$n=!1}on=-10,an=-10,U.fill(null),el(null,!0,!0),o&&($n=o)}),et(Wt,p,Cl),dl.add(n),n.syncRect=nl);const Dl=n.hooks=t.hooks||{};function Tl(t,e,i){hn?dn.push([t,e,i]):t in Dl&&Dl[t].forEach(t=>{t.call(null,n,e,i)})}(t.plugins||[]).forEach(t=>{for(let e in t.hooks)Dl[e]=(Dl[e]||[]).concat(t.hooks[e])});const Ol=(t,e,i)=>i,Rl=vi({key:null,setSeries:!1,filters:{pub:Qe,sub:Qe},scales:[w,v[1]?v[1].scale:null],match:[Je,Je,Ol],values:[null,null]},N.sync);2==Rl.match.length&&Rl.match.push(Ol),N.sync=Rl;const Hl=Rl.key,Ul=In(Hl);function Fl(t,e,i,n,l,s,r){Rl.filters.pub(t,e,i,n,l,s,r)&&Ul.pub(t,e,i,n,l,s,r)}function Nl(){Tl("init",t,e),xi(e||t.data,!1),z[w]?mn(w,z[w]):bi(),bt=Sn.show&&(Sn.width>0||Sn.height>0),yt=wt=!0,$t(t.width,t.height)}return Ul.sub(n),n.pub=function(t,e,i,n,l,s,r){Rl.filters.sub(t,e,i,n,l,s,r)&&zl[t](null,e,i,n,l,s,r)},n.destroy=function(){Ul.unsub(n),dl.delete(n),tt.clear(),de(Bt,Gt,Pl),c.remove(),j?.remove(),Tl("destroy")},v.forEach(ce),x.forEach(function(t,e){if(t._show=t.show,t.show){let i=t.side%2,l=y[t.scale];null==l&&(t.scale=i?v[1].scale:w,l=y[t.scale]);let s=l.time;t.size=qe(t.size),t.space=qe(t.space),t.rotate=qe(t.rotate),ui(t.incrs)&&t.incrs.forEach(t=>{!li.has(t)&&li.set(t,si(t))}),t.incrs=qe(t.incrs||(2==l.distr?Ri:s?1==_?Gi:Ji:Hi)),t.splits=qe(t.splits||(s&&1==l.distr?O:3==l.distr?bn:4==l.distr?wn:yn)),t.stroke=qe(t.stroke),t.grid.stroke=qe(t.grid.stroke),t.ticks.stroke=qe(t.ticks.stroke),t.border.stroke=qe(t.border.stroke);let r=t.values;t.values=ui(r)&&!ui(r[0])?qe(r):s?ui(r)?en(D,tn(r,T)):di(r)?function(t,e){let i=Ci(e);return(e,n,l,s,r)=>n.map(e=>i(t(e)))}(D,r):r||R:r||xn,t.filter=qe(t.filter||(l.distr>=3&&10==l.log?Mn:3==l.distr&&2==l.log?Cn:Ge)),t.font=El(t.font),t.labelFont=El(t.labelFont),t._size=t.size(n,null,e,0),t._space=t._rotate=t._incrs=t._found=t._splits=t._values=null,t._size>0&&(ue[e]=!0,t._el=ie("u-axis",d))}}),i?i instanceof HTMLElement?(i.appendChild(c),Nl()):i(n,Nl):Nl(),n}Ml.assign=vi,Ml.fmtNum=Me,Ml.rangeNum=ke,Ml.rangeLog=xe,Ml.rangeAsinh=ye,Ml.orient=Vn,Ml.pxRatio=Qt,Ml.join=function(t,e){if(function(t){let e=t[0][0],i=e.length;for(let n=1;n<t.length;n++){let l=t[n][0];if(l.length!=i)return!1;if(l!=e)for(let t=0;t<i;t++)if(l[t]!=e[t])return!1}return!0}(t)){let e=t[0].slice();for(let i=1;i<t.length;i++)e.push(...t[i].slice(1));return function(t,e=100){const i=t.length;if(i<=1)return!0;let n=0,l=i-1;for(;n<=l&&null==t[n];)n++;for(;l>=n&&null==t[l];)l--;if(l<=n)return!0;const s=He(1,De((l-n+1)/e));for(let e=t[n],i=n+s;i<=l;i+=s){const n=t[i];if(null!=n){if(n<=e)return!1;e=n}}return!0}(e[0])||(e=function(t){let e=t[0],i=e.length,n=Array(i);for(let t=0;t<n.length;t++)n[t]=t;n.sort((t,i)=>e[t]-e[i]);let l=[];for(let e=0;e<t.length;e++){let s=t[e],r=Array(i);for(let t=0;t<i;t++)r[t]=s[n[t]];l.push(r)}return l}(e)),e}let i=new Set;for(let e=0;e<t.length;e++){let n=t[e][0],l=n.length;for(let t=0;t<l;t++)i.add(n[t])}let n=[Array.from(i).sort((t,e)=>t-e)],l=n[0].length,s=new Map;for(let t=0;t<l;t++)s.set(n[0][t],t);for(let i=0;i<t.length;i++){let r=t[i],o=r[0];for(let t=1;t<r.length;t++){let a=r[t],c=Array(l).fill(void 0),u=e?e[i][t]:1,h=[];for(let t=0;t<a.length;t++){let e=a[t],i=s.get(o[t]);null===e?0!=u&&(c[i]=e,2==u&&h.push(i)):c[i]=e}xi(c,h,l),n.push(c)}}return n},Ml.fmtDate=Ci,Ml.tzDate=function(t,e){let i;return"UTC"==e||"Etc/UTC"==e?i=new Date(+t+6e4*t.getTimezoneOffset()):e==Pi?i=t:(i=new Date(t.toLocaleString("en-US",{timeZone:e})),i.setMilliseconds(t.getMilliseconds())),i},Ml.sync=In;{Ml.addGap=function(t,e,i){let n=t[t.length-1];n&&n[0]==e?n[1]=i:t.push([e,i])},Ml.clipGaps=Ln;let t=Ml.paths={points:sl};t.linear=cl,t.stepped=function(t){const e=Ae(t.align,1),i=Ae(t.ascDesc,!1),n=Ae(t.alignGaps,0),l=Ae(t.extend,!1);return(t,s,r,o)=>Vn(t,s,(a,c,u,h,d,f,p,g,m,_,v)=>{[r,o]=_e(u,r,o);let x=a.pxRound,{left:y,width:b}=t.bbox,w=t=>x(f(t,h,_,g)),$=t=>x(p(t,d,v,m)),k=0==h.ori?Jn:Zn;const A={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},E=A.stroke,S=h.dir*(0==h.ori?1:-1);let M=$(u[1==S?r:o]),C=w(c[1==S?r:o]),P=C,z=C;l&&-1==e&&(z=y,k(E,z,M)),k(E,C,M);for(let t=1==S?r:o;t>=r&&t<=o;t+=S){let i=u[t];if(null==i)continue;let n=w(c[t]),l=$(i);1==e?k(E,n,M):k(E,P,l),k(E,n,l),M=l,P=n}let D=P;l&&1==e&&(D=y+b,k(E,D,M));let[T,O]=Wn(t,s);if(null!=a.fill||0!=T){let e=A.fill=new Path2D(E),i=$(a.fillTo(t,s,a.min,a.max,T));k(e,D,i),k(e,z,i)}if(!a.spanGaps){let l=[];l.push(...qn(c,u,r,o,S,w,n));let d=a.width*Qt/2,f=i||1==e?d:-d,p=i||-1==e?-d:d;l.forEach(t=>{t[0]+=f,t[1]+=p}),A.gaps=l=a.gaps(t,s,r,o,l),A.clip=Ln(l,h.ori,g,m,_,v)}return 0!=O&&(A.band=2==O?[Bn(t,s,r,o,E,-1),Bn(t,s,r,o,E,1)]:Bn(t,s,r,o,E,O)),A})},t.bars=function(t){const e=Ae((t=t||oi).size,[.6,We,1]),i=t.align||0,n=t.gap||0;let l=t.radius;l=null==l?[0,0]:"number"==typeof l?[l,0]:l;const s=qe(l),r=1-e[0],o=Ae(e[1],We),a=Ae(e[2],1),c=Ae(t.disp,oi),u=Ae(t.each,t=>{}),{fill:h,stroke:d}=c;return(t,e,l,f)=>Vn(t,e,(p,g,m,_,v,x,y,b,w,$,k)=>{let A,E,S=p.pxRound,M=i,C=n*Qt,P=o*Qt,z=a*Qt;0==_.ori?[A,E]=s(t,e):[E,A]=s(t,e);const D=_.dir*(0==_.ori?1:-1);let T,O,R,H=0==_.ori?Xn:tl,U=0==_.ori?u:(t,e,i,n,l,s,r)=>{u(t,e,i,l,n,r,s)},F=Ae(t.bands,ai).find(t=>t.series[0]==e),N=null!=F?F.dir:0,I=p.fillTo(t,e,p.min,p.max,N),V=S(y(I,v,k,w)),W=$,j=S(p.width*Qt),B=!1,L=null,q=null,Y=null,G=null;null==h||0!=j&&null==d||(B=!0,L=h.values(t,e,l,f),q=new Map,new Set(L).forEach(t=>{null!=t&&q.set(t,new Path2D)}),j>0&&(Y=d.values(t,e,l,f),G=new Map,new Set(Y).forEach(t=>{null!=t&&G.set(t,new Path2D)})));let{x0:K,size:Q}=c;if(null!=K&&null!=Q){M=1,g=K.values(t,e,l,f),2==K.unit&&(g=g.map(e=>t.posToVal(b+e*$,_.key,!0)));let i=Q.values(t,e,l,f);O=2==Q.unit?i[0]*$:x(i[0],_,$,b)-x(0,_,$,b),W=ul(g,m,x,_,$,b,W),R=W-O+C}else W=ul(g,m,x,_,$,b,W),R=W*r+C,O=W-R;R<1&&(R=0),j>=O/2&&(j=0),R<5&&(S=Ye);let J=R>0;O=S(Be(W-R-(J?j:0),z,P)),T=(0==M?O/2:M==D?0:O)-M*D*((0==M?C/2:0)+(J?j/2:0));const Z={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},X=B?null:new Path2D;let tt=null;if(null!=F)tt=t.data[F.series[1]];else{let{y0:i,y1:n}=c;null!=i&&null!=n&&(m=n.values(t,e,l,f),tt=i.values(t,e,l,f))}let et=A*O,it=E*O;for(let i=1==D?l:f;i>=l&&i<=f;i+=D){let n=m[i];if(null==n)continue;if(null!=tt){let t=tt[i]??0;if(n-t==0)continue;V=y(t,v,k,w)}let l=x(2!=_.distr||null!=c?g[i]:i,_,$,b),s=y(Ae(n,I),v,k,w),r=S(l-T),o=S(He(s,V)),a=S(Re(s,V)),u=o-a;if(null!=n){let l=n<0?it:et,s=n<0?et:it;B?(j>0&&null!=Y[i]&&H(G.get(Y[i]),r,a+De(j/2),O,He(0,u-j),l,s),null!=L[i]&&H(q.get(L[i]),r,a+De(j/2),O,He(0,u-j),l,s)):H(X,r,a+De(j/2),O,He(0,u-j),l,s),U(t,e,i,r-j/2,a,O+j,u)}}return j>0?Z.stroke=B?G:X:B||(Z._fill=0==p.width?p._fill:p._stroke??p._fill,Z.width=0),Z.fill=B?q:X,Z})},t.spline=function(t){return function(t,e){const i=Ae(e?.alignGaps,0);return(e,n,l,s)=>Vn(e,n,(r,o,a,c,u,h,d,f,p,g,m)=>{[l,s]=_e(a,l,s);let _,v,x,y=r.pxRound,b=t=>y(h(t,c,g,f)),w=t=>y(d(t,u,m,p));0==c.ori?(_=Kn,x=Jn,v=nl):(_=Qn,x=Zn,v=ll);const $=c.dir*(0==c.ori?1:-1);let k=b(o[1==$?l:s]),A=k,E=[],S=[];for(let t=1==$?l:s;t>=l&&t<=s;t+=$)if(null!=a[t]){let e=b(o[t]);E.push(A=e),S.push(w(a[t]))}const M={stroke:t(E,S,_,x,v,y),fill:null,clip:null,band:null,gaps:null,flags:1},C=M.stroke;let[P,z]=Wn(e,n);if(null!=r.fill||0!=P){let t=M.fill=new Path2D(C),i=w(r.fillTo(e,n,r.min,r.max,P));x(t,A,i),x(t,k,i)}if(!r.spanGaps){let t=[];t.push(...qn(o,a,l,s,$,b,i)),M.gaps=t=r.gaps(e,n,l,s,t),M.clip=Ln(t,c.ori,f,p,g,m)}return 0!=z&&(M.band=2==z?[Bn(e,n,l,s,C,-1),Bn(e,n,l,s,C,1)]:Bn(e,n,l,s,C,z)),M})}(hl,t)}}let Cl=class extends xt{constructor(){super(...arguments),this._chartData=[[]],this._currentValues={}}static get styles(){return[vt,o`${r('.uplot, .uplot *, .uplot *::before, .uplot *::after {box-sizing: border-box;}.uplot {font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";line-height: 1.5;width: min-content;}.u-title {text-align: center;font-size: 18px;font-weight: bold;}.u-wrap {position: relative;user-select: none;}.u-over, .u-under {position: absolute;}.u-under {overflow: hidden;}.uplot canvas {display: block;position: relative;width: 100%;height: 100%;}.u-axis {position: absolute;}.u-legend {font-size: 14px;margin: auto;text-align: center;}.u-inline {display: block;}.u-inline * {display: inline-block;}.u-inline tr {margin-right: 16px;}.u-legend th {font-weight: 600;}.u-legend th > * {vertical-align: middle;display: inline-block;}.u-legend .u-marker {width: 1em;height: 1em;margin-right: 4px;background-clip: padding-box !important;}.u-inline.u-live th::after {content: ":";vertical-align: middle;}.u-inline:not(.u-live) .u-value {display: none;}.u-series > * {padding: 4px;}.u-series th {cursor: pointer;}.u-legend .u-off > * {opacity: 0.3;}.u-select {background: rgba(0,0,0,0.07);position: absolute;pointer-events: none;}.u-cursor-x, .u-cursor-y {position: absolute;left: 0;top: 0;pointer-events: none;will-change: transform;}.u-hz .u-cursor-x, .u-vt .u-cursor-y {height: 100%;border-right: 1px dashed #607D8B;}.u-hz .u-cursor-y, .u-vt .u-cursor-x {width: 100%;border-bottom: 1px dashed #607D8B;}.u-cursor-pt {position: absolute;top: 0;left: 0;border-radius: 50%;border: 0 solid;pointer-events: none;will-change: transform;/*this has to be !important since we set inline "background" shorthand */background-clip: padding-box !important;}.u-axis.u-off, .u-select.u-off, .u-cursor-x.u-off, .u-cursor-y.u-off, .u-cursor-pt.u-off {display: none;}')}`,o`
        :host {
          display: block;
        }
        .header {
          padding: 16px 16px 0;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .chart-container {
          width: 100%;
          position: relative;
          padding-top: 16px;
        }
        .legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding: 8px 16px 16px;
          font-size: 12px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        .legend-name {
          color: var(--primary-text-color);
        }
        .legend-value {
          font-weight: 500;
          color: var(--primary-text-color);
        }
        /* Custom uPlot styling for HA themes */
        .uplot {
          font-family: inherit;
        }
        .uplot .u-legend {
          display: none; /* We use our own legend */
        }
        .uplot .u-axis {
          font-size: 10px;
        }
      `]}setConfig(t){if(super.setConfig(t),!t.series||!Array.isArray(t.series)||0===t.series.length)throw new Error("Please define at least one series");this._chart&&this._destroyChart()}disconnectedCallback(){super.disconnectedCallback(),this._destroyChart()}updated(t){super.updated(t),t.has("_config")&&this._chartContainer&&!this._chart&&this._initChart()}_destroyChart(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=void 0),this._chart&&(this._chart.destroy(),this._chart=void 0)}_initChart(){if(!this._chartContainer||!this._config)return;const t=this._chartContainer.clientWidth||400,e=this._config.height||200,i=[{}];this._config.series.forEach((t,e)=>{const n=t.color||bt[e%bt.length];i.push({label:t.name||`Series ${e+1}`,stroke:n,width:2,fill:this._config.fill?`${n}33`:void 0})});const n=[{stroke:"var(--secondary-text-color)",grid:{stroke:"var(--divider-color)",width:1},ticks:{stroke:"var(--divider-color)",width:1}},{stroke:"var(--secondary-text-color)",grid:{stroke:"var(--divider-color)",width:1},ticks:{stroke:"var(--divider-color)",width:1},values:(t,e)=>e.map(t=>yt(t,this._config.decimals,this._config.unit))}],l={width:t,height:e,series:i,axes:n,cursor:{points:{size:6,fill:"var(--card-background-color)"}},hooks:{setCursor:[t=>{if(null!=t.cursor.idx){const e=t.cursor.idx,i={};for(let n=1;n<t.series.length;n++)i[n-1]=void 0!==t.data[n][e]?t.data[n][e]:null;this._currentValues=i}}]}};this._chart=new Ml(l,this._chartData,this._chartContainer),this._resizeObserver=new ResizeObserver(t=>{for(const e of t)e.target===this._chartContainer&&this._chart&&this._chart.setSize({width:e.contentRect.width,height:this._config.height||200})}),this._resizeObserver.observe(this._chartContainer)}async _fetchData(){if(this._client&&this._config.series)try{const t=this._config.time_range||"1h",{start:e,end:i}=function(t){const e=Math.floor(Date.now()/1e3);let i=e-3600;const n=t.match(/^(\d+)([shd])$/);if(n){const t=parseInt(n[1],10);let l=0;switch(n[2]){case"s":l=t;break;case"h":l=3600*t;break;case"d":l=86400*t}i=e-l}return{start:i,end:e}}(t),n=e,l=i,s=this._config.step||$t(n,l),r=this._config.series.map(t=>this._client.rangeQuery(t.query,n,l,s)),o=await Promise.all(r),a=new Map;o.forEach((t,e)=>{if(t.data.result&&t.data.result.length>0){(t.data.result[0].values||[]).forEach(t=>{const i=t[0],n=parseFloat(t[1]);a.has(i)||a.set(i,new Array(this._config.series.length).fill(null)),a.get(i)[e]=n})}});const c=Array.from(a.keys()).sort((t,e)=>t-e),u=[c];for(let t=0;t<this._config.series.length;t++){const e=c.map(e=>a.get(e)[t]);u.push(e)}if(this._chartData=u,c.length>0){const t={};for(let e=0;e<this._config.series.length;e++)t[e]=u[e+1][c.length-1];this._currentValues=t}this._chart&&this._chart.setData(this._chartData)}catch(t){this._error=t.message||"Error fetching time series data"}}render(){return this._config?L`
      <ha-card>
        ${this._config.title?L`<div class="header">${this._config.title}</div>`:""}
        ${this.renderError()}
        <div class="chart-container"></div>
        ${this.renderLoading()}
        ${!1!==this._config.show_legend?this._renderLegend():""}
      </ha-card>
    `:L``}_renderLegend(){return this._config.series?L`
      <div class="legend">
        ${this._config.series.map((t,e)=>{const i=t.color||bt[e%bt.length],n=this._currentValues[e],l=null!=n?yt(n,this._config.decimals,this._config.unit):"-";return L`
            <div class="legend-item">
              <div class="legend-color" style="background-color: ${i}"></div>
              <span class="legend-name">${t.name||`Series ${e+1}`}</span>
              <span class="legend-value">${l}</span>
            </div>
          `})}
      </div>
    `:L``}static getStubConfig(){return{type:"custom:prometheus-timeseries-card",title:"Prometheus Timeseries",time_range:"1h",series:[{query:"",name:"Series 1"}]}}};t([gt({attribute:!1})],Cl.prototype,"_config",void 0),t([mt()],Cl.prototype,"_chartData",void 0),t([mt()],Cl.prototype,"_currentValues",void 0),t([
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function(t){return(e,i,n)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}(".chart-container")],Cl.prototype,"_chartContainer",void 0),Cl=t([dt("prometheus-timeseries-card")],Cl);let Pl=class extends xt{constructor(){super(...arguments),this._barData=[],this._calculatedMax=0}static get styles(){return[vt,o`
        :host {
          display: block;
        }
        .header {
          padding: 16px 16px 8px;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        .bars-container-horizontal {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 8px 16px 16px;
        }
        .bar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bar-label {
          width: 80px;
          flex-shrink: 0;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
        }
        .bar-track {
          flex-grow: 1;
          background: var(--secondary-background-color, rgba(100, 100, 100, 0.2));
          border-radius: 4px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s ease-out;
        }
        .bar-value {
          width: 60px;
          flex-shrink: 0;
          text-align: right;
          font-size: 14px;
          font-weight: 500;
        }

        .bars-container-vertical {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          padding: 16px;
          height: 200px;
          justify-content: space-around;
        }
        .bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
          height: 100%;
        }
        .bar-col-value {
          font-size: 12px;
          font-weight: 500;
        }
        .bar-col-track {
          width: 100%;
          max-width: 40px;
          flex-grow: 1;
          background: var(--secondary-background-color, rgba(100, 100, 100, 0.2));
          border-radius: 4px;
          position: relative;
          display: flex;
          align-items: flex-end;
        }
        .bar-col-fill {
          width: 100%;
          border-radius: 4px;
          transition: height 0.3s ease-out;
        }
        .bar-col-label {
          font-size: 12px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 100%;
        }
      `]}setConfig(t){if(super.setConfig(t),!t.query)throw new Error("Please define a query")}async _fetchData(){if(this._client&&this._config.query)try{const t=await this._client.instantQuery(this._config.query);if(!t.data||!t.data.result)return void(this._barData=[]);const e=t.data.result,i=[];let n=0;for(const t of e){let e="Value";if(this._config.group_by&&t.metric[this._config.group_by])e=t.metric[this._config.group_by];else if(Object.keys(t.metric).length>0){const i=Object.keys(t.metric)[0];e=t.metric[i]}const l=t.value?parseFloat(t.value[1]):0;l>n&&(n=l),i.push({label:e,value:l,color:"var(--primary-color)"})}i.sort((t,e)=>e.value-t.value),this._calculatedMax=this._config.max||n||100,i.forEach(t=>{t.color=wt(t.value,this._config.thresholds||[])}),this._barData=i}catch(t){this._error=t.message||"Error fetching bar chart data"}}render(){return this._config?L`
      <ha-card>
        ${this._config.name?L`<div class="header">${this._config.name}</div>`:""}
        ${this.renderError()}
        ${this._barData.length>0?this._renderBars():L`<div style="padding: 16px;">No data</div>`}
        ${this.renderLoading()}
      </ha-card>
    `:L``}_renderBars(){if("vertical"===this._config.orientation)return L`
        <div class="bars-container-vertical">
          ${this._barData.map(t=>{const e=Math.min(100,Math.max(0,t.value/this._calculatedMax*100));return L`
              <div class="bar-col">
                ${!1!==this._config.show_values?L`<div class="bar-col-value">${yt(t.value,this._config.decimals,this._config.unit)}</div>`:""}
                <div class="bar-col-track">
                  <div class="bar-col-fill" style="height: ${e}%; background-color: ${t.color};"></div>
                </div>
                <div class="bar-col-label" title="${t.label}">${t.label}</div>
              </div>
            `})}
        </div>
      `;const t=this._config.bar_height||24;return L`
      <div class="bars-container-horizontal">
        ${this._barData.map(e=>{const i=Math.min(100,Math.max(0,e.value/this._calculatedMax*100));return L`
            <div class="bar-row">
              <div class="bar-label" title="${e.label}">${e.label}</div>
              <div class="bar-track" style="height: ${t}px;">
                <div class="bar-fill" style="width: ${i}%; background-color: ${e.color};"></div>
              </div>
              ${!1!==this._config.show_values?L`<div class="bar-value">${yt(e.value,this._config.decimals,this._config.unit)}</div>`:""}
            </div>
          `})}
      </div>
    `}static getStubConfig(){return{type:"custom:prometheus-bar-card",name:"Prometheus Bar Chart",query:"",orientation:"horizontal"}}};t([gt({attribute:!1})],Pl.prototype,"_config",void 0),t([mt()],Pl.prototype,"_barData",void 0),t([mt()],Pl.prototype,"_calculatedMax",void 0),Pl=t([dt("prometheus-bar-card")],Pl),console.info("%c PROMETHEUS-DASHBOARD %c v0.1.0 ","color: white; background: #e65100; font-weight: bold;","color: #e65100; background: white; font-weight: bold;");
