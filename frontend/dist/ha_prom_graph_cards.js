function e(e,t,s,i){var r,n=arguments.length,o=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,s,i);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(o=(n<3?r(o):n>3?r(t,s,o):r(t,s))||o);return n>3&&o&&Object.defineProperty(t,s,o),o}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,s=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let n=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const s=void 0!==t&&1===t.length;s&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(t,e))}return e}toString(){return this.cssText}};const o=e=>new n("string"==typeof e?e:e+"",void 0,i),l=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,s,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1],e[0]);return new n(s,e,i)},a=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return o(t)})(e):e,{is:c,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:u,getOwnPropertySymbols:p,getPrototypeOf:m}=Object,f=globalThis,_=f.trustedTypes,g=_?_.emptyScript:"",v=f.reactiveElementPolyfillSupport,b=(e,t)=>e,x={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},y=(e,t)=>!c(e,t),w={attribute:!0,type:String,converter:x,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);void 0!==i&&h(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);r?.call(this,t),this.requestUpdate(e,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=m(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...u(e),...p(e)];for(const s of t)this.createProperty(s,e[s])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,s]of t)this.elementProperties.set(e,s)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const s=this._$Eu(e,t);void 0!==s&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{if(s)e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const s of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,e.appendChild(i)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:x).toAttribute(t,s.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const s=this.constructor,i=s._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=s.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:x;this._$Em=i;const n=r.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,s,i=!1,r){if(void 0!==e){const n=this.constructor;if(!1===i&&(r=this[e]),s??=n.getPropertyOptions(e),!((s.hasChanged??y)(r,t)||s.useDefault&&s.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,s))))return;this.C(e,t,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==r||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,s]of e){const{wrapped:e}=s,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,s,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[b("elementProperties")]=new Map,$[b("finalized")]=new Map,v?.({ReactiveElement:$}),(f.reactiveElementVersions??=[]).push("2.1.2");const k=globalThis,M=e=>e,A=k.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+C,P=`<${z}>`,T=document,D=()=>T.createComment(""),B=e=>null===e||"object"!=typeof e&&"function"!=typeof e,q=Array.isArray,L="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,N=/>/g,R=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,j=/"/g,I=/^(?:script|style|textarea|title)$/i,V=e=>(t,...s)=>({_$litType$:e,strings:t,values:s}),U=V(1),W=V(2),G=Symbol.for("lit-noChange"),Q=Symbol.for("lit-nothing"),K=new WeakMap,Y=T.createTreeWalker(T,129);function Z(e,t){if(!q(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const J=(e,t)=>{const s=e.length-1,i=[];let r,n=2===t?"<svg>":3===t?"<math>":"",o=H;for(let t=0;t<s;t++){const s=e[t];let l,a,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,a=o.exec(s),null!==a);)h=o.lastIndex,o===H?"!--"===a[1]?o=F:void 0!==a[1]?o=N:void 0!==a[2]?(I.test(a[2])&&(r=RegExp("</"+a[2],"g")),o=R):void 0!==a[3]&&(o=R):o===R?">"===a[0]?(o=r??H,c=-1):void 0===a[1]?c=-2:(c=o.lastIndex-a[2].length,l=a[1],o=void 0===a[3]?R:'"'===a[3]?j:O):o===j||o===O?o=R:o===F||o===N?o=H:(o=R,r=void 0);const d=o===R&&e[t+1].startsWith("/>")?" ":"";n+=o===H?s+P:c>=0?(i.push(l),s.slice(0,c)+E+s.slice(c)+C+d):s+C+(-2===c?t:d)}return[Z(e,n+(e[s]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class X{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,n=0;const o=e.length-1,l=this.parts,[a,c]=J(e,t);if(this.el=X.createElement(a,s),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Y.nextNode())&&l.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=c[n++],s=i.getAttribute(e).split(C),o=/([.?@])?(.*)/.exec(t);l.push({type:1,index:r,name:o[2],strings:s,ctor:"."===o[1]?re:"?"===o[1]?ne:"@"===o[1]?oe:ie}),i.removeAttribute(e)}else e.startsWith(C)&&(l.push({type:6,index:r}),i.removeAttribute(e));if(I.test(i.tagName)){const e=i.textContent.split(C),t=e.length-1;if(t>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],D()),Y.nextNode(),l.push({type:2,index:++r});i.append(e[t],D())}}}else if(8===i.nodeType)if(i.data===z)l.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(C,e+1));)l.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const s=T.createElement("template");return s.innerHTML=e,s}}function ee(e,t,s=e,i){if(t===G)return t;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const n=B(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(e),r._$AT(e,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(t=ee(e,r._$AS(e,t.values),r,i)),t}class te{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=(e?.creationScope??T).importNode(t,!0);Y.currentNode=i;let r=Y.nextNode(),n=0,o=0,l=s[0];for(;void 0!==l;){if(n===l.index){let t;2===l.type?t=new se(r,r.nextSibling,this,e):1===l.type?t=new l.ctor(r,l.name,l.strings,this,e):6===l.type&&(t=new le(r,this,e)),this._$AV.push(t),l=s[++o]}n!==l?.index&&(r=Y.nextNode(),n++)}return Y.currentNode=T,i}p(e){let t=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class se{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ee(this,e,t),B(e)?e===Q||null==e||""===e?(this._$AH!==Q&&this._$AR(),this._$AH=Q):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>q(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Q&&B(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:s}=e,i="number"==typeof s?this._$AC(e):(void 0===s.el&&(s.el=X.createElement(Z(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new te(i,this),s=e.u(this.options);e.p(t),this.T(s),this._$AH=e}}_$AC(e){let t=K.get(e.strings);return void 0===t&&K.set(e.strings,t=new X(e)),t}k(e){q(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new se(this.O(D()),this.O(D()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=M(e).nextSibling;M(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=Q}_$AI(e,t=this,s,i){const r=this.strings;let n=!1;if(void 0===r)e=ee(this,e,t,0),n=!B(e)||e!==this._$AH&&e!==G,n&&(this._$AH=e);else{const i=e;let o,l;for(e=r[0],o=0;o<r.length-1;o++)l=ee(this,i[s+o],t,o),l===G&&(l=this._$AH[o]),n||=!B(l)||l!==this._$AH[o],l===Q?e=Q:e!==Q&&(e+=(l??"")+r[o+1]),this._$AH[o]=l}n&&!i&&this.j(e)}j(e){e===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class re extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Q?void 0:e}}class ne extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Q)}}class oe extends ie{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=ee(this,e,t,0)??Q)===G)return;const s=this._$AH,i=e===Q&&s!==Q||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==Q&&(s===Q||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class le{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){ee(this,e)}}const ae=k.litHtmlPolyfillSupport;ae?.(X,se),(k.litHtmlVersions??=[]).push("3.3.3");const ce=globalThis;class he extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,s)=>{const i=s?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=s?.renderBefore??null;i._$litPart$=r=new se(t.insertBefore(D(),e),e,void 0,s??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}he._$litElement$=!0,he.finalized=!0,ce.litElementHydrateSupport?.({LitElement:he});const de=ce.litElementPolyfillSupport;de?.({LitElement:he}),(ce.litElementVersions??=[]).push("4.2.2");const ue=e=>(t,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},pe={attribute:!0,type:String,converter:x,reflect:!1,hasChanged:y},me=(e=pe,t,s)=>{const{kind:i,metadata:r}=s;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(s.name,e),"accessor"===i){const{name:i}=s;return{set(s){const r=t.get.call(this);t.set.call(this,s),this.requestUpdate(i,r,e,!0,s)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];t.call(this,s),this.requestUpdate(i,r,e,!0,s)}}throw Error("Unsupported decorator location: "+i)};function fe(e){return(t,s)=>"object"==typeof s?me(e,t,s):((e,t,s)=>{const i=t.hasOwnProperty(s);return t.constructor.createProperty(s,e),i?Object.getOwnPropertyDescriptor(t,s):void 0})(e,t,s)}function _e(e){return fe({...e,state:!0,attribute:!1})}function ge(e,t){return(t,s,i)=>((e,t,s)=>(s.configurable=!0,s.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,s),s))(t,s,{get(){return(t=>t.renderRoot?.querySelector(e)??null)(this)}})}const ve=(e,t,s,i,r)=>n=>t+s*Math.sin(n/i*Math.PI*2)+(e()-.5)*r;const be=(e,t)=>t.map(([t,s])=>[{[e]:t},s]),xe=(e,t,s)=>i=>e.map(([e,r],n)=>[e,ve(i,r,t*(r||1),25+7*n,s*(r||1))]),ye=(e,t,s=1,i=0)=>(r,n)=>r>n*e&&r<n*(e+t)?i:s,we=(e,t=.1,s=.08)=>({instant:e,range:xe(e,t,s)}),$e=be("instance",[["nas",23],["router",71],["pi-kitchen",12],["hass",94]]),ke=be("mountpoint",[["/",41],["/boot",18],["/data",86],["/var/lib/docker",63]]),Me=be("instance",[["nas",62e8],["router",31e7],["pi-kitchen",14e8],["hass",27e8]]),Ae=be("device",[["eth0 rx",42e5],["eth0 tx",11e5],["wlan0 rx",8e5]]),Se=be("job",[["node",.042],["hass",.31],["blackbox",.12],["mqtt",.018]]),Ee=be("job",[["node",14],["blackbox",9],["home-assistant",6],["mqtt",3],["prometheus",2]]),Ce=["0.005","0.01","0.025","0.05","0.1","0.25","0.5","1","+Inf"],ze=[[/bucket/,{instant:[],range:e=>Ce.map((t,s)=>[{le:t},t=>8*(s+1)+Math.pow(s,1.6)*(6+5*Math.sin(t/9))+6*e()])}],[/network|receive|transmit/,{instant:Ae,range:e=>[[Ae[0][0],ve(e,42e5,25e5,40,12e5)],[Ae[1][0],ve(e,11e5,6e5,55,5e5)],[Ae[2][0],ve(e,8e5,4e5,30,3e5)]]}],[/cpu/,we($e,.3,.25)],[/filesystem|disk/,we(ke,.02,.01)],[/memory/,we(Me,.08,.04)],[/temp/,we([[{sensor:"living room"},22.4]],.03,.01)],[/power|watt/,we([[{device:"house"},1843]],.25,.1)],[/scrape_duration/,we(Se,.3,.3)],[/count by \(job\)/,we(Ee,0,0)],[/avg\s*\(\s*up\s*\)/,{instant:[[{},80]],range:()=>[[{},ye(.6,.1,100,80)]]}],[/count\s*\(\s*up\s*\)/,we([[{},5]],0,0)],[/sum\s*\(\s*up\s*\)/,{instant:[[{},4]],range:()=>[[{},ye(.6,.1,5,4)]]}],[/\bup\b/,{instant:[[{job:"node",instance:"nas:9100"},1],[{job:"node",instance:"router:9100"},1],[{job:"node",instance:"pi-kitchen:9100"},0],[{job:"hass",instance:"hass:8123"},1],[{job:"mqtt",instance:"broker:9234"},1]],range:()=>[[{job:"nas"},ye(.62,.08)],[{job:"router"},()=>1],[{job:"pi-kitchen"},ye(.2,.35)],[{job:"mqtt"},ye(.85,.04)]]}]],Pe=we([[{job:"demo"},42]],.4,.2),Te=e=>ze.find(([t])=>t.test(e))?.[1]??Pe;function De(){const e=e=>new Date(Date.now()-e).toISOString();return[{labels:{alertname:"HostHighCpuLoad",severity:"critical",instance:"hass"},state:"firing",activeAt:e(282e4),annotations:{summary:"CPU load is above 90% for 10 minutes"}},{labels:{alertname:"DiskAlmostFull",severity:"warning",mountpoint:"/data"},state:"firing",activeAt:e(1872e4),annotations:{summary:"/data is 86% full"}},{labels:{alertname:"TargetDown",severity:"warning",instance:"pi-kitchen:9100"},state:"pending",activeAt:e(18e4),annotations:{summary:"pi-kitchen is not reachable"}}]}async function Be(e){const t=String(e.type).split("/")[1],s=Math.floor(Date.now()/1e3);let i;switch(t){case"query":i=((e,t)=>({status:"success",data:{resultType:"vector",result:e.map(([e,s])=>({metric:e,value:[t,String(s)]}))}}))(Te(String(e.query)).instant,s);break;case"query_range":i=function(e,t,s,i){const r=Math.max(2,Math.min(2e3,Math.floor((s-t)/i)));return{status:"success",data:{resultType:"matrix",result:e.map(([e,s])=>({metric:e,values:Array.from({length:r+1},(e,n)=>[t+n*i,String(Math.max(0,s(n,r)))])}))}}}(Te(String(e.query)).range(function(e=42){let t=e;return()=>(t=16807*t%2147483647)/2147483647}()),Number(e.start),Number(e.end),parseFloat(e.step)||60);break;case"alerts":i={alerts:De()};break;case"entries":i=[{entry_id:"demo",title:"Demo",url:"http://prometheus:9090",loaded:!0}];break;default:i={status:"success",data:[]}}return i}const qe=new Set(["hui-card-picker"]);const Le="prometheus-variables-changed",He="$__all",Fe="prometheus-cards-variables",Ne=globalThis,Re=()=>"undefined"==typeof window?void 0:window.localStorage;function Oe(){if(!Ne.__PROM_CARDS_VARS__){let e={};try{e=JSON.parse(Re()?.getItem(Fe)||"{}")||{}}catch{e={}}Ne.__PROM_CARDS_VARS__={values:e,options:{}}}return Ne.__PROM_CARDS_VARS__}function je(e){return Oe().values[e]}function Ie(e,t){Oe().options[e]=t}function Ve(e){const t=Oe(),s=Object.keys(e).filter(s=>JSON.stringify(t.values[s])!==JSON.stringify(e[s]));if(s.length){t.values={...t.values,...e};try{Re()?.setItem(Fe,JSON.stringify(t.values))}catch{}"undefined"!=typeof window&&window.dispatchEvent(new CustomEvent(Le,{detail:{names:s}}))}}function Ue(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}const We=/\$\{(\w+)\}|\$(\w+)/g;function Ge(e,t){return e.includes("$")?e.replace(We,(s,i,r,n)=>{const o=i||r;if(!(o in t))return s;const l=e.slice(0,n),a=/[=!]~\s*"[^"]*$/.test(l);return function(e,t){const s=Array.isArray(e)?e:[e];return 1!==s.length||t?s.length?s.map(Ue).join("|"):".*":s[0]}(t[o],a)}):e}function Qe(e,t){if(!e.includes("$")||!t.length)return!1;const s=function(e){const t=new Set;for(const s of e.matchAll(We))t.add(s[1]||s[2]);return[...t]}(e);return t.some(e=>s.includes(e))}class Ke{constructor(e,t,s=!1,i=!0){this.hass=e,this.entryId=t,this.demo=s,this.variables=i}_ws(e){return this.demo?Be(e):this.hass.callWS(e)}_msg(e,t={}){const s={type:`prometheus_dashboard/${e}`};this.entryId&&(s.entry_id=this.entryId);for(const[e,i]of Object.entries(t))void 0!==i&&(s[e]=i);return s}_expand(e){return this.variables?Ge(e,function(){const e=Oe(),t={};for(const[s,i]of Object.entries(e.values)){const r=Array.isArray(i)?i:[i];t[s]=r.includes(He)?e.options[s]||[]:i}return t}()):e}async instantQuery(e,t){return this._ws(this._msg("query",{query:this._expand(e),time:t}))}async rangeQuery(e,t,s,i){return this._ws(this._msg("query_range",{query:this._expand(e),start:t,end:s,step:i}))}async createAlert(e){return this._ws(this._msg("create_alert",{...e}))}async silence(e,t){return this._ws(this._msg("silence",{labels:e,minutes:t}))}async getLabels(){return(await this._ws(this._msg("labels"))).data}async getLabelValues(e){return(await this._ws(this._msg("label_values",{label:e}))).data}async getMetadata(e){return(await this._ws(this._msg("metadata",{metric:e}))).data}async getSeries(e){return(await this._ws(this._msg("series",{match:e}))).data}async getAlerts(){return(await this._ws(this._msg("alerts"))).alerts||[]}static async getEntries(e){return e.callWS({type:"prometheus_dashboard/entries"})}}const Ye=l`
  :host {
    display: block;
  }
  /* Every panel: same padding, fills the height given by the layout / card_height */
  ha-card {
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    padding: 16px;
    gap: 8px;
    height: 100%;
    background: var(--ha-card-background, var(--card-background-color, var(--paper-card-background-color, white)));
    box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  /* Panel title: identical on every card, so panels in one row line up */
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    height: 24px;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--primary-text-color);
  }
  .card-header .card-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-header .card-extra {
    font-size: 12px;
    font-weight: 400;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }

  /* Content area that takes the remaining panel height */
  .fill {
    flex: 1 1 auto;
    min-height: 0;
    position: relative;
  }

  /* "Transparent background" option: no plate, no shadow, no border */
  :host([transparent]) ha-card {
    background: none;
    box-shadow: none;
    border: none;
    --ha-card-border-width: 0;
    backdrop-filter: none;
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

  .placeholder-state {
    color: var(--secondary-text-color);
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
`,Ze={entry_id:"Prometheus server",query:"PromQL query",name:"Name",title:"Title",icon:"Icon",unit:"Unit",decimals:"Decimals",refresh_interval:"Refresh interval (s)",min:"Min",max:"Max",arc_width:"Arc width",sparkline:"Show sparkline",sparkline_hours:"Sparkline range (hours)",time_range:"Time range",step:"Step (s, empty = auto)",fill:"Fill area",show_legend:"Show legend",height:"Chart height (px)",orientation:"Orientation",show_values:"Show values",bar_height:"Bar height (px)",value:"Value",color:"Color",section_display:"Display",section_thresholds:"Thresholds",helper_entry_id:"Leave empty to use the first configured server",helper_unit:"Values are scaled within the dimension (B → KiB → MiB, W → kW, s → min → h). You can also type a custom suffix",helper_thresholds:"The color of the highest threshold not greater than the value is used",add_threshold:"Add threshold",remove:"Remove",horizontal:"Horizontal",vertical:"Vertical",no_query:"Set a PromQL query in the card editor",no_data:"No data",stat_name:"Prometheus Stat",stat_desc:"Single Prometheus metric value with optional sparkline",gauge_name:"Prometheus Gauge",gauge_desc:"Radial gauge with threshold colors",timeseries_name:"Prometheus Time Series",timeseries_desc:"Grafana-like line/area chart for one or more PromQL queries",bar_name:"Prometheus Bar Chart",bar_desc:"Bar chart grouped by a Prometheus label",legend_format:"Legend format",helper_legend_format:"Grafana syntax: {{instance}} {{job}}. Empty = metric{labels}",palette:"Color scheme",palette_classic:"Classic palette (Grafana)","palette_green-yellow-red":"Green-Yellow-Red (by series)",palette_blues:"Blues (by series)",palette_greens:"Greens (by series)",palette_reds:"Reds (by series)",palette_purples:"Purples (by series)",palette_single:"Single color (theme)",color_mode:"Color by",color_mode_thresholds:"Thresholds",color_mode_series:"Series palette",line_width:"Line width",fill_opacity:"Fill opacity (%)",sparkline_fill:"Sparkline gradient",reduce:"Several series",reduce_none:"Show each series",reduce_sum:"Sum",reduce_avg:"Average",reduce_min:"Min",reduce_max:"Max",show_labels:"Show series labels",stacked:"Stack series",legend_mode:"Legend mode",legend_mode_list:"List",legend_mode_table:"Table",legend_values:"Legend values",legend_value_last:"Last",legend_value_min:"Min",legend_value_max:"Max",legend_value_mean:"Mean",sort:"Sort",sort_desc:"Value, descending",sort_asc:"Value, ascending",sort_name:"Name",sort_none:"As returned",limit:"Max bars",section_legend:"Legend",transparent:"Transparent background",show_current:"Show current / hovered value",current:"Current",layout:"Layout",layout_default:"Value with icon",layout_tiles:"Colored tiles (Grafana)",tile_style:"Tile background",tile_style_gradient:"Gradient",tile_style_solid:"Solid",tile_height:"Tile height",tile_min_width:"Tile min width",timeline_name:"Prometheus State Timeline",timeline_desc:"Grafana-like state timeline: value changes over time as colored bands",pie_name:"Prometheus Pie Chart",pie_desc:"Pie / donut chart, one slice per returned series",row_height:"Row height",merge_values:"Merge equal values",section_mappings:"Value mappings",helper_mappings:"Exact value (e.g. 1) or range from..to → text and color. Unmapped values use thresholds or the palette",add_mapping:"Add mapping",from:"From",to:"To",text:"Text",pie_type:"Type",pie_type_donut:"Donut",pie_type_pie:"Pie",donut_width:"Donut width",show_total:"Total in the center",size:"Size",legend_position:"Legend position",legend_position_right:"Right",legend_position_bottom:"Bottom",legend_pie_value:"Value",legend_pie_percent:"Percent",other:"Other",total:"Total",test_query:"Test query",testing:"Testing…",test_ok:"✓ {n} series ({type}), {ms} ms",autocomplete_hint:"Ctrl+Space — suggestions",bargauge_name:"Prometheus Bar Gauge",bargauge_desc:"Grafana-like bar gauges with threshold colors, one per series",table_name:"Prometheus Table",table_desc:"Instant query as a table: labels as columns, sortable",heatmap_name:"Prometheus Heatmap",heatmap_desc:"Heatmap of histogram buckets or many series over time",alerts_name:"Prometheus Alerts",alerts_desc:"List of active Prometheus alerts",display_mode:"Display mode",display_mode_gradient:"Gradient",display_mode_basic:"Basic",display_mode_lcd:"LCD (segments)",show_unfilled:"Show unfilled area",columns:"Columns (labels)",helper_columns:"Label names to show; empty = all labels",hide_columns:"Hidden labels",value_column:"Value column title",sort_by:"Sort by",sort_by_value:"Value",sort_by_label:"First label",sort_dir:"Direction",sort_dir_desc:"Descending",sort_dir_asc:"Ascending",max_rows:"Max rows",color_cells:"Color value cells by thresholds",heatmap_mode:"Data",heatmap_mode_histogram:"Histogram buckets (le label)",heatmap_mode_series:"Series as rows",color_scheme:"Color scheme",scheme_oranges:"Oranges",scheme_spectral:"Spectral",scheme_viridis:"Viridis",scheme_blues:"Blues",scheme_greens:"Greens",scheme_reds:"Reds",scheme_purples:"Purples",log_scale:"Logarithmic colors",show_legend_scale:"Show color scale",state_filter:"States",state_firing:"Firing",state_pending:"Pending",state_inactive:"Inactive",severity_filter:"Severity (comma separated, empty = all)",show_labels_alerts:"Show labels",show_annotations:"Show summary / description",no_alerts:"No active alerts",active_since:"since {time}",unit_col:"Unit",states:"States",severities:"Severity (comma separated, empty = all)",name_filter:"Alert name filter (text or regex)",section_panel:"Panel",section_query:"Query",card_height:"Panel height (px)",helper_card_height:"Empty = auto. Set the same value on cards of one row to make them equally high",helper_query:"One query per panel; it may return many series (each gets its own color and legend entry)",helper_height:"Chart height when the panel height is auto",helper_bar_height:"Empty = auto",helper_row_height:"Empty = auto",helper_tile_height:"Empty = auto",helper_min:"Empty = auto; the axis always starts with a labelled value",transparent_color:"Transparent",show_x_axis:"Time axis labels",show_y_axis:"Value axis labels",show_grid:"Grid lines",threshold_style:"Show thresholds",threshold_style_off:"Off",threshold_style_line:"As lines",threshold_style_area:"As filled regions",transparent_track:"Transparent unfilled area",value_at_end:"Value at the end of the bar",gradient:"Gradient by thresholds",counters:"Raw bucket counters",counters_auto:"Auto (no rate/increase in the query)",counters_yes:"Yes, convert to increases",counters_no:"No, values are already rates",helper_counters:"Histogram buckets must be rates or increases, e.g. sum by (le) (rate(x_bucket[5m])). Raw _bucket counters are converted automatically",source:"Source",source_all:"All",source_prometheus:"Prometheus rules",source_local:"Home Assistant PromQL alerts",min_active:"Firing window (active for at least)",helper_min_active:"e.g. 5m, 1h: alerts active for a shorter time are hidden. Empty = all",group_by_name:"One row per alert name",variables_name:"Prometheus Variables",variables_desc:"Drop-downs ($instance, $job…) substituted into the queries of all cards",section_variables:"Variables",helper_variables:'Use in the queries of other cards as $name or ${name}; for several values: label=~"$name". Values are the label label_name of the query result (like label_values in Grafana) or a fixed list',variable_n:"Variable {n}",add_variable:"Add variable",no_variables:"Add a variable in the card editor",var_all:"All",label:"Label",label_name:"Label with the values",regex:"Regex filter",values:"Fixed values",default:"Default",multi:"Multiple values",include_all:'"All" option',layout_row:"Row",layout_column:"Column",create_alert:"Create alert",create_alert_title:"New PromQL alert",alert_name:"Alert name",alert_condition:"Condition",alert_threshold:"Threshold",alert_for:"For",alert_severity:"Severity",alert_created:'Alert "{name}" created: {series} series, {active} firing now',alert_admin_only:"Only an administrator can create alerts",cancel:"Cancel",silence:"Silence",silenced:"Silenced",silenced_until:"silenced until {time}",silence_done:"Silence created in Alertmanager"},Je={en:Ze,ru:{entry_id:"Сервер Prometheus",query:"Запрос PromQL",name:"Название",title:"Заголовок",icon:"Иконка",unit:"Единица измерения",decimals:"Знаков после запятой",refresh_interval:"Интервал обновления (с)",min:"Минимум",max:"Максимум",arc_width:"Толщина дуги",sparkline:"Показывать мини-график",sparkline_hours:"Период мини-графика (ч)",time_range:"Период",step:"Шаг (с, пусто = авто)",fill:"Заливка области",show_legend:"Показывать легенду",height:"Высота графика (px)",orientation:"Ориентация",show_values:"Показывать значения",bar_height:"Высота столбца (px)",value:"Значение",color:"Цвет",section_display:"Отображение",section_thresholds:"Пороги",helper_entry_id:"Оставьте пустым, чтобы использовать первый настроенный сервер",helper_unit:"Значение масштабируется в пределах размерности (B → KiB → MiB, W → kW, s → мин → ч). Можно ввести свой суффикс",helper_thresholds:"Используется цвет наибольшего порога, не превышающего значение",add_threshold:"Добавить порог",remove:"Удалить",horizontal:"Горизонтально",vertical:"Вертикально",no_query:"Укажите запрос PromQL в редакторе карточки",no_data:"Нет данных",stat_name:"Prometheus: значение",stat_desc:"Одно значение метрики Prometheus с мини-графиком",gauge_name:"Prometheus: индикатор",gauge_desc:"Круговой индикатор с цветовыми порогами",timeseries_name:"Prometheus: временной ряд",timeseries_desc:"График в стиле Grafana для одного или нескольких запросов PromQL",bar_name:"Prometheus: столбцы",bar_desc:"Столбчатая диаграмма с группировкой по метке Prometheus",legend_format:"Формат легенды",helper_legend_format:"Синтаксис Grafana: {{instance}} {{job}}. Пусто = metric{labels}",palette:"Цветовая схема",palette_classic:"Классическая палитра (Grafana)","palette_green-yellow-red":"Зелёный-жёлтый-красный (по сериям)",palette_blues:"Синие (по сериям)",palette_greens:"Зелёные (по сериям)",palette_reds:"Красные (по сериям)",palette_purples:"Фиолетовые (по сериям)",palette_single:"Один цвет (тема)",color_mode:"Цвет по",color_mode_thresholds:"Порогам",color_mode_series:"Палитре серий",line_width:"Толщина линии",fill_opacity:"Прозрачность заливки (%)",sparkline_fill:"Градиент под мини-графиком",reduce:"Несколько серий",reduce_none:"Показать каждую",reduce_sum:"Сумма",reduce_avg:"Среднее",reduce_min:"Минимум",reduce_max:"Максимум",show_labels:"Подписи серий",stacked:"Накопление (stack)",legend_mode:"Вид легенды",legend_mode_list:"Список",legend_mode_table:"Таблица",legend_values:"Значения в легенде",legend_value_last:"Последнее",legend_value_min:"Мин",legend_value_max:"Макс",legend_value_mean:"Среднее",sort:"Сортировка",sort_desc:"По значению, убыв.",sort_asc:"По значению, возр.",sort_name:"По имени",sort_none:"Как вернул Prometheus",limit:"Максимум столбцов",section_legend:"Легенда",transparent:"Прозрачный фон",show_current:"Показывать текущее / выделенное значение",current:"Текущее",layout:"Вид",layout_default:"Значение с иконкой",layout_tiles:"Цветные плашки (Grafana)",tile_style:"Фон плашки",tile_style_gradient:"Градиент",tile_style_solid:"Сплошной",tile_height:"Высота плашки",tile_min_width:"Мин. ширина плашки",timeline_name:"Prometheus: шкала состояний",timeline_desc:"Шкала состояний как в Grafana: изменения значения во времени цветными полосами",pie_name:"Prometheus: круговая диаграмма",pie_desc:"Круговая / кольцевая диаграмма, сектор на каждую серию",row_height:"Высота строки",merge_values:"Объединять одинаковые значения",section_mappings:"Сопоставление значений",helper_mappings:"Точное значение (например 1) или диапазон от..до → текст и цвет. Остальные значения — по порогам или палитре",add_mapping:"Добавить сопоставление",from:"От",to:"До",text:"Текст",pie_type:"Тип",pie_type_donut:"Кольцо",pie_type_pie:"Круг",donut_width:"Толщина кольца",show_total:"Сумма в центре",size:"Размер",legend_position:"Положение легенды",legend_position_right:"Справа",legend_position_bottom:"Снизу",legend_pie_value:"Значение",legend_pie_percent:"Процент",other:"Прочее",total:"Всего",test_query:"Проверить запрос",testing:"Проверка…",test_ok:"✓ Серий: {n} ({type}), {ms} мс",autocomplete_hint:"Ctrl+Пробел — подсказки",bargauge_name:"Prometheus: шкалы",bargauge_desc:"Горизонтальные шкалы как в Grafana, цвет по порогам, по одной на серию",table_name:"Prometheus: таблица",table_desc:"Мгновенный запрос в виде таблицы: метки — столбцы, сортировка",heatmap_name:"Prometheus: тепловая карта",heatmap_desc:"Тепловая карта бакетов гистограммы или множества серий во времени",alerts_name:"Prometheus: алерты",alerts_desc:"Список активных алертов Prometheus",display_mode:"Режим отображения",display_mode_gradient:"Градиент",display_mode_basic:"Простой",display_mode_lcd:"LCD (сегменты)",show_unfilled:"Показывать незаполненную часть",columns:"Столбцы (метки)",helper_columns:"Имена меток для показа; пусто = все метки",hide_columns:"Скрытые метки",value_column:"Заголовок столбца значения",sort_by:"Сортировать по",sort_by_value:"Значению",sort_by_label:"Первой метке",sort_dir:"Направление",sort_dir_desc:"По убыванию",sort_dir_asc:"По возрастанию",max_rows:"Максимум строк",color_cells:"Цвет ячеек значения по порогам",heatmap_mode:"Данные",heatmap_mode_histogram:"Бакеты гистограммы (метка le)",heatmap_mode_series:"Серии как строки",color_scheme:"Цветовая схема",scheme_oranges:"Оранжевая",scheme_spectral:"Спектральная",scheme_viridis:"Viridis",scheme_blues:"Синяя",scheme_greens:"Зелёная",scheme_reds:"Красная",scheme_purples:"Фиолетовая",log_scale:"Логарифмическая шкала цвета",show_legend_scale:"Показывать шкалу цвета",state_filter:"Состояния",state_firing:"Активные (firing)",state_pending:"Ожидающие (pending)",state_inactive:"Неактивные",severity_filter:"Severity (через запятую, пусто = все)",show_labels_alerts:"Показывать метки",show_annotations:"Показывать summary / description",no_alerts:"Активных алертов нет",active_since:"с {time}",unit_col:"Ед.",states:"Состояния",severities:"Severity (через запятую, пусто = все)",name_filter:"Фильтр по имени алерта (текст или regex)",section_panel:"Панель",section_query:"Запрос",card_height:"Высота панели (px)",helper_card_height:"Пусто = авто. Укажите одинаковое значение карточкам одного ряда, чтобы они были одной высоты",helper_query:"Один запрос на панель; он может вернуть много серий (у каждой свой цвет и строка легенды)",helper_height:"Высота графика, когда высота панели не задана",helper_bar_height:"Пусто = авто",helper_row_height:"Пусто = авто",helper_tile_height:"Пусто = авто",helper_min:"Пусто = авто; ось всегда начинается с подписанного значения",transparent_color:"Прозрачный",show_x_axis:"Подписи оси времени",show_y_axis:"Подписи оси значений",show_grid:"Линии сетки",threshold_style:"Показывать пороги",threshold_style_off:"Нет",threshold_style_line:"Линиями",threshold_style_area:"Заливкой областей",transparent_track:"Прозрачный фон незаполненной части",value_at_end:"Значение на конце столбца",gradient:"Градиент по порогам",counters:"Сырые счётчики бакетов",counters_auto:"Авто (в запросе нет rate/increase)",counters_yes:"Да, перевести в приращения",counters_no:"Нет, значения уже rate",helper_counters:"Бакеты гистограммы должны быть rate или increase, например sum by (le) (rate(x_bucket[5m])). Сырые счётчики _bucket переводятся автоматически",source:"Источник",source_all:"Все",source_prometheus:"Правила Prometheus",source_local:"PromQL-алерты Home Assistant",min_active:"Окно срабатывания (активен не менее)",helper_min_active:"например 5m, 1h: алерты, активные меньше, скрываются. Пусто = все",group_by_name:"Одна строка на имя алерта",variables_name:"Prometheus: переменные",variables_desc:"Выпадающие списки ($instance, $job…), подставляемые в запросы всех карточек",section_variables:"Переменные",helper_variables:'Используйте в запросах других карточек как $name или ${name}, для нескольких значений: label=~"$name". Значения — метка label_name из результата запроса (как label_values в Grafana) или фиксированный список',variable_n:"Переменная {n}",add_variable:"Добавить переменную",no_variables:"Добавьте переменную в редакторе карточки",var_all:"Все",label:"Подпись",label_name:"Метка со значениями",regex:"Regex-фильтр",values:"Фиксированные значения",default:"По умолчанию",multi:"Несколько значений",include_all:"Вариант «Все»",layout_row:"В строку",layout_column:"В столбец",create_alert:"Создать алерт",create_alert_title:"Новый PromQL-алерт",alert_name:"Имя алерта",alert_condition:"Условие",alert_threshold:"Порог",alert_for:"Длительность (for)",alert_severity:"Severity",alert_created:"Алерт «{name}» создан: {series} серий, сейчас срабатывает {active}",alert_admin_only:"Создавать алерты может только администратор",cancel:"Отмена",silence:"Заглушить",silenced:"Заглушён",silenced_until:"заглушён до {time}",silence_done:"Silence создан в Alertmanager"}};function Xe(e,t,s={}){const i=Je[function(e){return(e?.locale?.language||e?.language||("undefined"!=typeof localStorage?localStorage.getItem("selectedLanguage")?.replace(/"/g,""):null)||("undefined"!=typeof navigator?navigator.language:"en")||"en").split("-")[0].toLowerCase()}(t)]||Ze;let r=i[e]??Ze[e]??e;for(const[e,t]of Object.entries(s))r=r.replace(`{${e}}`,String(t));return r}function et(e){const t={...e};!t.title&&"string"==typeof t.name&&t.name.trim()&&(t.title=t.name),delete t.name;const s=Array.isArray(t.series)?t.series.filter(e=>e?.query?.trim()):[];return s.length&&(t.query?.trim()||(t.query=s[0].query,!t.legend_format&&s[0].name&&(t.legend_format=s[0].name),s[0].fill&&void 0===t.fill&&(t.fill=!0)),(s.length>1||e.query&&s.length)&&console.warn(`prometheus-cards: ${e.type}: only one query per panel is supported, extra queries ignored`)),delete t.series,t}class tt extends he{constructor(){super(...arguments),this._loading=!1,this._connected=!1,this._onVisibility=()=>{"hidden"===document.visibilityState?this._stopAutoRefresh():this._restart()},this._onVariables=e=>{const t=e.detail?.names||[];Qe(this._queryTemplate(),t)&&this._restart()}}setConfig(e){if(!e||!e.type)throw new Error("Invalid configuration");this._config=et(e),this._error=void 0,this.toggleAttribute("transparent",Boolean(e.transparent));const t=Number(this._config.card_height);this.style.height=t>0?`${t}px`:"",this.toggleAttribute("fixed-height",this._fixedHeight()),this._restart()}set hass(e){const t=!this._hass;this._hass=e,t&&this._restart()}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),this._connected=!0,document.addEventListener("visibilitychange",this._onVisibility),window.addEventListener(Le,this._onVariables),this._observeViewport(),this._restart()}disconnectedCallback(){super.disconnectedCallback(),this._connected=!1,document.removeEventListener("visibilitychange",this._onVisibility),window.removeEventListener(Le,this._onVariables),this._observer?.disconnect(),this._observer=void 0,this._stopAutoRefresh()}_observeViewport(){"undefined"==typeof IntersectionObserver||this._observer||(this._observer=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting),s=void 0===this._inViewport;t!==this._inViewport&&(this._inViewport=t,t&&!s?this._restart():t||this._stopAutoRefresh())},{rootMargin:"200px"}),this._observer.observe(this))}_queryTemplate(){return this._config?.query||""}_defaultColumns(){return 6}getGridOptions(){const e=Number(this._config?.card_height);return{columns:this._defaultColumns(),rows:e>0?(t=e,Math.max(1,Math.ceil((t+8)/64))):"auto",min_columns:3};var t}_fixedHeight(){const e=this._config;return Number(e?.card_height)>0||"number"==typeof e?.grid_options?.rows}get _title(){return(this._config?.title||"").trim()}renderHeader(e=Q){return this._title||e!==Q?U`<div class="card-header">
      <span class="card-title" title=${this._title}>${this._title}</span>${e}
    </div>`:Q}_hasQuery(){return Boolean(this._config?.query&&this._config.query.trim())}get _client(){const e=this._config.entry_id||void 0,t=this._isDemo();return this._cachedClient&&this._cachedClient.entryId===e&&this._cachedClient.demo===t||(this._cachedClient=new Ke(this._hass,e,t)),this._cachedClient}_isDemo(){return void 0===this._demo&&this._connected&&(this._demo=function(e){if(globalThis.__PROM_CARDS_DEMO__)return!0;let t=e;for(;t;){if(t.localName&&qe.has(t.localName))return!0;t=t.parentNode||t.host||null}return!1}(this)),Boolean(this._demo)}async _safeFetch(){if(this._hass&&this._config&&this._hasQuery())try{await this._fetchData()}catch(e){this._error=this._formatError(e),this._loading=!1}}_formatError(e){return e?"string"==typeof e?e:"unknown_command"===e.code?"Prometheus Dashboard integration is not installed or not loaded":e.message||e.code||"Error fetching data":"Error"}_restart(){this._hass&&this._config&&this._connected&&("undefined"!=typeof document&&"hidden"===document.visibilityState||(!1!==this._inViewport||this._isDemo())&&(this._startAutoRefresh(),this._safeFetch()))}_startAutoRefresh(){this._stopAutoRefresh();const e=Number(this._config.refresh_interval)||30;this._interval=window.setInterval(()=>this._safeFetch(),1e3*Math.max(5,e))}_stopAutoRefresh(){this._interval&&(clearInterval(this._interval),this._interval=void 0)}shouldUpdate(e){return Boolean(this._config)&&super.shouldUpdate(e)}getCardSize(){const e=Number(this._config?.card_height);return e>0?Math.ceil(e/50):3}renderError(){return U`<ha-card>${this.renderHeader()}<div class="error-state">${this._error}</div></ha-card>`}renderLoading(){return U`<ha-card>${this.renderHeader()}<div class="loading-state"></div></ha-card>`}renderPlaceholder(e="no_query"){return U`<ha-card>
      ${this.renderHeader()}
      <div class="placeholder-state">${Xe(e,this._hass)}</div>
    </ha-card>`}}function st(e,t){if(!Number.isFinite(e))return String(e);if(null==t||Number.isNaN(t)){const t=Math.abs(e),s=0===t?0:Math.min(6,Math.max(0,2-Math.floor(Math.log10(t))));return String(parseFloat(e.toFixed(s)))}return e.toFixed(Math.max(0,Math.min(10,t)))}tt.styles=Ye,e([_e()],tt.prototype,"_config",void 0),e([_e()],tt.prototype,"_error",void 0),e([_e()],tt.prototype,"_loading",void 0);const it=(e,t="",s="")=>({prefix:s,text:e,suffix:t});function rt(e,t,s=0,i=""){return(r,n)=>{if(0===r||!Number.isFinite(r))return it(st(r,n),t[s],i);let o=Math.floor(Math.log(Math.abs(r))/Math.log(e));return o=Math.max(-s,Math.min(t.length-1-s,o)),it(st(r/Math.pow(e,o),n),t[o+s],i)}}const nt=["p","n","µ","m","","k","M","G","T","P","E"];function ot(e,t=""){return rt(1e3,nt.map(t=>` ${t}${e}`),nt.indexOf(t))}function lt(e){return(t,s)=>it(st(t,s),e)}function at(e,t=0){return rt(1024,e.map(e=>` ${e}`),t)}function ct(e,t=0){return rt(1e3,e.map(e=>` ${e}`),t)}function ht(e){return rt(1e3,["","K","M","B","T"].map(t=>` ${t}${e}`))}function dt(e,t=!1){const s=rt(1e3,["","K","M","B","T"]);return(i,r)=>{const n=s(i,r);return t?it(n.text,`${n.suffix} ${e}`):it(n.text,n.suffix,e)}}const ut=[[" ns",1e-9],[" µs",1e-6],[" ms",.001],[" s",1],[" min",60],[" hour",3600],[" day",86400],[" week",604800],[" year",31536e3]];function pt(e){return(t,s)=>{const i=t*e,r=Math.abs(i);let n=ut.find(([,t])=>t===e)||ut[3];if(r>0){for(const e of ut)r>=e[1]&&(n=e);r<ut[0][1]&&(n=ut[0])}return it(st(i/n[1],s),n[0])}}const mt=[["y",31536e3],["w",604800],["d",86400],["h",3600],["m",60],["s",1]];function ft(e){return t=>{let s=Math.abs(t*e);const i=t<0?"-":"";if(s<1)return it(`${i}${Math.round(1e3*s)}ms`);const r=[];for(const[e,t]of mt){if(s>=t||r.length&&r.length<3){const i=Math.floor(s/t);s-=i*t,i>0&&r.push(`${i}${e}`)}if(r.length>=3)break}return it(i+(r.join(" ")||"0s"))}}function _t(e){return t=>{const s=Math.abs(t)<1e11?1e3*t:t,i=new Date(s);if(Number.isNaN(i.getTime()))return it(String(t));if("iso"===e)return it(i.toISOString());if("local"===e)return it(i.toLocaleString());const r=(s-Date.now())/1e3,n=new Intl.RelativeTimeFormat(void 0,{numeric:"auto"}),o=Math.abs(r),[l,a]=o<60?["second",1]:o<3600?["minute",60]:o<86400?["hour",3600]:o<2592e3?["day",86400]:o<31536e3?["month",2592e3]:["year",31536e3];return it(n.format(Math.round(r/a),l))}}function gt(e,t){return s=>it(s?e:t)}const vt=[["Misc",[["none","Number",(e,t)=>it(st(e,t))],["short","Short (K, M, B)",rt(1e3,[""," K"," Mil"," Bil"," Tri"])],["sci","Scientific notation",(e,t)=>it(e.toExponential(t??2))],["percent","Percent (0-100)",lt("%")],["percentunit","Percent (0.0-1.0)",(e,t)=>it(st(100*e,t),"%")],["humidity","Humidity (%H)",lt("%H")],["dB","Decibel",lt(" dB")],["ppm","Parts-per-million (ppm)",lt(" ppm")],["bool_yes_no","Yes / No",gt("Yes","No")],["bool_on_off","On / Off",gt("On","Off")],["bool","True / False",gt("True","False")]]],["Data",[["bytes","bytes (IEC)",at(["B","KiB","MiB","GiB","TiB","PiB","EiB"])],["decbytes","bytes (SI)",ct(["B","kB","MB","GB","TB","PB","EB"])],["bits","bits (IEC)",at(["b","Kib","Mib","Gib","Tib","Pib"])],["decbits","bits (SI)",ct(["b","kb","Mb","Gb","Tb","Pb"])],["kbytes","kibibytes",at(["B","KiB","MiB","GiB","TiB","PiB"],1)],["mbytes","mebibytes",at(["B","KiB","MiB","GiB","TiB","PiB"],2)],["gbytes","gibibytes",at(["B","KiB","MiB","GiB","TiB","PiB"],3)]]],["Data rate",[["binBps","bytes/sec (IEC)",at(["B/s","KiB/s","MiB/s","GiB/s","TiB/s"])],["Bps","bytes/sec (SI)",ct(["B/s","kB/s","MB/s","GB/s","TB/s"])],["binbps","bits/sec (IEC)",at(["b/s","Kib/s","Mib/s","Gib/s","Tib/s"])],["bps","bits/sec (SI)",ct(["b/s","kb/s","Mb/s","Gb/s","Tb/s"])],["KiBs","kibibytes/sec",at(["B/s","KiB/s","MiB/s","GiB/s","TiB/s"],1)],["MiBs","mebibytes/sec",at(["B/s","KiB/s","MiB/s","GiB/s","TiB/s"],2)],["pps","packets/sec",ct(["p/s","kp/s","Mp/s","Gp/s"])]]],["Throughput",[["ops","ops/sec (ops)",ht("ops")],["reqps","requests/sec (rps)",ht("req/s")],["rps","reads/sec (rps)",ht("rd/s")],["wps","writes/sec (wps)",ht("wr/s")],["iops","I/O ops/sec (iops)",ht("io/s")],["opm","ops/min (opm)",ht("ops/min")],["eps","events/sec",ht("evt/s")]]],["Time",[["ns","nanoseconds (ns)",pt(1e-9)],["µs","microseconds (µs)",pt(1e-6)],["ms","milliseconds (ms)",pt(.001)],["s","seconds (s)",pt(1)],["m","minutes (m)",pt(60)],["h","hours (h)",pt(3600)],["d","days (d)",pt(86400)],["dtdurations","duration (s)",ft(1)],["dtdurationms","duration (ms)",ft(.001)],["hertz","Hertz (1/s)",ot("Hz")]]],["Date & time",[["dateTimeAsLocal","Local date/time",_t("local")],["dateTimeAsIso","ISO 8601",_t("iso")],["dateTimeFromNow","From now",_t("fromNow")]]],["Energy",[["watt","Watt (W)",ot("W")],["kwatt","Kilowatt (kW)",ot("W","k")],["voltamp","Volt-ampere (VA)",ot("VA")],["watth","Watt-hour (Wh)",ot("Wh")],["kwatth","Kilowatt-hour (kWh)",ot("Wh","k")],["joule","Joule (J)",ot("J")],["volt","Volt (V)",ot("V")],["mvolt","Millivolt (mV)",ot("V","m")],["amp","Ampere (A)",ot("A")],["mamp","Milliampere (mA)",ot("A","m")],["ohm","Ohm (Ω)",ot("Ω")]]],["Temperature",[["celsius","Celsius (°C)",lt("°C")],["fahrenheit","Fahrenheit (°F)",lt("°F")],["kelvin","Kelvin (K)",lt(" K")]]],["Pressure",[["pressurembar","Millibars",ot("bar","m")],["pressurebar","Bars",ot("bar")],["pressurehpa","Hectopascals",lt(" hPa")],["pressurekpa","Kilopascals",lt(" kPa")],["pressurepsi","PSI",lt(" psi")]]],["Length & area",[["lengthmm","millimeter (mm)",ot("m","m")],["lengthm","meter (m)",ot("m")],["lengthkm","kilometer (km)",ot("m","k")],["areaM2","Square meters (m²)",lt(" m²")]]],["Mass & volume",[["massmg","milligram (mg)",ot("g","m")],["massg","gram (g)",ot("g")],["masskg","kilogram (kg)",ot("g","k")],["mlitre","millilitre (mL)",ot("L","m")],["litre","litre (L)",ot("L")],["m3","cubic meter (m³)",lt(" m³")]]],["Velocity & flow",[["velocityms","meters/second (m/s)",lt(" m/s")],["velocitykmh","kilometers/hour (km/h)",lt(" km/h")],["flowlpm","Litre/min (L/min)",lt(" L/min")],["flowcms","Cubic meter/sec (m³/s)",lt(" m³/s")]]],["Currency",[["currencyUSD","Dollars ($)",dt("$")],["currencyEUR","Euro (€)",dt("€")],["currencyRUB","Rubles (₽)",dt("₽",!0)]]]],bt=vt.flatMap(([e,t])=>t.map(([t,s,i])=>({id:t,label:s,category:e,fn:i}))),xt=new Map(bt.map(e=>[e.id,e])),yt={"%":"percent",B:"bytes",seconds:"s","bytes/s":"binBps"};function wt(e,t,s){if(null==e||Number.isNaN(e))return{prefix:"",text:"-",suffix:""};const i=function(e){if(e)return xt.get(e)||xt.get(yt[e])}(t);return i?i.fn(e,s):{prefix:"",text:st(e,s),suffix:t?` ${t}`:""}}function $t(e,t,s){const i=wt(e,s,t);return`${i.prefix}${i.text}${i.suffix}`}function kt(e,t,s){if(t&&t.trim())return t.replace(/\{\{\s*([\w.]+)\s*\}\}/g,(t,s)=>e[s]??"");const{__name__:i,...r}=e,n=Object.entries(r);if(!n.length)return s||i||"Value";const o=n.map(([e,t])=>`${e}="${t}"`).join(", ");return i?`${i}{${o}}`:`{${o}}`}function Mt(e,t,s){if(t&&t.trim())return kt(e,t);const i=Object.keys(e).filter(e=>"__name__"!==e);return 1===i.length?e[i[0]]:i.length>1?kt(e):e.__name__||"Value"}const At=["#7EB26D","#EAB839","#6ED0E0","#EF843C","#E24D42","#1F78C1","#BA43A9","#705DA0","#508642","#CCA300","#447EBC","#C15C17","#890F02","#0A437C","#6D1F62","#584477","#B7DBAB","#F4D598","#70DBED","#F9BA8F","#F29191","#82B5D8","#E5A8E2","#AEA2E0","#629E51","#E5AC0E","#64B0C8","#E0752D","#BF1B00","#0A50A1","#962D82","#614D93","#9AC48A","#F2C96D","#65C5DB","#F9934E","#EA6460","#5195CE","#D683CE","#806EB7"],St={green:"#73BF69",yellow:"#FADE2A",orange:"#FF9830",red:"#F2495C",blue:"#5794F2",purple:"#B877D9","dark-green":"#37872D","dark-red":"#C4162A",text:"var(--primary-text-color)"},Et={"green-yellow-red":["#73BF69","#A0D468","#FADE2A","#FFB357","#FF9830","#F2495C"],blues:["#C0D8FF","#8AB8FF","#5794F2","#3274D9","#1F60C4"],greens:["#C8F2C2","#96D98D","#73BF69","#56A64B","#37872D"],reds:["#FFA6B0","#FF7383","#F2495C","#E02F44","#C4162A"],purples:["#DEB6F2","#CA95E5","#B877D9","#A352CC","#8F3BB8"]};function Ct(e){if(e)return St[e]||e}function zt(e){return e.transparent?"transparent":Ct(e.color)}function Pt(e,t,s){if(!t||0===t.length)return s||At[0];const i=[...t].sort((e,t)=>t.value-e.value);for(const t of i)if(e>=t.value)return zt(t)||s||At[0];return zt(i[i.length-1])||s||At[0]}function Tt(e,t){return/^#[0-9a-f]{6}$/i.test(e)?e+Math.round(255*t).toString(16).padStart(2,"0"):e}function Dt(e,t=0,s=Date.now()){const i=function(e){const t=String(e).trim().match(/^(\d+)([smhdw])$/);return t?parseInt(t[1],10)*{s:1,m:60,h:3600,d:86400,w:604800}[t[2]]:NaN}(e);let r=Math.floor(s/1e3);t>1&&(r=Math.floor(r/t)*t);return{start:r-(Number.isFinite(i)?i:3600),end:r}}function Bt(e,t=500,s=Date.now()){const{start:i,end:r}=Dt(e,0,s),n=function(e,t,s=500){const i=Math.max(1,(t-e)/s);return[1,2,5,10,15,30,60,120,300,600,900,1800,3600,7200,10800,21600,43200,86400].find(e=>e>=i)??86400*Math.ceil(i/86400)}(i,r,t),{start:o,end:l}=Dt(e,n,s);return{start:o,end:l,step:`${n}s`}}function qt(e,t,s){const i=new Date(1e3*e),r=i.toLocaleTimeString(s,{hour:"2-digit",minute:"2-digit",hour12:!1});if(t<=86400)return r;const n=i.toLocaleDateString(s,{day:"2-digit",month:"2-digit"});return t>172800?n:`${n} ${r}`}const Lt=100;function Ht(e){if(void 0===e)return null;const t=parseFloat(e);return Number.isFinite(t)?t:null}function Ft(e,t,s){const i=e?.data;if(!i)return[];if("scalar"===i.resultType||"string"===i.resultType){const e=i.result||[];return[{metric:{},label:s||"Value",value:Ht(e[1])}]}return(i.result||[]).slice(0,Lt).map(e=>({metric:e.metric||{},label:kt(e.metric||{},t,s),value:Ht(e.value?.[1])}))}function Nt(e,t,s,i=100){return(e?.data?.result||[]).slice(0,i).map(e=>({metric:e.metric||{},label:kt(e.metric||{},t,s),points:(e.values||[]).map(([e,t])=>[Number(e),Ht(t)])}))}function Rt(e){for(let t=e.length-1;t>=0;t--)if(null!==e[t][1])return e[t][1];return null}function Ot(e,t){const s=e.filter(e=>null!==e);if(!s.length)return null;switch(t){case"sum":return s.reduce((e,t)=>e+t,0);case"avg":return s.reduce((e,t)=>e+t,0)/s.length;case"min":return Math.min(...s);case"max":return Math.max(...s);default:return s[0]}}function jt(e,t,s,i){return i?Ct(i):"single"===s?"var(--primary-color)":function(e,t,s="classic"){if("classic"===s||!Et[s])return At[e%At.length];const i=Et[s];if(t<=1)return i[Math.floor(i.length/2)];const r=e/(t-1)*(i.length-1);return i[Math.round(r)]}(e,t,s||"classic")}let It=0,Vt=class extends he{constructor(){super(...arguments),this.series=[],this.fill=!0,this.height=40,this.lineWidth=2,this._id="pspark-"+ ++It}render(){const e=this.series.flatMap(e=>e.values.filter(e=>null!==e));if(!e.length)return U``;let t=Math.min(...e),s=Math.max(...e);t===s&&(t-=1,s+=1);const i=s-t,r=this.lineWidth/2/this.height*100,n=this.series.map((e,s)=>{const n=e.values.length,o=[];e.values.forEach((e,s)=>{if(null===e)return;const l=n>1?s/(n-1)*100:50,a=r+(100-2*r)*(1-(e-t)/i);o.push(`${l.toFixed(2)},${a.toFixed(2)}`)});const l=`${this._id}-${s}`,a=this.fill&&1===this.series.length&&o.length>1,c=o[0]?.split(",")[0]??"0",h=o[o.length-1]?.split(",")[0]??"100";return W`
        ${a?W`
            <defs>
              <linearGradient id="${l}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${e.color}" stop-opacity="0.35"></stop>
                <stop offset="100%" stop-color="${e.color}" stop-opacity="0"></stop>
              </linearGradient>
            </defs>
            <polygon points="${c},100 ${o.join(" ")} ${h},100" fill="url(#${l})" stroke="none"></polygon>`:""}
        <polyline points="${o.join(" ")}" stroke="${e.color}" stroke-width="${this.lineWidth}"></polyline>
      `}),o=this.classList.contains("fill")?"height: 100%":`height: ${this.height}px`;return U`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style=${o}>${n}</svg>`}};Vt.styles=l`
    :host {
      display: block;
    }
    :host(.fill) {
      min-height: 24px;
    }
    svg {
      display: block;
      overflow: visible;
      width: 100%;
    }
    polyline {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
  `,e([fe({attribute:!1})],Vt.prototype,"series",void 0),e([fe({type:Boolean})],Vt.prototype,"fill",void 0),e([fe({type:Number})],Vt.prototype,"height",void 0),e([fe({type:Number,attribute:"line-width"})],Vt.prototype,"lineWidth",void 0),Vt=e([ue("prometheus-sparkline")],Vt);const Ut=l`
  .card-config {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .section-title {
    font-weight: 500;
    font-size: 15px;
    margin: 8px 0 -4px;
    color: var(--primary-text-color);
  }
  .helper {
    font-size: 12px;
    color: var(--secondary-text-color);
  }
`;function Wt(e,t,s,i){i=i||{},s=null==s?{}:s;const r=new CustomEvent(t,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed,detail:s});return e.dispatchEvent(r),r}function Gt(e,t){Wt(e,"config-changed",{config:t})}let Qt;function Kt(e){const t={};for(const[s,i]of Object.entries(e))null!=i&&""!==i&&("number"==typeof i&&Number.isNaN(i)||(t[s]=i));return t}const Yt={name:"entry_id",selector:{config_entry:{integration:"prometheus_dashboard"}}},Zt={name:"query",required:!0,selector:{text:{multiline:!0}}},Jt={name:"refresh_interval",selector:{number:{min:5,max:86400,step:1,mode:"box",unit_of_measurement:"s"}}},Xt={name:"transparent",selector:{boolean:{}}},es={name:"title",selector:{text:{}}},ts={name:"card_height",selector:{number:{min:60,max:2e3,step:1,mode:"box",unit_of_measurement:"px"}}},ss={name:"time_range",selector:{select:{mode:"dropdown",custom_value:!0,options:["15m","30m","1h","3h","6h","12h","24h","2d","7d","30d"]}}},is={name:"step",selector:{text:{}}};function rs(...e){return{title:"section_panel",schema:[es,{name:"",type:"grid",schema:[ts,Xt,...e]}]}}function ns(e={},...t){const s=[...!1===e.legend?[]:[cs],Jt,...t];return{title:"section_query",schema:[Yt,...!1===e.query?[]:[Zt],{name:"",type:"grid",schema:s}]}}function os(...e){return{title:"section_display",schema:[{name:"",type:"grid",schema:e}]}}const ls={name:"decimals",selector:{number:{min:0,max:6,step:1,mode:"box"}}},as={name:"unit",selector:{select:{mode:"dropdown",custom_value:!0,options:bt.map(e=>({value:e.id,label:`${e.category} › ${e.label}`}))}}},cs={name:"legend_format",selector:{text:{}}};function hs(e){return{name:"palette",selector:{select:{mode:"dropdown",options:["classic","green-yellow-red","blues","greens","reds","purples","single"].map(t=>({value:t,label:Xe(`palette_${t}`,e)}))}}}}function ds(e){return{name:"color_mode",selector:{select:{mode:"dropdown",options:["thresholds","series"].map(t=>({value:t,label:Xe(`color_mode_${t}`,e)}))}}}}const us=["gt","gte","lt","lte","eq","ne","any"],ps={gt:">",gte:"≥",lt:"<",lte:"≤",eq:"=",ne:"≠",any:"∃"},ms=["critical","warning","info"];function fs(e){const t=[...e?.thresholds||[]].filter(e=>"number"==typeof e.value&&Number.isFinite(e.value)).sort((e,t)=>e.value-t.value),s=t.length>1?t[1].value:t[0]?.value;return{name:e?.title||e?.name||"",condition:void 0===s?"any":"gt",threshold:s,for:"5m",severity:"warning"}}function _s(e){return!1!==e?.user?.is_admin}const gs=["abs","absent","absent_over_time","avg_over_time","ceil","changes","clamp","clamp_max","clamp_min","count_over_time","day_of_month","day_of_week","delta","deriv","exp","floor","histogram_quantile","holt_winters","hour","idelta","increase","irate","label_join","label_replace","last_over_time","ln","log2","log10","max_over_time","min_over_time","minute","month","predict_linear","quantile_over_time","rate","resets","round","scalar","sort","sort_desc","sqrt","stddev_over_time","sum_over_time","time","timestamp","vector","year"],vs=["sum","avg","min","max","count","count_values","group","stddev","stdvar","topk","bottomk","quantile"],bs=["by","without","on","ignoring","group_left","group_right","offset","bool","and","or","unless"];function xs(e,t){const s=e.slice(0,t).match(/([a-zA-Z_:][a-zA-Z0-9_:]*)\s*$/);if(!s)return;const i=s[1];return vs.includes(i)||gs.includes(i)||bs.includes(i)?void 0:i}function ys(e,t,s=50){const i=e.toLowerCase(),r=[],n=[];for(const e of t){const t=e.value.toLowerCase();!i||t.startsWith(i)?r.push(e):i.length>=2&&t.includes(i)&&n.push(e)}return[...r,...n].filter(t=>t.value!==e).slice(0,s)}const ws=new Map;function $s(e,t){const s=ws.get(e);if(s&&Date.now()-s.at<3e5)return s.value;const i=t().catch(t=>{throw ws.delete(e),t});return ws.set(e,{at:Date.now(),value:i}),i}const ks=[...vs.map(e=>({value:e,kind:"aggregation"})),...gs.map(e=>({value:e,kind:"function"})),...bs.map(e=>({value:e,kind:"keyword"}))];async function Ms(e,t,s){try{if("metric"===s.kind){if(!s.prefix)return[];const i=await async function(e,t){const s=new Ke(e,t),[i,r]=await Promise.all([$s(`${t}|names`,()=>s.getLabelValues("__name__")),$s(`${t}|meta`,()=>s.getMetadata().catch(()=>({})))]);return i.map(e=>{const t=r[e]?.[0];return{value:e,kind:"metric",detail:t?`${t.type} · ${t.help}`:void 0}})}(e,t).catch(()=>[]);return ys(s.prefix,[...ks,...i],40)}if("label"===s.kind){const i=await async function(e,t,s){const i=new Ke(e,t);if(s){const e=await $s(`${t}|series|${s}`,()=>i.getSeries([s])),r=new Set;for(const t of e.slice(0,2e3))Object.keys(t).forEach(e=>"__name__"!==e&&r.add(e));if(r.size)return[...r].sort()}return(await $s(`${t}|labels`,()=>i.getLabels())).filter(e=>"__name__"!==e)}(e,t,s.metric);return ys(s.prefix,i.map(e=>({value:e,kind:"label"})),40)}const i=await async function(e,t,s,i){const r=new Ke(e,t);if(i){const e=await $s(`${t}|series|${i}`,()=>r.getSeries([i])),n=new Set;for(const t of e.slice(0,5e3))void 0!==t[s]&&n.add(t[s]);if(n.size)return[...n].sort()}return $s(`${t}|values|${s}`,()=>r.getLabelValues(s))}(e,t,s.label,s.metric);return ys(s.prefix,i.map(e=>({value:e,kind:"value"})),40)}catch{return"metric"===s.kind?ys(s.prefix,ks,40):[]}}const As=l`
  :host {
    display: block;
    position: relative;
  }
  .label {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin: 0 0 4px 2px;
  }
  textarea {
    width: 100%;
    box-sizing: border-box;
    min-height: 56px;
    resize: vertical;
    padding: 10px 12px;
    font-family: var(--code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
    font-size: 13px;
    line-height: 1.45;
    color: var(--primary-text-color);
    background: var(--mdc-text-field-fill-color, var(--secondary-background-color));
    border: none;
    border-bottom: 1px solid var(--secondary-text-color);
    border-radius: 4px 4px 0 0;
    outline: none;
  }
  textarea:focus {
    border-bottom: 2px solid var(--primary-color);
  }
  .popup {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
    max-height: 240px;
    overflow-y: auto;
    background: var(--card-background-color, #fff);
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    padding: 4px 0;
  }
  .item {
    display: flex;
    gap: 8px;
    align-items: baseline;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
  }
  .item.active,
  .item:hover {
    background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  }
  .item .value {
    font-family: var(--code-font-family, ui-monospace, monospace);
    color: var(--primary-text-color);
  }
  .item .kind {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    min-width: 42px;
  }
  .item .detail {
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    flex-wrap: wrap;
  }
  .test-btn {
    border: 1px solid var(--divider-color);
    background: none;
    color: var(--primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 12px;
    cursor: pointer;
  }
  .test-btn[disabled] {
    opacity: 0.5;
    cursor: default;
  }
  .hint {
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .result {
    margin-top: 6px;
    font-size: 12px;
    border-radius: 6px;
    padding: 8px 10px;
    background: var(--secondary-background-color);
    word-break: break-word;
  }
  .result.ok {
    border-left: 3px solid var(--success-color, #43a047);
  }
  .result.err {
    border-left: 3px solid var(--error-color, #db4437);
    color: var(--error-color, #db4437);
  }
  .result code {
    font-family: var(--code-font-family, ui-monospace, monospace);
    font-size: 11px;
  }
  .result ul {
    margin: 4px 0 0;
    padding-left: 16px;
  }
  .test-btn.secondary {
    color: var(--secondary-text-color);
  }
  .alert-form {
    margin-top: 8px;
    padding: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px;
  }
  .alert-form .alert-title,
  .alert-form .wide,
  .alert-form .alert-actions {
    grid-column: 1 / -1;
  }
  .alert-title {
    font-weight: 500;
    font-size: 13px;
  }
  .alert-form label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .alert-form input,
  .alert-form select {
    font: inherit;
    font-size: 13px;
    color: var(--primary-text-color);
    background: var(--mdc-text-field-fill-color, var(--secondary-background-color));
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 5px 6px;
    min-width: 0;
  }
  .alert-actions {
    display: flex;
    gap: 8px;
  }
`;let Ss=class extends he{constructor(){super(...arguments),this.value="",this.label="",this.mode="instant",this._items=[],this._active=0,this._testing=!1,this.alerts=!0,this._creating=!1,this._seq=0}_emit(e){this.value=e,Wt(this,"value-changed",{value:e})}_onInput(){this._emit(this._input.value),this._test=void 0,this._schedule()}_schedule(){clearTimeout(this._timer),this._timer=window.setTimeout(()=>this._complete(),150)}async _complete(){if(!this.hass||!this._input)return;const e=function(e,t){const s=e.slice(0,t),i=s.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*(=~|!~|=|!=)\s*"([^"]*)$/);if(i){const r=s.lastIndexOf("{");return{kind:"label_value",label:i[1],prefix:i[3],from:t-i[3].length,metric:r>=0?xs(e,r):void 0}}const r=s.lastIndexOf("{"),n=s.lastIndexOf("}"),o=s.match(/\b(by|without|on|ignoring|group_left|group_right)\s*\(([^()]*)$/),l=r>n;if(l||o){const i=s.match(/([a-zA-Z_][a-zA-Z0-9_]*)$/),n=i?i[1]:"",o=s.slice(0,t-n.length).trimEnd();return o.endsWith("{")||o.endsWith(",")||o.endsWith("(")?{kind:"label",prefix:n,from:t-n.length,metric:l?xs(e,r):void 0}:{kind:"none"}}const a=s.match(/([a-zA-Z_:][a-zA-Z0-9_:]*)$/);if(a)return"["===s[t-a[1].length-1]||/[0-9]/.test(a[1][0])?{kind:"none"}:{kind:"metric",prefix:a[1],from:t-a[1].length};return{kind:"none"}}(this._input.value,this._input.selectionStart??this._input.value.length);if("none"===e.kind)return void this._close();const t=++this._seq,s=await Ms(this.hass,this.entryId,e);t===this._seq&&(this._ctx=e,this._items=s,this._active=0)}_close(){this._items=[],this._ctx=void 0}_pick(e){if(!this._ctx)return;const t=this._input.selectionStart??this._input.value.length,s=function(e,t,s,i){let r=i.value,n=e.slice(t);const o=n.match(/^[a-zA-Z0-9_:]*/);if(o&&"label_value"!==s.kind&&(n=n.slice(o[0].length)),"label_value"===s.kind){const e=n.match(/^[^"},]*/);e&&(n=n.slice(e[0].length)),n.startsWith('"')||(r+='"')}else"function"===i.kind||"aggregation"===i.kind?r+="(":"label"!==s.kind||/^\s*(=|!=|=~|!~)/.test(n)||/\b(by|without|on|ignoring|group_left|group_right)\s*\([^()]*$/.test(e.slice(0,s.from))||(r+='="');return{text:e.slice(0,s.from)+r+n,cursor:s.from+r.length+("label_value"!==s.kind||r.endsWith('"')?0:1)}}(this._input.value,t,this._ctx,e);this._input.value=s.text,this._input.setSelectionRange(s.cursor,s.cursor),this._emit(s.text),this._close(),this._input.focus(),this._schedule()}_onKeyDown(e){if(e.stopPropagation()," "===e.key&&e.ctrlKey)return e.preventDefault(),void this._complete();if(this._items.length)if("ArrowDown"===e.key||"ArrowUp"===e.key){e.preventDefault();const t="ArrowDown"===e.key?1:-1;this._active=(this._active+t+this._items.length)%this._items.length,this.updateComplete.then(()=>this.shadowRoot?.querySelector(".item.active")?.scrollIntoView({block:"nearest"}))}else"Enter"===e.key||"Tab"===e.key?(e.preventDefault(),this._pick(this._items[this._active])):"Escape"===e.key&&this._close()}async _runTest(){this.hass&&this.value?.trim()&&(this._testing=!0,this._test=await async function(e,t,s,i){const r=new Ke(e,t),n=performance.now();try{const t=Math.floor(Date.now()/1e3),o="range"===i?await r.rangeQuery(s,t-3600,t,"60s"):await r.instantQuery(s),l=Math.round(performance.now()-n),a=o.data;if("scalar"===a?.resultType){const t=a.result[1];return{ok:!0,text:Xe("test_ok",e,{n:1,ms:l,type:"scalar"}),samples:[`scalar = ${t}`]}}const c=Array.isArray(a?.result)?a.result:[],h=c.slice(0,5).map(e=>{const t=e.value?e.value[1]:e.values?.[e.values.length-1]?.[1];return`${kt(e.metric||{})} = ${t??"-"}`});return{ok:!0,text:Xe("test_ok",e,{n:c.length,ms:l,type:a?.resultType||"?"}),samples:h}}catch(e){return{ok:!1,text:e?.message||e?.code||String(e)}}}(this.hass,this.entryId,this.value,this.mode),this._testing=!1)}_openAlert(){this._alert=this._alert?void 0:{...this.alertDefaults||fs(void 0)},this._alertResult=void 0}_alertField(e,t){const s=t.target.value,i="threshold"===e?""===s?void 0:Number(s):s;this._alert={...this._alert,[e]:i}}async _createAlert(){const e=this._alert;if(this.hass&&e&&e.name.trim()&&this.value?.trim()){this._creating=!0;try{const t=await new Ke(this.hass,this.entryId,!1,!1).createAlert({name:e.name.trim(),query:this.value.trim(),condition:e.condition,..."any"!==e.condition&&void 0!==e.threshold?{threshold:e.threshold}:{},...e.for?{for:e.for}:{},severity:e.severity});this._alertResult={ok:!0,text:Xe("alert_created",this.hass,{name:e.name.trim(),series:t.series,active:t.active})},this._alert=void 0}catch(e){const t="unauthorized"===e?.code?Xe("alert_admin_only",this.hass):e?.message||e?.code||String(e);this._alertResult={ok:!1,text:t}}this._creating=!1}}_renderAlertForm(){const e=this._alert;if(!e)return Q;const t=e=>Xe(e,this.hass);return U`<div class="alert-form" @keydown=${e=>e.stopPropagation()}>
      <div class="alert-title">${t("create_alert_title")}</div>
      <label class="wide">${t("alert_name")}
        <input .value=${e.name} @input=${e=>this._alertField("name",e)} />
      </label>
      <label>${t("alert_condition")}
        <select @change=${e=>this._alertField("condition",e)}>
          ${us.map(t=>U`<option value=${t} ?selected=${e.condition===t}>${ps[t]}</option>`)}
        </select>
      </label>
      <label>${t("alert_threshold")}
        <input type="number" step="any" .value=${void 0===e.threshold?"":String(e.threshold)}
          ?disabled=${"any"===e.condition} @input=${e=>this._alertField("threshold",e)} />
      </label>
      <label>${t("alert_for")}
        <input .value=${e.for} placeholder="5m" @input=${e=>this._alertField("for",e)} />
      </label>
      <label>${t("alert_severity")}
        <select @change=${e=>this._alertField("severity",e)}>
          ${ms.map(t=>U`<option value=${t} ?selected=${e.severity===t}>${t}</option>`)}
        </select>
      </label>
      <div class="alert-actions">
        <button class="test-btn" ?disabled=${this._creating||!e.name.trim()} @click=${this._createAlert}>
          ${t("create_alert")}
        </button>
        <button class="test-btn secondary" @click=${this._openAlert}>${t("cancel")}</button>
      </div>
    </div>`}_renderPopup(){if(!this._items.length)return Q;return U`<div class="popup" @mousedown=${e=>e.preventDefault()}>
      ${this._items.map((e,t)=>U`<div class="item ${t===this._active?"active":""}" @click=${()=>this._pick(e)}>
          <span class="kind">${(e=>"aggregation"===e?"agg":"function"===e?"fn":e)(e.kind)}</span>
          <span class="value">${e.value}</span>
          ${e.detail?U`<span class="detail" title=${e.detail}>${e.detail}</span>`:Q}
        </div>`)}
    </div>`}render(){const e=this._test;return U`
      ${this.label?U`<div class="label">${this.label}</div>`:Q}
      <textarea
        spellcheck="false"
        .value=${this.value||""}
        placeholder="rate(node_network_receive_bytes_total[5m])"
        @input=${this._onInput}
        @keydown=${this._onKeyDown}
        @click=${this._schedule}
        @blur=${()=>setTimeout(()=>this._close(),150)}
      ></textarea>
      ${this._renderPopup()}
      <div class="toolbar">
        <button class="test-btn" ?disabled=${this._testing||!this.value?.trim()} @click=${this._runTest}>
          ${this._testing?Xe("testing",this.hass):Xe("test_query",this.hass)}
        </button>
        ${this.alerts&&_s(this.hass)?U`<button class="test-btn" ?disabled=${!this.value?.trim()} @click=${this._openAlert}>
              ${Xe("create_alert",this.hass)}
            </button>`:Q}
        <span class="hint">${Xe("autocomplete_hint",this.hass)}</span>
      </div>
      ${e?U`<div class="result ${e.ok?"ok":"err"}">
            ${e.text}
            ${e.samples?.length?U`<ul>${e.samples.map(e=>U`<li><code>${e}</code></li>`)}</ul>`:Q}
          </div>`:Q}
      ${this._renderAlertForm()}
      ${this._alertResult?U`<div class="result ${this._alertResult.ok?"ok":"err"}">${this._alertResult.text}</div>`:Q}
    `}};Ss.styles=As,e([fe({attribute:!1})],Ss.prototype,"hass",void 0),e([fe()],Ss.prototype,"value",void 0),e([fe()],Ss.prototype,"label",void 0),e([fe({attribute:!1})],Ss.prototype,"entryId",void 0),e([fe()],Ss.prototype,"mode",void 0),e([_e()],Ss.prototype,"_items",void 0),e([_e()],Ss.prototype,"_active",void 0),e([_e()],Ss.prototype,"_test",void 0),e([_e()],Ss.prototype,"_testing",void 0),e([fe({type:Boolean})],Ss.prototype,"alerts",void 0),e([fe({attribute:!1})],Ss.prototype,"alertDefaults",void 0),e([_e()],Ss.prototype,"_alert",void 0),e([_e()],Ss.prototype,"_alertResult",void 0),e([_e()],Ss.prototype,"_creating",void 0),e([ge("textarea")],Ss.prototype,"_input",void 0),Ss=e([ue("prometheus-query-editor")],Ss);const Es="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";let Cs=class extends he{constructor(){super(...arguments),this.items=[],this.schema=[],this.newItem=()=>({}),this.itemTitle="",this.addLabel="",this.queryMode="instant",this.queryAlerts=!0,this._computeLabel=e=>Xe(e.name,this.hass)}get _hasQuery(){return this.schema.some(e=>"query"===e.name&&!e.schema)}get _formSchema(){return this.schema.filter(e=>!("query"===e.name&&!e.schema))}_emit(e){Wt(this,"value-changed",{value:e})}_itemChanged(e,t){t.stopPropagation();const s=[...this.items],i={...s[e],...t.detail.value};for(const e of this._fieldNames(this._formSchema))e in t.detail.value||delete i[e];for(const e of Object.keys(i))""!==i[e]&&void 0!==i[e]||delete i[e];s[e]=i,this._emit(s)}_fieldNames(e){return e.flatMap(e=>e.schema?this._fieldNames(e.schema):[e.name])}_remove(e){const t=[...this.items];t.splice(e,1),this._emit(t)}_add(){this._emit([...this.items,this.newItem()])}render(){return U`
      ${this.items.map((e,t)=>U`
          <div class="item">
            <div class="item-header">
              <span>${this.itemTitle?this.itemTitle.replace("{n}",String(t+1)):Q}</span>
              <ha-icon-button
                .label=${Xe("remove",this.hass)}
                .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                @click=${()=>this._remove(t)}
              ></ha-icon-button>
            </div>
            ${this._hasQuery?U`<prometheus-query-editor
                  .hass=${this.hass}
                  .label=${Xe("query",this.hass)}
                  .value=${e.query||""}
                  .entryId=${this.entryId}
                  .mode=${this.queryMode}
                  .alerts=${this.queryAlerts}
                  @value-changed=${e=>{e.stopPropagation();const s=[...this.items];s[t]={...s[t],query:e.detail.value},this._emit(s)}}
                ></prometheus-query-editor>`:Q}
            <ha-form
              .hass=${this.hass}
              .data=${e}
              .schema=${this._formSchema}
              .computeLabel=${this._computeLabel}
              @value-changed=${e=>this._itemChanged(t,e)}
            ></ha-form>
          </div>
        `)}
      <ha-button class="add" @click=${this._add}>
        <ha-svg-icon slot="start" .path=${Es}></ha-svg-icon>
        <ha-svg-icon slot="icon" .path=${Es}></ha-svg-icon>
        ${this.addLabel}
      </ha-button>
    `}};Cs.styles=l`
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .item {
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 4px 12px 12px;
    }
    .item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .add {
      align-self: flex-start;
    }
  `,e([fe({attribute:!1})],Cs.prototype,"hass",void 0),e([fe({attribute:!1})],Cs.prototype,"items",void 0),e([fe({attribute:!1})],Cs.prototype,"schema",void 0),e([fe({attribute:!1})],Cs.prototype,"newItem",void 0),e([fe()],Cs.prototype,"itemTitle",void 0),e([fe()],Cs.prototype,"addLabel",void 0),e([fe({attribute:!1})],Cs.prototype,"entryId",void 0),e([fe()],Cs.prototype,"queryMode",void 0),e([fe({type:Boolean})],Cs.prototype,"queryAlerts",void 0),Cs=e([ue("prometheus-list-editor")],Cs);const zs=[{name:"",type:"grid",schema:[{name:"value",required:!0,selector:{number:{mode:"box",step:"any"}}},{name:"color",selector:{text:{type:"color"}}},{name:"transparent_color",selector:{boolean:{}}}]}];class Ps extends he{constructor(){super(...arguments),this._ready=!1,this._computeLabel=e=>Xe(e.name,this.hass),this._computeHelper=e=>{const t=`helper_${e.name}`,s=Xe(t,this.hass);return s===t?void 0:s}}setConfig(e){this._config=et(e)}connectedCallback(){super.connectedCallback(),(customElements.get("ha-form")&&customElements.get("ha-selector")?Promise.resolve():(Qt||(Qt=(async()=>{try{const e=await(window.loadCardHelpers?.());if(!e)return;const t=await e.createCardElement({type:"entities",entities:[]});await(t?.constructor?.getConfigElement?.())}catch(e){console.warn("prometheus-cards: failed to preload HA form components",e)}})()),Qt)).then(()=>{this._ready=!0})}_defaults(){return{}}_renderExtra(){return Q}_hasThresholds(){return!0}_renderThresholds(){const e=this._config;return U`
      <div class="section-title">${Xe("section_thresholds",this.hass)}</div>
      <div class="helper">${Xe("helper_thresholds",this.hass)}</div>
      <prometheus-list-editor
        .hass=${this.hass}
        .items=${((e=[])=>e.map(({transparent:e,...t})=>e?{...t,transparent_color:!0}:t))(e.thresholds)}
        .schema=${zs}
        .newItem=${()=>({value:0,color:"#73BF69"})}
        .addLabel=${Xe("add_threshold",this.hass)}
        @value-changed=${e=>{e.stopPropagation();const t=(e=>e.map(({transparent_color:e,...t})=>e?{...t,transparent:!0}:t))(e.detail.value);this._updateConfig({thresholds:t.length?t:void 0})}}
      ></prometheus-list-editor>
    `}_updateConfig(e){this._config&&(this._config=Kt({...this._config,...e}),Gt(this,this._config))}_formChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value,s=Kt({...this._config,...t}),i=e.target,r=i?.schema?this._fieldNames(i.schema):[];for(const e of r)e in t&&""!==t[e]&&void 0!==t[e]||delete s[e];const n=this._defaults();for(const[e,t]of Object.entries(n))e in this._config||s[e]!==t||delete s[e];s.type=this._config.type,this._config=s,Gt(this,this._config)}_fieldNames(e){const t=[];for(const s of e)s.schema?t.push(...this._fieldNames(s.schema)):t.push(s.name);return t}_renderSchema(e,t){const s=[];let i=[];const r=()=>{if(!i.length)return;const e=i;i=[],s.push(U`<ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${e}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>`)};for(const t of e)"query"!==t.name||t.schema?i.push(t):(r(),s.push(U`<prometheus-query-editor
          .hass=${this.hass}
          .label=${Xe("query",this.hass)}
          .value=${this._config?.query||""}
          .entryId=${this._config?.entry_id||void 0}
          .mode=${this._queryMode()}
          .alerts=${this._canCreateAlert()}
          .alertDefaults=${fs(this._config)}
          @value-changed=${e=>{e.stopPropagation(),this._updateConfig({query:e.detail.value})}}
        ></prometheus-query-editor>`));return r(),U`${s}`}_canCreateAlert(){return!0}_queryMode(){return"instant"}render(){if(!this.hass||!this._config||!this._ready)return U``;const e={...this._defaults(),...this._config};return U`
      <div class="card-config">
        ${this._sections().map(t=>U`
            ${t.title?U`<div class="section-title">${Xe(t.title,this.hass)}</div>`:Q}
            ${this._renderSchema(t.schema,e)}
          `)}
        ${this._renderExtra()}
        ${this._hasThresholds()?this._renderThresholds():Q}
      </div>
    `}}Ps.styles=Ut,e([fe({attribute:!1})],Ps.prototype,"hass",void 0),e([_e()],Ps.prototype,"_config",void 0),e([_e()],Ps.prototype,"_ready",void 0);let Ts=class extends Ps{_queryMode(){return this._config?.sparkline?"range":"instant"}_defaults(){return{refresh_interval:30,sparkline:!1,sparkline_hours:24,line_width:2,sparkline_fill:!0,reduce:"none",layout:"default",tile_style:"gradient",palette:"classic",color_mode:"thresholds"}}_options(e,t){return t.map(t=>({value:t,label:Xe(`${e}${t}`,this.hass)}))}_sections(){const e=this._config,t="tiles"===e?.layout,s=e?.sparkline?[{name:"line_width",selector:{number:{min:1,max:10,step:.5,mode:"slider",unit_of_measurement:"px"}}},{name:"sparkline_fill",selector:{boolean:{}}}]:[],i=this._options("reduce_",["none","sum","avg","min","max"]);return[rs(...t?[]:[{name:"icon",selector:{icon:{}}}]),ns({},{name:"reduce",selector:{select:{mode:"dropdown",options:i}}},{name:"sparkline",selector:{boolean:{}}},...e?.sparkline?[{name:"sparkline_hours",selector:{number:{min:1,max:720,mode:"box",unit_of_measurement:"h"}}}]:[]),os(as,ls,{name:"layout",selector:{select:{mode:"dropdown",options:this._options("layout_",["default","tiles"])}}},...t?[{name:"tile_style",selector:{select:{mode:"dropdown",options:this._options("tile_style_",["gradient","solid"])}}},{name:"tile_height",selector:{number:{min:40,max:600,mode:"box",unit_of_measurement:"px"}}},{name:"tile_min_width",selector:{number:{min:60,max:600,mode:"box",unit_of_measurement:"px"}}}]:[],ds(this.hass),hs(this.hass),...s)]}};Ts=e([ue("prometheus-stat-card-editor")],Ts);const Ds=l`
  .stat-container {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
  }
  .icon-container {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    opacity: 1;
    background-color: color-mix(in srgb, var(--icon-color, var(--primary-color)) 20%, transparent);
    color: var(--icon-color, var(--primary-color));
  }
  .value-container {
    display: flex;
    align-items: baseline;
    gap: 2px;
  }
  /* fixed-height panel without sparkline: value centred vertically */
  .stat-container.fill {
    flex: 1 1 auto;
  }
  .value {
    font-size: 36px;
    font-weight: 400;
    line-height: 1.2;
    color: var(--value-color, var(--primary-text-color));
  }
  .unit {
    font-size: 16px;
    color: var(--secondary-text-color);
  }
  .rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }
  .row .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .row .label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--secondary-text-color);
  }
  .row .row-value {
    font-weight: 500;
    font-size: 18px;
    white-space: nowrap;
  }
  .row .row-value .unit {
    font-size: 13px;
  }

  /* ---- tiles layout (Grafana "background gradient") ---- */
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--tile-min, 140px), 1fr));
    gap: 8px;
  }
  /* auto tile height: fill the panel rows equally */
  .tiles.auto.fill {
    grid-auto-rows: 1fr;
  }
  .tile {
    position: relative;
    overflow: hidden;
    border-radius: calc(var(--ha-card-border-radius, 12px) - 4px);
    min-height: var(--tile-height, 90px);
    padding: 10px 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: #fff;
    background: var(--tile-bg);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  }
  .tile .tile-label {
    font-size: 13px;
    font-weight: 500;
    opacity: 0.9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    z-index: 1;
  }
  .tile .tile-value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    font-size: var(--tile-font, 32px);
    font-weight: 500;
    line-height: 1.1;
    position: relative;
    z-index: 1;
    white-space: nowrap;
  }
  .tile .tile-value .unit {
    color: inherit;
    opacity: 0.85;
    font-size: 0.55em;
  }
  .tile prometheus-sparkline {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.9;
  }
`;let Bs=class extends tt{constructor(){super(...arguments),this._items=[],this._loaded=!1}static get styles(){return[Ye,Ds]}static getStubConfig(){return{type:"custom:prometheus-stat-card",title:"Targets up",query:"sum(up)",icon:"mdi:server-network",decimals:0,sparkline:!0}}static getConfigElement(){return document.createElement("prometheus-stat-card-editor")}async _fetchData(){const e=this._config;try{if(this._loading=!0,e.sparkline){const{start:t,end:s,step:i}=Bt(`${e.sparkline_hours||24}h`,120),r=await this._client.rangeQuery(e.query,t,s,i);this._items=Nt(r,e.legend_format).map(t=>({label:Mt(t.metric,e.legend_format),value:Rt(t.points),history:t.points.map(e=>e[1])}))}else{const t=await this._client.instantQuery(e.query);this._items=Ft(t,e.legend_format).map(t=>({...t,label:Mt(t.metric,e.legend_format),history:[]}))}this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}_displayItems(){const e=this._config.reduce||"none";if("none"===e||this._items.length<=1)return this._items;const t=Math.max(...this._items.map(e=>e.history.length)),s=[];for(let i=0;i<t;i++)s.push(Ot(this._items.map(e=>e.history[i]??null),e));const i=Ot(this._items.map(e=>e.value),e);return[{label:this._title,value:i,history:s}]}_color(e,t,s){const i=this._config;if("series"!==i.color_mode&&(i.thresholds?.length||1===s)){const r=s>1?jt(t,s,i.palette):void 0;return Pt(e.value??0,i.thresholds||[],r)}return jt(t,s,i.palette)}_renderValue(e,t="value"){const s=wt(e,this._config.unit,this._config.decimals),i=s.suffix.trim();return U`<span class=${t}>${s.prefix}${s.text}</span>${i?U`<span class="unit">${i}</span>`:Q}`}_renderRows(e){return U`<div class="rows">
      ${e.map((t,s)=>U`<div class="row">
          <span class="dot" style="background: ${this._color(t,s,e.length)}"></span>
          <span class="label" title=${t.label}>${t.label}</span>
          <span class="row-value">${this._renderValue(t.value,"")}</span>
        </div>`)}
    </div>`}_tileBackground(e){return"solid"===this._config.tile_style?e:`linear-gradient(120deg, color-mix(in srgb, ${e} 70%, white) 0%, ${e} 45%, color-mix(in srgb, ${e} 75%, black) 100%)`}_renderTiles(e){const t=this._config,s=e.length?e:[{label:"",value:null,history:[]}],i=s.length>1,r=[`--tile-min: ${t.tile_min_width||(i?140:200)}px`,t.tile_height?`--tile-height: ${t.tile_height}px`:"",`--tile-font: ${i?28:40}px`].filter(Boolean).join(";"),n=t.tile_height?Math.round(.4*t.tile_height):40;return U`
      <ha-card>
        ${this.renderHeader()}
        <div class="tiles ${t.tile_height?"":"auto"} ${this._fixedHeight()?"fill":""}" style=${r}>
          ${s.map((e,r)=>{const o=this._color(e,r,s.length),l=i?e.label:this._title?"":e.label;return U`
              <div class="tile" style="--tile-bg: ${this._tileBackground(o)}">
                ${l?U`<div class="tile-label" title=${l}>${l}</div>`:Q}
                <div class="tile-value">${this._renderValue(e.value,"")}</div>
                ${t.sparkline&&e.history.length>1?U`<prometheus-sparkline
                      .series=${[{values:e.history,color:"rgba(255,255,255,0.85)"}]}
                      .fill=${!1!==t.sparkline_fill}
                      .lineWidth=${t.line_width??2}
                      .height=${n}
                    ></prometheus-sparkline>`:Q}
              </div>
            `})}
        </div>
      </ha-card>
    `}render(){const e=this._config;if(!this._hasQuery())return this.renderPlaceholder();if(this._error)return this.renderError();if(!this._loaded)return this.renderLoading();const t=this._displayItems();if("tiles"===e.layout)return this._renderTiles(t);const s=t.length<=1,i=t[0]||{label:"",value:null,history:[]},r=this._color(i,0,t.length),n=e.thresholds?.length?`--value-color: ${r}`:"",o=e.sparkline&&t.some(e=>e.history.length>1);return U`
      <ha-card>
        ${this.renderHeader()}
        <div class="stat-container ${this._fixedHeight()&&!o&&s?"fill":""}">
          ${e.icon?U`<div class="icon-container" style="--icon-color: ${r}">
                <ha-icon .icon=${e.icon}></ha-icon>
              </div>`:Q}
          ${s?U`<div class="value-container" style=${n}>${this._renderValue(i.value)}</div>`:Q}
        </div>
        ${s?Q:this._renderRows(t)}
        ${o?U`<prometheus-sparkline class=${this._fixedHeight()?"fill":""}
              .series=${t.map((e,s)=>({values:e.history,color:this._color(e,s,t.length)}))}
              .fill=${!1!==e.sparkline_fill}
              .lineWidth=${e.line_width??2}
              .height=${40}
            ></prometheus-sparkline>`:Q}
      </ha-card>
    `}_defaultColumns(){return this._displayItems().length>1||"tiles"===this._config?.layout?6:3}getCardSize(){return this._config?.card_height?super.getCardSize():"tiles"===this._config?.layout?3:2+Math.min(4,Math.max(0,this._displayItems().length-1))}};e([_e()],Bs.prototype,"_items",void 0),e([_e()],Bs.prototype,"_loaded",void 0),Bs=e([ue("prometheus-stat-card")],Bs);const qs=l`
  .gauges {
    display: grid;
    align-content: center;
    grid-template-columns: repeat(auto-fit, minmax(var(--gauge-min, 120px), 1fr));
    gap: 12px 16px;
    justify-items: center;
  }
  .gauge {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 250px;
    min-width: 0;
  }
  .gauge-container {
    position: relative;
    width: 100%;
    aspect-ratio: 100 / 60;
  }
  /* fixed-height panel: the gauge is limited by the available height too */
  .gauges.fill .gauge-container {
    width: min(100%, calc((100cqh - 24px) * 100 / 60));
    margin: 0 auto;
  }
  .gauges.fill {
    container-type: size;
  }
  .gauge-svg {
    width: 100%;
    height: 100%;
    display: block;
  }
  .arc-bg {
    stroke: var(--divider-color, #e0e0e0);
  }
  .arc-fg {
    transition: stroke-dashoffset 0.5s ease-in-out, stroke 0.5s ease-in-out;
  }
  .value-container {
    position: absolute;
    bottom: 4%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: baseline;
    gap: 2px;
    white-space: nowrap;
  }
  .value {
    font-size: var(--gauge-font, 28px);
    font-weight: 400;
    color: var(--primary-text-color);
    line-height: 1;
  }
  .unit {
    font-size: calc(var(--gauge-font, 28px) * 0.5);
    color: var(--secondary-text-color);
  }
  .series-label {
    margin-top: 4px;
    font-size: 13px;
    color: var(--secondary-text-color);
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;let Ls=class extends Ps{_defaults(){return{min:0,max:100,arc_width:8,refresh_interval:30,show_labels:!0,show_unfilled:!0,palette:"classic",color_mode:"thresholds"}}_sections(){return[rs(),ns(),os(as,ls,{name:"min",selector:{number:{mode:"box",step:"any"}}},{name:"max",selector:{number:{mode:"box",step:"any"}}},{name:"arc_width",selector:{number:{min:2,max:20,step:1,mode:"slider"}}},{name:"show_unfilled",selector:{boolean:{}}},{name:"show_labels",selector:{boolean:{}}},ds(this.hass),hs(this.hass))]}};Ls=e([ue("prometheus-gauge-card-editor")],Ls);const Hs=40*Math.PI;let Fs=class extends tt{constructor(){super(...arguments),this._items=[],this._loaded=!1}static get styles(){return[Ye,qs]}static getStubConfig(){return{type:"custom:prometheus-gauge-card",title:"Prometheus targets up",query:"avg(up) * 100",unit:"percent",min:0,max:100,decimals:0,thresholds:[{value:0,color:"#F2495C"},{value:50,color:"#FADE2A"},{value:90,color:"#73BF69"}]}}static getConfigElement(){return document.createElement("prometheus-gauge-card-editor")}async _fetchData(){try{this._loading=!0;const e=await this._client.instantQuery(this._config.query);this._items=Ft(e,this._config.legend_format).map(e=>({...e,label:Mt(e.metric,this._config.legend_format)})),this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}_color(e,t,s){const i=this._config;return"series"===i.color_mode||!i.thresholds?.length&&s>1?jt(t,s,i.palette):Pt(e??i.min??0,i.thresholds||[],jt(t,s,i.palette))}_renderGauge(e,t,s){const i=this._config,r=i.min??0,n=i.max??100,o=i.arc_width??8,l=e.value??r,a=Math.min(Math.max(l,r),n),c=n>r?(a-r)/(n-r):0,h=this._color(e.value,t,s),d=wt(e.value,i.unit,i.decimals),u=s>1&&!1!==i.show_labels,p=!1!==i.show_unfilled;return U`
      <div class="gauge">
        <div class="gauge-container">
          <svg viewBox="0 0 100 60" class="gauge-svg">
            ${p?W`<path class="arc-bg" d="M 10 50 A 40 40 0 0 1 90 50" fill="none"
                  stroke-width="${o}" stroke-linecap="round"></path>`:Q}
            <path class="arc-fg" d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="${h}"
              stroke-width="${o}" stroke-linecap="round"
              stroke-dasharray="${Hs}" stroke-dashoffset="${Hs*(1-c)}"></path>
          </svg>
          <div class="value-container">
            <span class="value">${d.prefix}${d.text}</span>
            ${d.suffix.trim()?U`<span class="unit">${d.suffix.trim()}</span>`:Q}
          </div>
        </div>
        ${u?U`<div class="series-label" title=${e.label}>${e.label}</div>`:Q}
      </div>
    `}render(){if(!this._hasQuery())return this.renderPlaceholder();if(this._error)return this.renderError();if(!this._loaded)return this.renderLoading();const e=this._items.length?this._items:[{metric:{},label:"",value:null}],t=e.length>1?"--gauge-min: 110px; --gauge-font: 20px":"--gauge-min: 180px";return U`
      <ha-card>
        ${this.renderHeader()}
        ${this._loaded&&!this._items.length?U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`:U`<div class="gauges ${this._fixedHeight()?"fill":""}" style=${t}>
              ${e.map((t,s)=>this._renderGauge(t,s,e.length))}
            </div>`}
      </ha-card>
    `}_defaultColumns(){return this._items.length>1?12:6}getCardSize(){return this._config?.card_height?super.getCardSize():this._items.length>2?5:3}};e([_e()],Fs.prototype,"_items",void 0),e([_e()],Fs.prototype,"_loaded",void 0),Fs=e([ue("prometheus-gauge-card")],Fs);const Ns="u-off",Rs="u-label",Os="width",js="height",Is="top",Vs="bottom",Us="left",Ws="right",Gs="#000",Qs=Gs+"0",Ks="mousemove",Ys="mousedown",Zs="mouseup",Js="mouseenter",Xs="mouseleave",ei="dblclick",ti="change",si="dppxchange",ii="--",ri="undefined"!=typeof window,ni=ri?document:null,oi=ri?window:null,li=ri?navigator:null;let ai,ci;function hi(e,t){if(null!=t){let s=e.classList;!s.contains(t)&&s.add(t)}}function di(e,t){let s=e.classList;s.contains(t)&&s.remove(t)}function ui(e,t,s){e.style[t]=s+"px"}function pi(e,t,s,i){let r=ni.createElement(e);return null!=t&&hi(r,t),null!=s&&s.insertBefore(r,i),r}function mi(e,t){return pi("div",e,t)}const fi=new WeakMap;function _i(e,t,s,i,r){let n="translate("+t+"px,"+s+"px)";n!=fi.get(e)&&(e.style.transform=n,fi.set(e,n),t<0||s<0||t>i||s>r?hi(e,Ns):di(e,Ns))}const gi=new WeakMap;function vi(e,t,s){let i=t+s;i!=gi.get(e)&&(gi.set(e,i),e.style.background=t,e.style.borderColor=s)}const bi=new WeakMap;function xi(e,t,s,i){let r=t+""+s;r!=bi.get(e)&&(bi.set(e,r),e.style.height=s+"px",e.style.width=t+"px",e.style.marginLeft=i?-t/2+"px":0,e.style.marginTop=i?-s/2+"px":0)}const yi={passive:!0},wi={...yi,capture:!0};function $i(e,t,s,i){t.addEventListener(e,s,i?wi:yi)}function ki(e,t,s,i){t.removeEventListener(e,s,yi)}function Mi(e,t,s,i){let r;s=s||0;let n=(i=i||t.length-1)<=2147483647;for(;i-s>1;)r=n?s+i>>1:Vi((s+i)/2),t[r]<e?s=r:i=r;return e-t[s]<=t[i]-e?s:i}function Ai(e){return(t,s,i)=>{let r=-1,n=-1;for(let n=s;n<=i;n++)if(e(t[n])){r=n;break}for(let r=i;r>=s;r--)if(e(t[r])){n=r;break}return[r,n]}}ri&&function e(){let t=devicePixelRatio;ai!=t&&(ai=t,ci&&ki(ti,ci,e),ci=matchMedia(`(min-resolution: ${ai-.001}dppx) and (max-resolution: ${ai+.001}dppx)`),$i(ti,ci,e),oi.dispatchEvent(new CustomEvent(si)))}();const Si=e=>null!=e,Ei=e=>null!=e&&e>0,Ci=Ai(Si),zi=Ai(Ei);function Pi(e,t,s,i){let r=Yi(e),n=Yi(t);e==t&&(-1==r?(e*=s,t/=s):(e/=s,t*=s));let o=10==s?Zi:Ji,l=1==n?Wi:Vi,a=(1==r?Vi:Wi)(o(Ii(e))),c=l(o(Ii(t))),h=Ki(s,a),d=Ki(s,c);return 10==s&&(a<0&&(h=fr(h,-a)),c<0&&(d=fr(d,-c))),i||2==s?(e=h*r,t=d*n):(e=mr(e,h),t=pr(t,d)),[e,t]}function Ti(e,t,s,i){let r=Pi(e,t,s,i);return 0==e&&(r[0]=0),0==t&&(r[1]=0),r}const Di={mode:3,pad:.1},Bi={pad:0,soft:null,mode:0},qi={min:Bi,max:Bi};function Li(e,t,s,i){return Mr(s)?Fi(e,t,s):(Bi.pad=s,Bi.soft=i?0:null,Bi.mode=i?3:0,Fi(e,t,qi))}function Hi(e,t){return null==e?t:e}function Fi(e,t,s){let i=s.min,r=s.max,n=Hi(i.pad,0),o=Hi(r.pad,0),l=Hi(i.hard,-er),a=Hi(r.hard,er),c=Hi(i.soft,er),h=Hi(r.soft,-er),d=Hi(i.mode,0),u=Hi(r.mode,0),p=t-e,m=Zi(p),f=Qi(Ii(e),Ii(t)),_=Zi(f),g=Ii(_-m);(p<1e-24||g>10)&&(p=0,0!=e&&0!=t||(p=1e-24,2==d&&c!=er&&(n=0),2==u&&h!=-er&&(o=0)));let v=p||f||1e3,b=Zi(v),x=Ki(10,Vi(b)),y=fr(mr(e-v*(0==p?0==e?.1:1:n),x/10),24),w=e>=c&&(1==d||3==d&&y<=c||2==d&&y>=c)?c:er,$=Qi(l,y<w&&e>=w?w:Gi(w,y)),k=fr(pr(t+v*(0==p?0==t?.1:1:o),x/10),24),M=t<=h&&(1==u||3==u&&k>=h||2==u&&k<=h)?h:-er,A=Gi(a,k>M&&t<=M?M:Qi(M,k));return $==A&&0==$&&(A=100),[$,A]}const Ni=new Intl.NumberFormat(ri?li.language:"en-US"),Ri=e=>Ni.format(e),Oi=Math,ji=Oi.PI,Ii=Oi.abs,Vi=Oi.floor,Ui=Oi.round,Wi=Oi.ceil,Gi=Oi.min,Qi=Oi.max,Ki=Oi.pow,Yi=Oi.sign,Zi=Oi.log10,Ji=Oi.log2,Xi=(e,t=1)=>Oi.asinh(e/t),er=1/0;function tr(e){return 1+(0|Zi((e^e>>31)-(e>>31)))}function sr(e,t,s){return Gi(Qi(e,t),s)}function ir(e){return"function"==typeof e}function rr(e){return ir(e)?e:()=>e}const nr=e=>e,or=(e,t)=>t,lr=e=>null,ar=e=>!0,cr=(e,t)=>e==t,hr=/\.\d*?(?=9{6,}|0{6,})/gm,dr=e=>{if($r(e)||_r.has(e))return e;const t=`${e}`,s=t.match(hr);if(null==s)return e;let i=s[0].length-1;if(-1!=t.indexOf("e-")){let[e,s]=t.split("e");return+`${dr(e)}e${s}`}return fr(e,i)};function ur(e,t){return dr(fr(dr(e/t))*t)}function pr(e,t){return dr(Wi(dr(e/t))*t)}function mr(e,t){return dr(Vi(dr(e/t))*t)}function fr(e,t=0){if($r(e))return e;let s=10**t,i=e*s*(1+Number.EPSILON);return Ui(i)/s}const _r=new Map;function gr(e){return((""+e).split(".")[1]||"").length}function vr(e,t,s,i){let r=[],n=i.map(gr);for(let o=t;o<s;o++){let t=Ii(o),s=fr(Ki(e,o),t);for(let l=0;l<i.length;l++){let a=10==e?+`${i[l]}e${o}`:i[l]*s,c=(o>=0?0:t)+(o>=n[l]?0:n[l]),h=10==e?a:fr(a,c);r.push(h),_r.set(h,c)}}return r}const br={},xr=[],yr=[null,null],wr=Array.isArray,$r=Number.isInteger;function kr(e){return"string"==typeof e}function Mr(e){let t=!1;if(null!=e){let s=e.constructor;t=null==s||s==Object}return t}function Ar(e){return null!=e&&"object"==typeof e}const Sr=Object.getPrototypeOf(Uint8Array),Er="__proto__";function Cr(e,t=Mr){let s;if(wr(e)){let i=e.find(e=>null!=e);if(wr(i)||t(i)){s=Array(e.length);for(let i=0;i<e.length;i++)s[i]=Cr(e[i],t)}else s=e.slice()}else if(e instanceof Sr)s=e.slice();else if(t(e)){s={};for(let i in e)i!=Er&&(s[i]=Cr(e[i],t))}else s=e;return s}function zr(e){let t=arguments;for(let s=1;s<t.length;s++){let i=t[s];for(let t in i)t!=Er&&(Mr(e[t])?zr(e[t],Cr(i[t])):e[t]=Cr(i[t]))}return e}function Pr(e,t,s){for(let i,r=0,n=-1;r<t.length;r++){let o=t[r];if(o>n){for(i=o-1;i>=0&&null==e[i];)e[i--]=null;for(i=o+1;i<s&&null==e[i];)e[n=i++]=null}}}const Tr="undefined"==typeof queueMicrotask?e=>Promise.resolve().then(e):queueMicrotask;const Dr=["January","February","March","April","May","June","July","August","September","October","November","December"],Br=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function qr(e){return e.slice(0,3)}const Lr=Br.map(qr),Hr=Dr.map(qr),Fr={MMMM:Dr,MMM:Hr,WWWW:Br,WWW:Lr};function Nr(e){return(e<10?"0":"")+e}const Rr={YYYY:e=>e.getFullYear(),YY:e=>(e.getFullYear()+"").slice(2),MMMM:(e,t)=>t.MMMM[e.getMonth()],MMM:(e,t)=>t.MMM[e.getMonth()],MM:e=>Nr(e.getMonth()+1),M:e=>e.getMonth()+1,DD:e=>Nr(e.getDate()),D:e=>e.getDate(),WWWW:(e,t)=>t.WWWW[e.getDay()],WWW:(e,t)=>t.WWW[e.getDay()],HH:e=>Nr(e.getHours()),H:e=>e.getHours(),h:e=>{let t=e.getHours();return 0==t?12:t>12?t-12:t},AA:e=>e.getHours()>=12?"PM":"AM",aa:e=>e.getHours()>=12?"pm":"am",a:e=>e.getHours()>=12?"p":"a",mm:e=>Nr(e.getMinutes()),m:e=>e.getMinutes(),ss:e=>Nr(e.getSeconds()),s:e=>e.getSeconds(),fff:e=>{return((t=e.getMilliseconds())<10?"00":t<100?"0":"")+t;var t}};function Or(e,t){t=t||Fr;let s,i=[],r=/\{([a-z]+)\}|[^{]+/gi;for(;s=r.exec(e);)i.push("{"==s[0][0]?Rr[s[1]]:s[0]);return e=>{let s="";for(let r=0;r<i.length;r++)s+="string"==typeof i[r]?i[r]:i[r](e,t);return s}}const jr=(new Intl.DateTimeFormat).resolvedOptions().timeZone;const Ir=e=>e%1==0,Vr=[1,2,2.5,5],Ur=vr(10,-32,0,Vr),Wr=vr(10,0,32,Vr),Gr=Wr.filter(Ir),Qr=Ur.concat(Wr),Kr="{YYYY}",Yr="\n"+Kr,Zr="{M}/{D}",Jr="\n"+Zr,Xr=Jr+"/{YY}",en="{aa}",tn="{h}:{mm}"+en,sn="\n"+tn,rn=":{ss}",nn=null;function on(e){let t=1e3*e,s=60*t,i=60*s,r=24*i,n=30*r,o=365*r;return[(1==e?vr(10,0,3,Vr).filter(Ir):vr(10,-3,0,Vr)).concat([t,5*t,10*t,15*t,30*t,s,5*s,10*s,15*s,30*s,i,2*i,3*i,4*i,6*i,8*i,12*i,r,2*r,3*r,4*r,5*r,6*r,7*r,8*r,9*r,10*r,15*r,n,2*n,3*n,4*n,6*n,o,2*o,5*o,10*o,25*o,50*o,100*o]),[[o,Kr,nn,nn,nn,nn,nn,nn,1],[28*r,"{MMM}",Yr,nn,nn,nn,nn,nn,1],[r,Zr,Yr,nn,nn,nn,nn,nn,1],[i,"{h}"+en,Xr,nn,Jr,nn,nn,nn,1],[s,tn,Xr,nn,Jr,nn,nn,nn,1],[t,rn,Xr+" "+tn,nn,Jr+" "+tn,nn,sn,nn,1],[e,rn+".{fff}",Xr+" "+tn,nn,Jr+" "+tn,nn,sn,nn,1]],function(t){return(l,a,c,h,d,u)=>{let p=[],m=d>=o,f=d>=n&&d<o,_=t(c),g=fr(_*e,3),v=fn(_.getFullYear(),m?0:_.getMonth(),f||m?1:_.getDate()),b=fr(v*e,3);if(f||m){let s=f?d/n:0,i=m?d/o:0,r=g==b?g:fr(fn(v.getFullYear()+i,v.getMonth()+s,1)*e,3),l=new Date(Ui(r/e)),a=l.getFullYear(),c=l.getMonth();for(let n=0;r<=h;n++){let o=fn(a+i*n,c+s*n,1),l=o-t(fr(o*e,3));r=fr((+o+l)*e,3),r<=h&&p.push(r)}}else{let n=d>=r?r:d,o=b+(Vi(c)-Vi(g))+pr(g-b,n);p.push(o);let m=t(o),f=m.getHours()+m.getMinutes()/s+m.getSeconds()/i,_=d/i,v=u/l.axes[a]._space;for(;o=fr(o+d,1==e?0:3),!(o>h);)if(_>1){let e=Vi(fr(f+_,6))%24,s=t(o).getHours()-e;s>1&&(s=-1),o-=s*i,f=(f+_)%24,fr((o-p[p.length-1])/d,3)*v>=.7&&p.push(o)}else p.push(o)}return p}}]}const[ln,an,cn]=on(1),[hn,dn,un]=on(.001);function pn(e,t){return e.map(e=>e.map((s,i)=>0==i||8==i||null==s?s:t(1==i||0==e[8]?s:e[1]+s)))}function mn(e,t){return(s,i,r,n,o)=>{let l,a,c,h,d,u,p=t.find(e=>o>=e[0])||t[t.length-1];return i.map(t=>{let s=e(t),i=s.getFullYear(),r=s.getMonth(),n=s.getDate(),o=s.getHours(),m=s.getMinutes(),f=s.getSeconds(),_=i!=l&&p[2]||r!=a&&p[3]||n!=c&&p[4]||o!=h&&p[5]||m!=d&&p[6]||f!=u&&p[7]||p[1];return l=i,a=r,c=n,h=o,d=m,u=f,_(s)})}}function fn(e,t,s){return new Date(e,t,s)}function _n(e,t){return t(e)}vr(2,-53,53,[1]);function gn(e,t){return(s,i,r,n)=>null==n?ii:t(e(i))}const vn={show:!0,live:!0,isolate:!1,mount:()=>{},markers:{show:!0,width:2,stroke:function(e,t){let s=e.series[t];return s.width?s.stroke(e,t):s.points.width?s.points.stroke(e,t):null},fill:function(e,t){return e.series[t].fill(e,t)},dash:"solid"},idx:null,idxs:null,values:[]};const bn=[0,0];function xn(e,t,s,i=!0){return e=>{0==e.button&&(!i||e.target==t)&&s(e)}}function yn(e,t,s,i=!0){return e=>{(!i||e.target==t)&&s(e)}}const wn={show:!0,x:!0,y:!0,lock:!1,move:function(e,t,s){return bn[0]=t,bn[1]=s,bn},points:{one:!1,show:function(e,t){let s=e.cursor.points,i=mi(),r=s.size(e,t);ui(i,Os,r),ui(i,js,r);let n=r/-2;ui(i,"marginLeft",n),ui(i,"marginTop",n);let o=s.width(e,t,r);return o&&ui(i,"borderWidth",o),i},size:function(e,t){return e.series[t].points.size},width:0,stroke:function(e,t){let s=e.series[t].points;return s._stroke||s._fill},fill:function(e,t){let s=e.series[t].points;return s._fill||s._stroke}},bind:{mousedown:xn,mouseup:xn,click:xn,dblclick:xn,mousemove:yn,mouseleave:yn,mouseenter:yn},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(e,t)=>{t.stopPropagation(),t.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(e,t,s,i,r)=>i-r,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},$n={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},kn=zr({},$n,{filter:or}),Mn=zr({},kn,{size:10}),An=zr({},$n,{show:!1}),Sn='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',En="bold "+Sn,Cn={show:!0,scale:"x",stroke:Gs,space:50,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:En,side:2,grid:kn,ticks:Mn,border:An,font:Sn,lineGap:1.5,rotate:0},zn={show:!0,scale:"x",auto:!1,sorted:1,min:er,max:-er,idxs:[]};function Pn(e,t,s,i,r){return t.map(e=>null==e?"":Ri(e))}function Tn(e,t,s,i,r,n,o){let l=[],a=_r.get(r)||0;for(let e=s=o?s:fr(pr(s,r),a);e<=i;e=fr(e+r,a))l.push(Object.is(e,-0)?0:e);return l}function Dn(e,t,s,i,r,n,o){const l=[],a=e.scales[e.axes[t].scale].log,c=Vi((10==a?Zi:Ji)(s));r=Ki(a,c),10==a&&(r=Qr[Mi(r,Qr)]);let h=s,d=r*a;10==a&&(d=Qr[Mi(d,Qr)]);do{l.push(h),h+=r,10!=a||_r.has(h)||(h=fr(h,_r.get(r))),h>=d&&(d=(r=h)*a,10==a&&(d=Qr[Mi(d,Qr)]))}while(h<=i);return l}function Bn(e,t,s,i,r,n,o){let l=e.scales[e.axes[t].scale].asinh,a=i>l?Dn(e,t,Qi(l,s),i,r):[l],c=i>=0&&s<=0?[0]:[];return(s<-l?Dn(e,t,Qi(l,-i),-s,r):[l]).reverse().map(e=>-e).concat(c,a)}const qn=/./,Ln=/[12357]/,Hn=/[125]/,Fn=/1/,Nn=(e,t,s,i)=>e.map((e,r)=>4==t&&0==e||r%i==0&&s.test(e.toExponential()[e<0?1:0])?e:null);function Rn(e,t,s,i,r){let n=e.axes[s],o=n.scale,l=e.scales[o],a=e.valToPos,c=n._space,h=a(10,o),d=a(9,o)-h>=c?qn:a(7,o)-h>=c?Ln:a(5,o)-h>=c?Hn:Fn;if(d==Fn){let e=Ii(a(1,o)-h);if(e<c)return Nn(t.slice().reverse(),l.distr,d,Wi(c/e)).reverse()}return Nn(t,l.distr,d,1)}function On(e,t,s,i,r){let n=e.axes[s],o=n.scale,l=n._space,a=e.valToPos,c=Ii(a(1,o)-a(2,o));return c<l?Nn(t.slice().reverse(),3,qn,Wi(l/c)).reverse():t}function jn(e,t,s,i){return null==i?ii:null==t?"":Ri(t)}const In={show:!0,scale:"y",stroke:Gs,space:30,gap:5,alignTo:1,size:50,labelGap:0,labelSize:30,labelFont:En,side:3,grid:kn,ticks:Mn,border:An,font:Sn,lineGap:1.5,rotate:0};const Vn={scale:null,auto:!0,sorted:0,min:er,max:-er},Un=(e,t,s,i,r)=>r,Wn={show:!0,auto:!0,sorted:0,gaps:Un,alpha:1,facets:[zr({},Vn,{scale:"x"}),zr({},Vn,{scale:"y"})]},Gn={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:Un,alpha:1,points:{show:function(e,t){let{scale:s,idxs:i}=e.series[0],r=e._data[0],n=e.valToPos(r[i[0]],s,!0),o=e.valToPos(r[i[1]],s,!0),l=Ii(o-n)/(e.series[t].points.space*ai);return i[1]-i[0]<=l},filter:null},values:null,min:er,max:-er,idxs:[],path:null,clip:null};function Qn(e,t,s,i,r){return s/10}const Kn={time:!0,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},Yn=zr({},Kn,{time:!1,ori:1}),Zn={};function Jn(e,t){let s=Zn[e];return s||(s={key:e,plots:[],sub(e){s.plots.push(e)},unsub(e){s.plots=s.plots.filter(t=>t!=e)},pub(e,t,i,r,n,o,l){for(let a=0;a<s.plots.length;a++)s.plots[a]!=t&&s.plots[a].pub(e,t,i,r,n,o,l)}},null!=e&&(Zn[e]=s)),s}function Xn(e,t,s){const i=e.mode,r=e.series[t],n=2==i?e._data[t]:e._data,o=e.scales,l=e.bbox;let a=n[0],c=2==i?n[1]:n[t],h=2==i?o[r.facets[0].scale]:o[e.series[0].scale],d=2==i?o[r.facets[1].scale]:o[r.scale],u=l.left,p=l.top,m=l.width,f=l.height,_=e.valToPosH,g=e.valToPosV;return 0==h.ori?s(r,a,c,h,d,_,g,u,p,m,f,lo,co,uo,mo,_o):s(r,a,c,h,d,g,_,p,u,f,m,ao,ho,po,fo,go)}function eo(e,t){let s=0,i=0,r=Hi(e.bands,xr);for(let e=0;e<r.length;e++){let n=r[e];n.series[0]==t?s=n.dir:n.series[1]==t&&(1==n.dir?i|=1:i|=2)}return[s,1==i?-1:2==i?1:3==i?2:0]}function to(e,t,s,i,r){let n=e.mode,o=e.series[t],l=2==n?o.facets[1].scale:o.scale,a=e.scales[l];return-1==r?a.min:1==r?a.max:3==a.distr?1==a.dir?a.min:a.max:0}function so(e,t,s,i,r,n){return Xn(e,t,(e,t,o,l,a,c,h,d,u,p,m)=>{let f=e.pxRound;const _=l.dir*(0==l.ori?1:-1),g=0==l.ori?co:ho;let v,b;1==_?(v=s,b=i):(v=i,b=s);let x=f(c(t[v],l,p,d)),y=f(h(o[v],a,m,u)),w=f(c(t[b],l,p,d)),$=f(h(1==n?a.max:a.min,a,m,u)),k=new Path2D(r);return g(k,w,$),g(k,x,$),g(k,x,y),k})}function io(e,t,s,i,r,n){let o=null;if(e.length>0){o=new Path2D;const l=0==t?uo:po;let a=s;for(let t=0;t<e.length;t++){let s=e[t];if(s[1]>s[0]){let e=s[0]-a;e>0&&l(o,a,i,e,i+n),a=s[1]}}let c=s+r-a,h=10;c>0&&l(o,a,i-h/2,c,i+n+h)}return o}function ro(e,t,s,i,r,n,o){let l=[],a=e.length;for(let c=1==r?s:i;c>=s&&c<=i;c+=r){if(null===t[c]){let h=c,d=c;if(1==r)for(;++c<=i&&null===t[c];)d=c;else for(;--c>=s&&null===t[c];)d=c;let u=n(e[h]),p=d==h?u:n(e[d]),m=h-r;u=o<=0&&m>=0&&m<a?n(e[m]):u;let f=d+r;p=o>=0&&f>=0&&f<a?n(e[f]):p,p>=u&&l.push([u,p])}}return l}function no(e){return 0==e?nr:1==e?Ui:t=>ur(t,e)}function oo(e){let t=0==e?lo:ao,s=0==e?(e,t,s,i,r,n)=>{e.arcTo(t,s,i,r,n)}:(e,t,s,i,r,n)=>{e.arcTo(s,t,r,i,n)},i=0==e?(e,t,s,i,r)=>{e.rect(t,s,i,r)}:(e,t,s,i,r)=>{e.rect(s,t,r,i)};return(e,r,n,o,l,a=0,c=0)=>{0==a&&0==c?i(e,r,n,o,l):(a=Gi(a,o/2,l/2),c=Gi(c,o/2,l/2),t(e,r+a,n),s(e,r+o,n,r+o,n+l,a),s(e,r+o,n+l,r,n+l,c),s(e,r,n+l,r,n,c),s(e,r,n,r+o,n,a),e.closePath())}}const lo=(e,t,s)=>{e.moveTo(t,s)},ao=(e,t,s)=>{e.moveTo(s,t)},co=(e,t,s)=>{e.lineTo(t,s)},ho=(e,t,s)=>{e.lineTo(s,t)},uo=oo(0),po=oo(1),mo=(e,t,s,i,r,n)=>{e.arc(t,s,i,r,n)},fo=(e,t,s,i,r,n)=>{e.arc(s,t,i,r,n)},_o=(e,t,s,i,r,n,o)=>{e.bezierCurveTo(t,s,i,r,n,o)},go=(e,t,s,i,r,n,o)=>{e.bezierCurveTo(s,t,r,i,o,n)};function vo(e){return(e,t,s,i,r)=>Xn(e,t,(t,n,o,l,a,c,h,d,u,p,m)=>{let f,_,{pxRound:g,points:v}=t;0==l.ori?(f=lo,_=mo):(f=ao,_=fo);const b=fr(v.width*ai,3);let x=(v.size-v.width)/2*ai,y=fr(2*x,3),w=new Path2D,$=new Path2D,{left:k,top:M,width:A,height:S}=e.bbox;uo($,k-y,M-y,A+2*y,S+2*y);const E=e=>{if(null!=o[e]){let t=g(c(n[e],l,p,d)),s=g(h(o[e],a,m,u));f(w,t+x,s),_(w,t,s,x,0,2*ji)}};if(r)r.forEach(E);else for(let e=s;e<=i;e++)E(e);return{stroke:b>0?w:null,fill:w,clip:$,flags:3}})}function bo(e){return(t,s,i,r,n,o)=>{i!=r&&(n!=i&&o!=i&&e(t,s,i),n!=r&&o!=r&&e(t,s,r),e(t,s,o))}}const xo=bo(co),yo=bo(ho);function wo(e){const t=Hi(e?.alignGaps,0);return(e,s,i,r)=>Xn(e,s,(n,o,l,a,c,h,d,u,p,m,f)=>{[i,r]=Ci(l,i,r);let _,g,v=n.pxRound,b=e=>v(h(e,a,m,u)),x=e=>v(d(e,c,f,p));0==a.ori?(_=co,g=xo):(_=ho,g=yo);const y=a.dir*(0==a.ori?1:-1),w={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},$=w.stroke;let k=!1;if(r-i>=4*m){let t,s,n,c=t=>e.posToVal(t,a.key,!0),h=null,d=null,u=b(o[1==y?i:r]),p=b(o[i]),m=b(o[r]),f=c(1==y?p+1:m-1);for(let e=1==y?i:r;e>=i&&e<=r;e+=y){let i=o[e],r=(1==y?i<f:i>f)?u:b(i),n=l[e];r==u?null!=n?(s=n,null==h?(_($,r,x(s)),t=h=d=s):s<h?h=s:s>d&&(d=s)):null===n&&(k=!0):(null!=h&&g($,u,x(h),x(d),x(t),x(s)),null!=n?(s=n,_($,r,x(s)),h=d=t=s):(h=d=null,null===n&&(k=!0)),u=r,f=c(u+y))}null!=h&&h!=d&&n!=u&&g($,u,x(h),x(d),x(t),x(s))}else for(let e=1==y?i:r;e>=i&&e<=r;e+=y){let t=l[e];null===t?k=!0:null!=t&&_($,b(o[e]),x(t))}let[M,A]=eo(e,s);if(null!=n.fill||0!=M){let t=w.fill=new Path2D($),l=x(n.fillTo(e,s,n.min,n.max,M)),a=b(o[i]),c=b(o[r]);-1==y&&([c,a]=[a,c]),_(t,c,l),_(t,a,l)}if(!n.spanGaps){let c=[];k&&c.push(...ro(o,l,i,r,y,b,t)),w.gaps=c=n.gaps(e,s,i,r,c),w.clip=io(c,a.ori,u,p,m,f)}return 0!=A&&(w.band=2==A?[so(e,s,i,r,$,-1),so(e,s,i,r,$,1)]:so(e,s,i,r,$,A)),w})}function $o(e,t,s,i,r,n,o=er){if(e.length>1){let l=null;for(let a=0,c=1/0;a<e.length;a++)if(void 0!==t[a]){if(null!=l){let t=Ii(e[a]-e[l]);t<c&&(c=t,o=Ii(s(e[a],i,r,n)-s(e[l],i,r,n)))}l=a}}return o}function ko(e,t,s,i,r,n){const o=e.length;if(o<2)return null;const l=new Path2D;if(s(l,e[0],t[0]),2==o)i(l,e[1],t[1]);else{let s=Array(o),i=Array(o-1),n=Array(o-1),a=Array(o-1);for(let s=0;s<o-1;s++)n[s]=t[s+1]-t[s],a[s]=e[s+1]-e[s],i[s]=n[s]/a[s];s[0]=i[0];for(let e=1;e<o-1;e++)0===i[e]||0===i[e-1]||i[e-1]>0!=i[e]>0?s[e]=0:(s[e]=3*(a[e-1]+a[e])/((2*a[e]+a[e-1])/i[e-1]+(a[e]+2*a[e-1])/i[e]),isFinite(s[e])||(s[e]=0));s[o-1]=i[o-2];for(let i=0;i<o-1;i++)r(l,e[i]+a[i]/3,t[i]+s[i]*a[i]/3,e[i+1]-a[i]/3,t[i+1]-s[i+1]*a[i]/3,e[i+1],t[i+1])}return l}const Mo=new Set;function Ao(){for(let e of Mo)e.syncRect(!0)}ri&&($i("resize",oi,Ao),$i("scroll",oi,Ao,!0),$i(si,oi,()=>{Oo.pxRatio=ai}));const So=wo(),Eo=vo();function Co(e,t,s,i){return(i?[e[0],e[1]].concat(e.slice(2)):[e[0]].concat(e.slice(1))).map((e,i)=>zo(e,i,t,s))}function zo(e,t,s,i){return zr({},0==t?s:i,e)}function Po(e,t,s){return null==t?yr:[t,s]}const To=Po;function Do(e,t,s){return null==t?yr:Li(t,s,.1,!0)}function Bo(e,t,s,i){return null==t?yr:Pi(t,s,e.scales[i].log,!1)}const qo=Bo;function Lo(e,t,s,i){return null==t?yr:Ti(t,s,e.scales[i].log,!1)}const Ho=Lo;function Fo(e,t,s,i,r){let n=Qi(tr(e),tr(t)),o=t-e,l=Mi(r/i*o,s);do{let e=s[l],t=i*e/o;if(t>=r&&n+(e<5?_r.get(e):0)<=17)return[e,t]}while(++l<s.length);return[0,0]}function No(e){let t,s;return[e=e.replace(/(\d+)px/,(e,i)=>(t=Ui((s=+i)*ai))+"px"),t,s]}function Ro(e){e.show&&[e.font,e.labelFont].forEach(e=>{let t=fr(e[2]*ai,1);e[0]=e[0].replace(/[0-9.]+px/,t+"px"),e[1]=t})}function Oo(e,t,s){const i={mode:Hi(e.mode,1)},r=i.mode;function n(e,t,s,i){let r=t.valToPct(e);return i+s*(-1==t.dir?1-r:r)}function o(e,t,s,i){let r=t.valToPct(e);return i+s*(-1==t.dir?r:1-r)}function l(e,t,s,i){return 0==t.ori?n(e,t,s,i):o(e,t,s,i)}i.valToPosH=n,i.valToPosV=o;let a=!1;i.status=0;const c=i.root=mi("uplot");if(null!=e.id&&(c.id=e.id),hi(c,e.class),e.title){mi("u-title",c).textContent=e.title}const h=pi("canvas"),d=i.ctx=h.getContext("2d"),u=mi("u-wrap",c);$i("click",u,e=>{if(e.target===m){(Et!=kt||Ct!=Mt)&&Ft.click(i,e)}},!0);const p=i.under=mi("u-under",u);u.appendChild(h);const m=i.over=mi("u-over",u),f=+Hi((e=Cr(e)).pxAlign,1),_=no(f);(e.plugins||[]).forEach(t=>{t.opts&&(e=t.opts(i,e)||e)});const g=e.ms||.001,v=i.series=1==r?Co(e.series||[],zn,Gn,!1):function(e,t){return e.map((e,s)=>0==s?{}:zr({},t,e))}(e.series||[null],Wn),b=i.axes=Co(e.axes||[],Cn,In,!0),x=i.scales={},y=i.bands=e.bands||[];y.forEach(e=>{e.fill=rr(e.fill||null),e.dir=Hi(e.dir,-1)});const w=2==r?v[1].facets[0].scale:v[0].scale,$={axes:function(){for(let e=0;e<b.length;e++){let t=b[e];if(!t.show||!t._show)continue;let s,r,n=t.side,o=n%2,a=t.stroke(i,e),c=0==n||3==n?-1:1,[h,u]=t._found;if(null!=t.label){let l=t.labelGap*c,p=Ui((t._lpos+l)*ai);nt(t.labelFont[0],a,"center",2==n?Is:Vs),d.save(),1==o?(s=r=0,d.translate(p,Ui(me+_e/2)),d.rotate((3==n?-ji:ji)/2)):(s=Ui(pe+fe/2),r=p);let m=ir(t.label)?t.label(i,e,h,u):t.label;d.fillText(m,s,r),d.restore()}if(0==u)continue;let p=x[t.scale],m=0==o?fe:_e,f=0==o?pe:me,g=t._splits,v=2==p.distr?g.map(e=>et[e]):g,y=2==p.distr?et[g[1]]-et[g[0]]:h,w=t.ticks,$=t.border,k=w.show?w.size:0,M=Ui(k*ai),A=Ui((2==t.alignTo?t._size-k-t.gap:t.gap)*ai),S=t._rotate*-ji/180,E=_(t._pos*ai),C=E+(M+A)*c;r=0==o?C:0,s=1==o?C:0,nt(t.font[0],a,1==t.align?Us:2==t.align?Ws:S>0?Us:S<0?Ws:0==o?"center":3==n?Ws:Us,S||1==o?"middle":2==n?Is:Vs);let z=t.font[1]*t.lineGap,P=g.map(e=>_(l(e,p,m,f))),T=t._values;for(let e=0;e<T.length;e++){let t=T[e];if(null!=t){0==o?s=P[e]:r=P[e],t=""+t;let i=-1==t.indexOf("\n")?[t]:t.split(/\n/gm);for(let e=0;e<i.length;e++){let t=i[e];S?(d.save(),d.translate(s,r+e*z),d.rotate(S),d.fillText(t,0,0),d.restore()):d.fillText(t,s,r+e*z)}}}w.show&&mt(P,w.filter(i,v,e,u,y),o,n,E,M,fr(w.width*ai,3),w.stroke(i,e),w.dash,w.cap);let D=t.grid;D.show&&mt(P,D.filter(i,v,e,u,y),o,0==o?2:1,0==o?me:pe,0==o?_e:fe,fr(D.width*ai,3),D.stroke(i,e),D.dash,D.cap),$.show&&mt([E],[1],0==o?1:0,0==o?1:2,1==o?me:pe,1==o?_e:fe,fr($.width*ai,3),$.stroke(i,e),$.dash,$.cap)}xs("drawAxes")},series:function(){if(Re>0){let e=v.some(e=>e._focus)&&Xe!=Ee.alpha;e&&(d.globalAlpha=Xe=Ee.alpha),v.forEach((e,s)=>{if(s>0&&e.show&&(at(s,!1),at(s,!0),null==e._paths)){let n=Xe;Xe!=e.alpha&&(d.globalAlpha=Xe=e.alpha);let o=2==r?[0,t[s][0].length-1]:function(e){let t=sr(Oe-1,0,Re-1),s=sr(je+1,0,Re-1);for(;null==e[t]&&t>0;)t--;for(;null==e[s]&&s<Re-1;)s++;return[t,s]}(t[s]);e._paths=e.paths(i,s,o[0],o[1]),Xe!=n&&(d.globalAlpha=Xe=n)}}),v.forEach((e,t)=>{if(t>0&&e.show){let s=Xe;Xe!=e.alpha&&(d.globalAlpha=Xe=e.alpha),null!=e._paths&&ct(t,!1);{let s=null!=e._paths?e._paths.gaps:null,r=e.points.show(i,t,Oe,je,s),n=e.points.filter(i,t,r,s);(r||n)&&(e.points._paths=e.points.paths(i,t,Oe,je,n),ct(t,!0))}Xe!=s&&(d.globalAlpha=Xe=s),xs("drawSeries",t)}}),e&&(d.globalAlpha=Xe=1)}}},k=(e.drawOrder||["axes","series"]).map(e=>$[e]);function M(e){const t=3==e.distr?t=>Zi(t>0?t:e.clamp(i,t,e.min,e.max,e.key)):4==e.distr?t=>Xi(t,e.asinh):100==e.distr?t=>e.fwd(t):e=>e;return s=>{let i=t(s),{_min:r,_max:n}=e;return(i-r)/(n-r)}}function A(t){let s=x[t];if(null==s){let i=(e.scales||br)[t]||br;if(null!=i.from){A(i.from);let e=zr({},x[i.from],i,{key:t});e.valToPct=M(e),x[t]=e}else{s=x[t]=zr({},t==w?Kn:Yn,i),s.key=t;let e=s.time,n=s.range,o=wr(n);if((t!=w||2==r&&!e)&&(!o||null!=n[0]&&null!=n[1]||(n={min:null==n[0]?Di:{mode:1,hard:n[0],soft:n[0]},max:null==n[1]?Di:{mode:1,hard:n[1],soft:n[1]}},o=!1),!o&&Mr(n))){let e=n;n=(t,s,i)=>null==s?yr:Li(s,i,e)}s.range=rr(n||(e?To:t==w?3==s.distr?qo:4==s.distr?Ho:Po:3==s.distr?Bo:4==s.distr?Lo:Do)),s.auto=rr(!o&&s.auto),s.clamp=rr(s.clamp||Qn),s._min=s._max=null,s.valToPct=M(s)}}}A("x"),A("y"),1==r&&v.forEach(e=>{A(e.scale)}),b.forEach(e=>{A(e.scale)});for(let t in e.scales)A(t);const S=x[w],E=S.distr;let C,z;0==S.ori?(hi(c,"u-hz"),C=n,z=o):(hi(c,"u-vt"),C=o,z=n);const P={};for(let e in x){let t=x[e];null==t.min&&null==t.max||(P[e]={min:t.min,max:t.max},t.min=t.max=null)}const T=e.tzDate||(e=>new Date(Ui(e/g))),D=e.fmtDate||Or,B=1==g?cn(T):un(T),q=mn(T,pn(1==g?an:dn,D)),L=gn(T,_n("{YYYY}-{MM}-{DD} {h}:{mm}{aa}",D)),H=[],F=i.legend=zr({},vn,e.legend),N=i.cursor=zr({},wn,{drag:{y:2==r}},e.cursor),R=F.show,O=N.show,j=F.markers;let I,V,U;F.idxs=H,j.width=rr(j.width),j.dash=rr(j.dash),j.stroke=rr(j.stroke),j.fill=rr(j.fill);let W,G=[],Q=[],K=!1,Y={};if(F.live){const e=v[1]?v[1].values:null;K=null!=e,W=K?e(i,1,0):{_:0};for(let e in W)Y[e]=ii}if(R)if(I=pi("table","u-legend",c),U=pi("tbody",null,I),F.mount(i,I),K){V=pi("thead",null,I,U);let e=pi("tr",null,V);for(var Z in pi("th",null,e),W)pi("th",Rs,e).textContent=Z}else hi(I,"u-inline"),F.live&&hi(I,"u-live");const J={show:!0},X={show:!1};const ee=new Map;function te(e,t,s,r=!0){const n=ee.get(t)||{},o=N.bind[e](i,t,s,r);o&&($i(e,t,n[e]=o),ee.set(t,n))}function se(e,t,s){const i=ee.get(t)||{};for(let s in i)null!=e&&s!=e||(ki(s,t,i[s]),delete i[s]);null==e&&ee.delete(t)}let ie=0,re=0,ne=0,oe=0,le=0,ae=0,ce=le,he=ae,de=ne,ue=oe,pe=0,me=0,fe=0,_e=0;i.bbox={};let ge=!1,ve=!1,be=!1,xe=!1,ye=!1,we=!1;function $e(e,t,s){(s||e!=i.width||t!=i.height)&&ke(e,t),gt(!1),be=!0,ve=!0,Bt()}function ke(e,t){i.width=ie=ne=e,i.height=re=oe=t,le=ae=0,function(){let e=!1,t=!1,s=!1,i=!1;b.forEach((r,n)=>{if(r.show&&r._show){let{side:n,_size:o}=r,l=n%2,a=o+(null!=r.label?r.labelSize:0);a>0&&(l?(ne-=a,3==n?(le+=a,i=!0):s=!0):(oe-=a,0==n?(ae+=a,e=!0):t=!0))}}),Le[0]=e,Le[1]=s,Le[2]=t,Le[3]=i,ne-=Ne[1]+Ne[3],le+=Ne[3],oe-=Ne[2]+Ne[0],ae+=Ne[0]}(),function(){let e=le+ne,t=ae+oe,s=le,i=ae;function r(r,n){switch(r){case 1:return e+=n,e-n;case 2:return t+=n,t-n;case 3:return s-=n,s+n;case 0:return i-=n,i+n}}b.forEach((e,t)=>{if(e.show&&e._show){let t=e.side;e._pos=r(t,e._size),null!=e.label&&(e._lpos=r(t,e.labelSize))}})}();let s=i.bbox;pe=s.left=ur(le*ai,.5),me=s.top=ur(ae*ai,.5),fe=s.width=ur(ne*ai,.5),_e=s.height=ur(oe*ai,.5)}const Me=3;if(i.setSize=function({width:e,height:t}){$e(e,t)},null==N.dataIdx){let e=N.hover,s=e.skip=new Set(e.skip??[]);s.add(void 0);let i=e.prox=rr(e.prox),r=e.bias??=0;N.dataIdx=(e,n,o,l)=>{if(0==n)return o;let a=o,c=i(e,n,o,l)??er,h=c>=0&&c<er,d=0==S.ori?ne:oe,u=N.left,p=t[0],m=t[n];if(s.has(m[o])){a=null;let e,t=null,i=null;if(0==r||-1==r)for(e=o;null==t&&e-- >0;)s.has(m[e])||(t=e);if(0==r||1==r)for(e=o;null==i&&e++<m.length;)s.has(m[e])||(i=e);if(null!=t||null!=i)if(h){let e=u-(null==t?-1/0:C(p[t],S,d,0)),s=(null==i?1/0:C(p[i],S,d,0))-u;e<=s?e<=c&&(a=t):s<=c&&(a=i)}else a=null==i?t:null==t?i:o-t<=i-o?t:i}else if(h){Ii(u-C(p[o],S,d,0))>c&&(a=null)}return a}}const Ae=e=>{N.event=e};N.idxs=H,N._lock=!1;let Se=N.points;Se.show=rr(Se.show),Se.size=rr(Se.size),Se.stroke=rr(Se.stroke),Se.width=rr(Se.width),Se.fill=rr(Se.fill);const Ee=i.focus=zr({},e.focus||{alpha:.3},N.focus),Ce=Ee.prox>=0,ze=Ce&&Se.one;let Pe=[],Te=[],De=[];function Be(e,t){let s=Se.show(i,t);if(s instanceof HTMLElement)return hi(s,"u-cursor-pt"),hi(s,e.class),_i(s,-10,-10,ne,oe),m.insertBefore(s,Pe[t]),s}function qe(e,t){if(1==r||t>0){let t=1==r&&x[e.scale].time,s=e.value;e.value=t?kr(s)?gn(T,_n(s,D)):s||L:s||jn,e.label=e.label||(t?"Time":"Value")}if(ze||t>0){e.width=null==e.width?1:e.width,e.paths=e.paths||So||lr,e.fillTo=rr(e.fillTo||to),e.pxAlign=+Hi(e.pxAlign,f),e.pxRound=no(e.pxAlign),e.stroke=rr(e.stroke||null),e.fill=rr(e.fill||null),e._stroke=e._fill=e._paths=e._focus=null;let t=fr((3+2*(Qi(1,e.width)||1))*1,3),s=e.points=zr({},{size:t,width:Qi(1,.2*t),stroke:e.stroke,space:2*t,paths:Eo,_stroke:null,_fill:null},e.points);s.show=rr(s.show),s.filter=rr(s.filter),s.fill=rr(s.fill),s.stroke=rr(s.stroke),s.paths=rr(s.paths),s.pxAlign=e.pxAlign}if(R){let s=function(e,t){if(0==t&&(K||!F.live||2==r))return yr;let s=[],n=pi("tr","u-series",U,U.childNodes[t]);hi(n,e.class),e.show||hi(n,Ns);let o=pi("th",null,n);if(j.show){let e=mi("u-marker",o);if(t>0){let s=j.width(i,t);s&&(e.style.border=s+"px "+j.dash(i,t)+" "+j.stroke(i,t)),e.style.background=j.fill(i,t)}}let l=mi(Rs,o);for(var a in e.label instanceof HTMLElement?l.appendChild(e.label):l.textContent=e.label,t>0&&(j.show||(l.style.color=e.width>0?j.stroke(i,t):j.fill(i,t)),te("click",o,t=>{if(N._lock)return;Ae(t);let s=v.indexOf(e);if((t.ctrlKey||t.metaKey)!=F.isolate){let e=v.some((e,t)=>t>0&&t!=s&&e.show);v.forEach((t,i)=>{i>0&&Ut(i,e?i==s?J:X:J,!0,ws.setSeries)})}else Ut(s,{show:!e.show},!0,ws.setSeries)},!1),Ce&&te(Js,o,t=>{N._lock||(Ae(t),Ut(v.indexOf(e),Kt,!0,ws.setSeries))},!1)),W){let e=pi("td","u-value",n);e.textContent="--",s.push(e)}return[n,s]}(e,t);G.splice(t,0,s[0]),Q.splice(t,0,s[1]),F.values.push(null)}if(O){H.splice(t,0,null);let s=null;ze?0==t&&(s=Be(e,t)):t>0&&(s=Be(e,t)),Pe.splice(t,0,s),Te.splice(t,0,0),De.splice(t,0,0)}xs("addSeries",t)}i.addSeries=function(e,t){t=null==t?v.length:t,e=1==r?zo(e,t,zn,Gn):zo(e,t,{},Wn),v.splice(t,0,e),qe(v[t],t)},i.delSeries=function(e){if(v.splice(e,1),R){F.values.splice(e,1),Q.splice(e,1);let t=G.splice(e,1)[0];se(null,t.firstChild),t.remove()}O&&(H.splice(e,1),Pe.splice(e,1)[0].remove(),Te.splice(e,1),De.splice(e,1)),xs("delSeries",e)};const Le=[!1,!1,!1,!1];function He(e,t,s,i){let[r,n,o,l]=s,a=t%2,c=0;return 0==a&&(l||n)&&(c=0==t&&!r||2==t&&!o?Ui(Cn.size/3):0),1==a&&(r||o)&&(c=1==t&&!n||3==t&&!l?Ui(In.size/2):0),c}const Fe=i.padding=(e.padding||[He,He,He,He]).map(e=>rr(Hi(e,He))),Ne=i._padding=Fe.map((e,t)=>e(i,t,Le,0));let Re,Oe=null,je=null;const Ie=1==r?v[0].idxs:null;let Ve,Ue,We,Ge,Qe,Ke,Ye,Ze,Je,Xe,et=null,tt=!1;function st(e,s){if(t=null==e?[]:e,i.data=i._data=t,2==r){Re=0;for(let e=1;e<v.length;e++)Re+=t[e][0].length}else{0==t.length&&(i.data=i._data=t=[[]]),et=t[0],Re=et.length;let e=t;if(2==E){e=t.slice();let s=e[0]=Array(Re);for(let e=0;e<Re;e++)s[e]=e}i._data=t=e}if(gt(!0),xs("setData"),2==E&&(be=!0),!1!==s){let e=S;e.auto(i,tt)?it():Vt(w,e.min,e.max),xe=xe||N.left>=0,we=!0,Bt()}}function it(){let e,s;tt=!0,1==r&&(Re>0?(Oe=Ie[0]=0,je=Ie[1]=Re-1,e=t[0][Oe],s=t[0][je],2==E?(e=Oe,s=je):e==s&&(3==E?[e,s]=Pi(e,e,S.log,!1):4==E?[e,s]=Ti(e,e,S.log,!1):S.time?s=e+Ui(86400/g):[e,s]=Li(e,s,.1,!0))):(Oe=Ie[0]=e=null,je=Ie[1]=s=null)),Vt(w,e,s)}function rt(e,t,s,i,r,n){e??=Qs,s??=xr,i??="butt",r??=Qs,n??="round",e!=Ve&&(d.strokeStyle=Ve=e),r!=Ue&&(d.fillStyle=Ue=r),t!=We&&(d.lineWidth=We=t),n!=Qe&&(d.lineJoin=Qe=n),i!=Ke&&(d.lineCap=Ke=i),s!=Ge&&d.setLineDash(Ge=s)}function nt(e,t,s,i){t!=Ue&&(d.fillStyle=Ue=t),e!=Ye&&(d.font=Ye=e),s!=Ze&&(d.textAlign=Ze=s),i!=Je&&(d.textBaseline=Je=i)}function ot(e,t,s,r,n=0){if(r.length>0&&e.auto(i,tt)&&(null==t||null==t.min)){let t=Hi(Oe,0),i=Hi(je,r.length-1),o=null==s.min?function(e,t,s,i=0,r=!1){let n=r?zi:Ci,o=r?Ei:Si;[t,s]=n(e,t,s);let l=e[t],a=e[t];if(t>-1)if(1==i)l=e[t],a=e[s];else if(-1==i)l=e[s],a=e[t];else for(let i=t;i<=s;i++){let t=e[i];o(t)&&(t<l?l=t:t>a&&(a=t))}return[l??er,a??-er]}(r,t,i,n,3==e.distr):[s.min,s.max];e.min=Gi(e.min,s.min=o[0]),e.max=Qi(e.max,s.max=o[1])}}i.setData=st;const lt={min:null,max:null};function at(e,t){let s=t?v[e].points:v[e];s._stroke=s.stroke(i,e),s._fill=s.fill(i,e)}function ct(e,s){let r=s?v[e].points:v[e],{stroke:n,fill:o,clip:l,flags:a,_stroke:c=r._stroke,_fill:h=r._fill,_width:u=r.width}=r._paths;u=fr(u*ai,3);let p=null,m=u%2/2;s&&null==h&&(h=u>0?"#fff":c);let f=1==r.pxAlign&&m>0;if(f&&d.translate(m,m),!s){let e=pe-u/2,t=me-u/2,s=fe+u,i=_e+u;p=new Path2D,p.rect(e,t,s,i)}s?dt(c,u,r.dash,r.cap,h,n,o,a,l):function(e,s,r,n,o,l,a,c,h,d,u){let p=!1;0!=h&&y.forEach((m,f)=>{if(m.series[0]==e){let e,_=v[m.series[1]],g=t[m.series[1]],b=(_._paths||br).band;wr(b)&&(b=1==m.dir?b[0]:b[1]);let x=null;_.show&&b&&function(e,t,s){for(t=Hi(t,0),s=Hi(s,e.length-1);t<=s;){if(null!=e[t])return!0;t++}return!1}(g,Oe,je)?(x=m.fill(i,f)||l,e=_._paths.clip):b=null,dt(s,r,n,o,x,a,c,h,d,u,e,b),p=!0}}),p||dt(s,r,n,o,l,a,c,h,d,u)}(e,c,u,r.dash,r.cap,h,n,o,a,p,l),f&&d.translate(-m,-m)}const ht=3;function dt(e,t,s,i,r,n,o,l,a,c,h,u){rt(e,t,s,i,r),(a||c||u)&&(d.save(),a&&d.clip(a),c&&d.clip(c)),u?(l&ht)==ht?(d.clip(u),h&&d.clip(h),pt(r,o),ut(e,n,t)):2&l?(pt(r,o),d.clip(u),ut(e,n,t)):1&l&&(d.save(),d.clip(u),h&&d.clip(h),pt(r,o),d.restore(),ut(e,n,t)):(pt(r,o),ut(e,n,t)),(a||c||u)&&d.restore()}function ut(e,t,s){s>0&&(t instanceof Map?t.forEach((e,t)=>{d.strokeStyle=Ve=t,d.stroke(e)}):null!=t&&e&&d.stroke(t))}function pt(e,t){t instanceof Map?t.forEach((e,t)=>{d.fillStyle=Ue=t,d.fill(e)}):null!=t&&e&&d.fill(t)}function mt(e,t,s,i,r,n,o,l,a,c){let h=o%2/2;1==f&&d.translate(h,h),rt(l,o,a,c,l),d.beginPath();let u,p,m,_,g=r+(0==i||3==i?-n:n);0==s?(p=r,_=g):(u=r,m=g);for(let i=0;i<e.length;i++)null!=t[i]&&(0==s?u=m=e[i]:p=_=e[i],d.moveTo(u,p),d.lineTo(m,_));d.stroke(),1==f&&d.translate(-h,-h)}function ft(e){let t=!0;return b.forEach((s,r)=>{if(!s.show)return;let n=x[s.scale];if(null==n.min)return void(s._show&&(t=!1,s._show=!1,gt(!1)));s._show||(t=!1,s._show=!0,gt(!1));let o=s.side,l=o%2,{min:a,max:c}=n,[h,d]=function(e,t,s,r){let n,o=b[e];if(r<=0)n=[0,0];else{let l=o._space=o.space(i,e,t,s,r);n=Fo(t,s,o._incrs=o.incrs(i,e,t,s,r,l),r,l)}return o._found=n}(r,a,c,0==l?ne:oe);if(0==d)return;let u=2==n.distr,p=s._splits=s.splits(i,r,a,c,h,d,u),m=2==n.distr?p.map(e=>et[e]):p,f=2==n.distr?et[p[1]]-et[p[0]]:h,_=s._values=s.values(i,s.filter(i,m,r,d,f),r,d,f);s._rotate=2==o?s.rotate(i,_,r,d):0;let g=s._size;s._size=Wi(s.size(i,_,r,e)),null!=g&&s._size!=g&&(t=!1)}),t}function _t(e){let t=!0;return Fe.forEach((s,r)=>{let n=s(i,r,Le,e);n!=Ne[r]&&(t=!1),Ne[r]=n}),t}function gt(e){v.forEach((t,s)=>{s>0&&(t._paths=null,e&&(1==r?(t.min=null,t.max=null):t.facets.forEach(e=>{e.min=null,e.max=null})))})}let vt,bt,xt,yt,wt,$t,kt,Mt,At,St,Et,Ct,zt=!1,Pt=!1,Tt=[];function Dt(){Pt=!1;for(let e=0;e<Tt.length;e++)xs(...Tt[e]);Tt.length=0}function Bt(){zt||(Tr(qt),zt=!0)}function qt(){if(ge&&(!function(){for(let e in x){let t=x[e];null==P[e]&&(null==t.min||null!=P[w]&&t.auto(i,tt))&&(P[e]=lt)}for(let e in x){let t=x[e];null==P[e]&&null!=t.from&&null!=P[t.from]&&(P[e]=lt)}null!=P[w]&&gt(!0);let e={};for(let t in P){let s=P[t];if(null!=s){let n=e[t]=Cr(x[t],Ar);if(null!=s.min)zr(n,s);else if(t!=w||2==r)if(0==Re&&null==n.from){let e=n.range(i,null,null,t);n.min=e[0],n.max=e[1]}else n.min=er,n.max=-er}}if(Re>0){v.forEach((s,n)=>{if(1==r){let r=s.scale,o=P[r];if(null==o)return;let l=e[r];if(0==n){let e=l.range(i,l.min,l.max,r);l.min=e[0],l.max=e[1],Oe=Mi(l.min,t[0]),je=Mi(l.max,t[0]),je-Oe>1&&(t[0][Oe]<l.min&&Oe++,t[0][je]>l.max&&je--),s.min=et[Oe],s.max=et[je]}else s.show&&s.auto&&ot(l,o,s,t[n],s.sorted);s.idxs[0]=Oe,s.idxs[1]=je}else if(n>0&&s.show&&s.auto){let[i,r]=s.facets,o=i.scale,l=r.scale,[a,c]=t[n],h=e[o],d=e[l];null!=h&&ot(h,P[o],i,a,i.sorted),null!=d&&ot(d,P[l],r,c,r.sorted),s.min=r.min,s.max=r.max}});for(let t in e){let s=e[t],r=P[t];if(null==s.from&&(null==r||null==r.min)){let e=s.range(i,s.min==er?null:s.min,s.max==-er?null:s.max,t);s.min=e[0],s.max=e[1]}}}for(let t in e){let s=e[t];if(null!=s.from){let r=e[s.from];if(null==r.min)s.min=s.max=null;else{let e=s.range(i,r.min,r.max,t);s.min=e[0],s.max=e[1]}}}let s={},n=!1;for(let t in e){let i=e[t],r=x[t];if(r.min!=i.min||r.max!=i.max){r.min=i.min,r.max=i.max;let e=r.distr;r._min=3==e?Zi(r.min):4==e?Xi(r.min,r.asinh):100==e?r.fwd(r.min):r.min,r._max=3==e?Zi(r.max):4==e?Xi(r.max,r.asinh):100==e?r.fwd(r.max):r.max,s[t]=n=!0}}if(n){v.forEach((e,t)=>{2==r?t>0&&s.y&&(e._paths=null):s[e.scale]&&(e._paths=null)});for(let e in s)be=!0,xs("setScale",e);O&&N.left>=0&&(xe=we=!0)}for(let e in P)P[e]=null}(),ge=!1),be&&(!function(){let e=!1,t=0;for(;!e;){t++;let s=ft(t),r=_t(t);e=t==Me||s&&r,e||(ke(i.width,i.height),ve=!0)}}(),be=!1),ve){if(ui(p,Us,le),ui(p,Is,ae),ui(p,Os,ne),ui(p,js,oe),ui(m,Us,le),ui(m,Is,ae),ui(m,Os,ne),ui(m,js,oe),ui(u,Os,ie),ui(u,js,re),h.width=Ui(ie*ai),h.height=Ui(re*ai),b.forEach(({_el:e,_show:t,_size:s,_pos:i,side:r})=>{if(null!=e)if(t){let t=r%2==1;ui(e,t?"left":"top",i-(3===r||0===r?s:0)),ui(e,t?"width":"height",s),ui(e,t?"top":"left",t?ae:le),ui(e,t?"height":"width",t?oe:ne),di(e,Ns)}else hi(e,Ns)}),Ve=Ue=We=Qe=Ke=Ye=Ze=Je=Ge=null,Xe=1,ns(!0),le!=ce||ae!=he||ne!=de||oe!=ue){gt(!1);let e=ne/de,t=oe/ue;if(O&&!xe&&N.left>=0){N.left*=e,N.top*=t,xt&&_i(xt,Ui(N.left),0,ne,oe),yt&&_i(yt,0,Ui(N.top),ne,oe);for(let s=0;s<Pe.length;s++){let i=Pe[s];null!=i&&(Te[s]*=e,De[s]*=t,_i(i,Wi(Te[s]),Wi(De[s]),ne,oe))}}if(Ot.show&&!ye&&Ot.left>=0&&Ot.width>0){Ot.left*=e,Ot.width*=e,Ot.top*=t,Ot.height*=t;for(let e in as)ui(jt,e,Ot[e])}ce=le,he=ae,de=ne,ue=oe}xs("setSize"),ve=!1}ie>0&&re>0&&(d.clearRect(0,0,h.width,h.height),xs("drawClear"),k.forEach(e=>e()),xs("draw")),Ot.show&&ye&&(It(Ot),ye=!1),O&&xe&&(is(null,!0,!1),xe=!1),F.show&&F.live&&we&&(ts(),we=!1),a||(a=!0,i.status=1,xs("ready")),tt=!1,zt=!1}function Lt(e,s){let r=x[e];if(null==r.from){if(0==Re){let t=r.range(i,s.min,s.max,e);s.min=t[0],s.max=t[1]}if(s.min>s.max){let e=s.min;s.min=s.max,s.max=e}if(Re>1&&null!=s.min&&null!=s.max&&s.max-s.min<1e-16)return;e==w&&2==r.distr&&Re>0&&(s.min=Mi(s.min,t[0]),s.max=Mi(s.max,t[0]),s.min==s.max&&s.max++),P[e]=s,ge=!0,Bt()}}i.batch=function(e,t=!1){zt=!0,Pt=t,e(i),qt(),t&&Tt.length>0&&queueMicrotask(Dt)},i.redraw=(e,t)=>{be=t||!1,!1!==e?Vt(w,S.min,S.max):Bt()},i.setScale=Lt;let Ht=!1;const Ft=N.drag;let Nt=Ft.x,Rt=Ft.y;O&&(N.x&&(vt=mi("u-cursor-x",m)),N.y&&(bt=mi("u-cursor-y",m)),0==S.ori?(xt=vt,yt=bt):(xt=bt,yt=vt),Et=N.left,Ct=N.top);const Ot=i.select=zr({show:!0,over:!0,left:0,width:0,top:0,height:0},e.select),jt=Ot.show?mi("u-select",Ot.over?m:p):null;function It(e,t){if(Ot.show){for(let t in e)Ot[t]=e[t],t in as&&ui(jt,t,e[t]);!1!==t&&xs("setSelect")}}function Vt(e,t,s){Lt(e,{min:t,max:s})}function Ut(e,t,s,n){null!=t.focus&&function(e){if(e!=Qt){let t=null==e,s=1!=Ee.alpha;v.forEach((i,n)=>{if(1==r||n>0){let r=t||0==n||n==e;i._focus=t?null:r,s&&function(e,t){v[e].alpha=t,O&&null!=Pe[e]&&(Pe[e].style.opacity=t);R&&G[e]&&(G[e].style.opacity=t)}(n,r?1:Ee.alpha)}}),Qt=e,s&&Bt()}}(e),null!=t.show&&v.forEach((s,i)=>{i>0&&(e==i||null==e)&&(s.show=t.show,function(e){if(v[e].show)R&&di(G[e],Ns);else if(R&&hi(G[e],Ns),O){let t=ze?Pe[0]:Pe[e];null!=t&&_i(t,-10,-10,ne,oe)}}(i),2==r?(Vt(s.facets[0].scale,null,null),Vt(s.facets[1].scale,null,null)):Vt(s.scale,null,null),Bt())}),!1!==s&&xs("setSeries",e,t),n&&Ms("setSeries",i,e,t)}let Wt,Gt,Qt;i.setSelect=It,i.setSeries=Ut,i.addBand=function(e,t){e.fill=rr(e.fill||null),e.dir=Hi(e.dir,-1),t=null==t?y.length:t,y.splice(t,0,e)},i.setBand=function(e,t){zr(y[e],t)},i.delBand=function(e){null==e?y.length=0:y.splice(e,1)};const Kt={focus:!0};function Yt(e,t,s){let i=x[t];s&&(e=e/ai-(1==i.ori?ae:le));let r=ne;1==i.ori&&(r=oe,e=r-e),-1==i.dir&&(e=r-e);let n=i._min,o=n+(i._max-n)*(e/r),l=i.distr;return 3==l?Ki(10,o):4==l?((e,t=1)=>Oi.sinh(e)*t)(o,i.asinh):100==l?i.bwd(o):o}function Zt(e,t){ui(jt,Us,Ot.left=e),ui(jt,Os,Ot.width=t)}function Jt(e,t){ui(jt,Is,Ot.top=e),ui(jt,js,Ot.height=t)}R&&Ce&&te(Xs,I,e=>{N._lock||(Ae(e),null!=Qt&&Ut(null,Kt,!0,ws.setSeries))}),i.valToIdx=e=>Mi(e,t[0]),i.posToIdx=function(e,s){return Mi(Yt(e,w,s),t[0],Oe,je)},i.posToVal=Yt,i.valToPos=(e,t,s)=>0==x[t].ori?n(e,x[t],s?fe:ne,s?pe:0):o(e,x[t],s?_e:oe,s?me:0),i.setCursor=(e,t,s)=>{Et=e.left,Ct=e.top,is(null,t,s)};let Xt=0==S.ori?Zt:Jt,es=1==S.ori?Zt:Jt;function ts(e,t){if(null!=e&&(e.idxs?e.idxs.forEach((e,t)=>{H[t]=e}):(e=>void 0===e)(e.idx)||H.fill(e.idx),F.idx=H[0]),R&&F.live){for(let e=0;e<v.length;e++)(e>0||1==r&&!K)&&ss(e,H[e]);!function(){if(R&&F.live)for(let e=2==r?1:0;e<v.length;e++){if(0==e&&K)continue;let t=F.values[e],s=0;for(let i in t)Q[e][s++].firstChild.nodeValue=t[i]}}()}we=!1,!1!==t&&xs("setLegend")}function ss(e,s){let r,n=v[e],o=0==e&&2==E?et:t[e];K?r=n.values(i,e,s)??Y:(r=n.value(i,null==s?null:o[s],e,s),r=null==r?Y:{_:r}),F.values[e]=r}function is(e,s,n){let o;At=Et,St=Ct,[Et,Ct]=N.move(i,Et,Ct),N.left=Et,N.top=Ct,O&&(xt&&_i(xt,Ui(Et),0,ne,oe),yt&&_i(yt,0,Ui(Ct),ne,oe));let l=Oe>je;Wt=er,Gt=null;let a=0==S.ori?ne:oe,c=1==S.ori?ne:oe;if(Et<0||0==Re||l){o=N.idx=null;for(let e=0;e<v.length;e++){let t=Pe[e];null!=t&&_i(t,-10,-10,ne,oe)}Ce&&Ut(null,Kt,!0,null==e&&ws.setSeries),F.live&&(H.fill(o),we=!0)}else{let e,s,n;1==r&&(e=0==S.ori?Et:Ct,s=Yt(e,w),o=N.idx=Mi(s,t[0],Oe,je),n=C(t[0][o],S,a,0));let l=-10,h=-10,d=0,u=0,p=!0,m="",f="";for(let e=2==r?1:0;e<v.length;e++){let _=v[e],g=H[e],b=null==g?null:1==r?t[e][g]:t[e][1][g],y=N.dataIdx(i,e,o,s),w=null==y?null:1==r?t[e][y]:t[e][1][y];if(we=we||w!=b||y!=g,H[e]=y,e>0&&_.show){let s=null==y?-10:y==o?n:C(1==r?t[0][y]:t[e][0][y],S,a,0),g=null==w?-10:z(w,1==r?x[_.scale]:x[_.facets[1].scale],c,0);if(Ce&&null!=w){let t=1==S.ori?Et:Ct,s=Ii(Ee.dist(i,e,y,g,t));if(s<Wt){let i=Ee.bias;if(0!=i){let r=Yt(t,_.scale),n=r>=0?1:-1;n==(w>=0?1:-1)&&(1==n?1==i?w>=r:w<=r:1==i?w<=r:w>=r)&&(Wt=s,Gt=e)}else Wt=s,Gt=e}}if(we||ze){let t,r;0==S.ori?(t=s,r=g):(t=g,r=s);let n,o,a,c,_,v,b=!0,x=Se.bbox;if(null!=x){b=!1;let t=x(i,e);a=t.left,c=t.top,n=t.width,o=t.height}else a=t,c=r,n=o=Se.size(i,e);if(v=Se.fill(i,e),_=Se.stroke(i,e),ze)e==Gt&&Wt<=Ee.prox&&(l=a,h=c,d=n,u=o,p=b,m=v,f=_);else{let t=Pe[e];null!=t&&(Te[e]=a,De[e]=c,xi(t,n,o,b),vi(t,v,_),_i(t,Wi(a),Wi(c),ne,oe))}}}}if(ze){let e=Ee.prox;if(we||(null==Qt?Wt<=e:Wt>e||Gt!=Qt)){let e=Pe[0];null!=e&&(Te[0]=l,De[0]=h,xi(e,d,u,p),vi(e,m,f),_i(e,Wi(l),Wi(h),ne,oe))}}}if(Ot.show&&Ht)if(null!=e){let[t,s]=ws.scales,[i,r]=ws.match,[n,o]=e.cursor.sync.scales,l=e.cursor.drag;if(Nt=l._x,Rt=l._y,Nt||Rt){let l,h,d,u,p,{left:m,top:f,width:_,height:g}=e.select,v=e.scales[n].ori,b=e.posToVal,y=null!=t&&i(t,n),w=null!=s&&r(s,o);y&&Nt?(0==v?(l=m,h=_):(l=f,h=g),d=x[t],u=C(b(l,n),d,a,0),p=C(b(l+h,n),d,a,0),Xt(Gi(u,p),Ii(p-u))):Xt(0,a),w&&Rt?(1==v?(l=m,h=_):(l=f,h=g),d=x[s],u=z(b(l,o),d,c,0),p=z(b(l+h,o),d,c,0),es(Gi(u,p),Ii(p-u))):es(0,c)}else cs()}else{let e=Ii(At-wt),t=Ii(St-$t);if(1==S.ori){let s=e;e=t,t=s}Nt=Ft.x&&e>=Ft.dist,Rt=Ft.y&&t>=Ft.dist;let s,i,r=Ft.uni;null!=r?Nt&&Rt&&(Nt=e>=r,Rt=t>=r,Nt||Rt||(t>e?Rt=!0:Nt=!0)):Ft.x&&Ft.y&&(Nt||Rt)&&(Nt=Rt=!0),Nt&&(0==S.ori?(s=kt,i=Et):(s=Mt,i=Ct),Xt(Gi(s,i),Ii(i-s)),Rt||es(0,c)),Rt&&(1==S.ori?(s=kt,i=Et):(s=Mt,i=Ct),es(Gi(s,i),Ii(i-s)),Nt||Xt(0,a)),Nt||Rt||(Xt(0,0),es(0,0))}if(Ft._x=Nt,Ft._y=Rt,null==e){if(n){if(null!=$s){let[e,t]=ws.scales;ws.values[0]=null!=e?Yt(0==S.ori?Et:Ct,e):null,ws.values[1]=null!=t?Yt(1==S.ori?Et:Ct,t):null}Ms(Ks,i,Et,Ct,ne,oe,o)}if(Ce){let e=n&&ws.setSeries,t=Ee.prox;null==Qt?Wt<=t&&Ut(Gt,Kt,!0,e):Wt>t?Ut(null,Kt,!0,e):Gt!=Qt&&Ut(Gt,Kt,!0,e)}}we&&(F.idx=o,ts()),!1!==s&&xs("setCursor")}i.setLegend=ts;let rs=null;function ns(e=!1){e?rs=null:(rs=m.getBoundingClientRect(),xs("syncRect",rs))}function os(e,t,s,i,r,n,o){N._lock||Ht&&null!=e&&0==e.movementX&&0==e.movementY||(ls(e,t,s,i,r,n,o,!1,null!=e),null!=e?is(null,!0,!0):is(t,!0,!1))}function ls(e,t,s,r,n,o,a,c,h){if(null==rs&&ns(!1),Ae(e),null!=e)s=e.clientX-rs.left,r=e.clientY-rs.top;else{if(s<0||r<0)return Et=-10,void(Ct=-10);let[e,i]=ws.scales,a=t.cursor.sync,[c,h]=a.values,[d,u]=a.scales,[p,m]=ws.match,f=t.axes[0].side%2==1,_=0==S.ori?ne:oe,g=1==S.ori?ne:oe,v=f?o:n,b=f?n:o,y=f?r:s,w=f?s:r;if(s=null!=d?p(e,d)?l(c,x[e],_,0):-10:_*(y/v),r=null!=u?m(i,u)?l(h,x[i],g,0):-10:g*(w/b),1==S.ori){let e=s;s=r,r=e}}!h||null!=t&&t.cursor.event.type!=Ks||((s<=1||s>=ne-1)&&(s=ur(s,ne)),(r<=1||r>=oe-1)&&(r=ur(r,oe))),c?(wt=s,$t=r,[kt,Mt]=N.move(i,s,r)):(Et=s,Ct=r)}Object.defineProperty(i,"rect",{get:()=>(null==rs&&ns(!1),rs)});const as={width:0,height:0,left:0,top:0};function cs(){It(as,!1)}let hs,ds,us,ps;function ms(e,t,s,r,n,o,l){Ht=!0,Nt=Rt=Ft._x=Ft._y=!1,ls(e,t,s,r,n,o,0,!0,!1),null!=e&&(te(Zs,ni,fs,!1),Ms(Ys,i,kt,Mt,ne,oe,null));let{left:a,top:c,width:h,height:d}=Ot;hs=a,ds=c,us=h,ps=d}function fs(e,t,s,r,n,o,l){Ht=Ft._x=Ft._y=!1,ls(e,t,s,r,n,o,0,!1,!0);let{left:a,top:c,width:h,height:d}=Ot,u=h>0||d>0,p=hs!=a||ds!=c||us!=h||ps!=d;if(u&&p&&It(Ot),Ft.setScale&&u&&p){let e=a,t=h,s=c,i=d;if(1==S.ori&&(e=c,t=d,s=a,i=h),Nt&&Vt(w,Yt(e,w),Yt(e+t,w)),Rt)for(let e in x){let t=x[e];e!=w&&null==t.from&&t.min!=er&&Vt(e,Yt(s+i,e),Yt(s,e))}cs()}else N.lock&&(N._lock=!N._lock,is(t,!0,null!=e));null!=e&&(se(Zs,ni),Ms(Zs,i,Et,Ct,ne,oe,null))}function _s(e,t,s,r,n,o,l){N._lock||(Ae(e),it(),cs(),null!=e&&Ms(ei,i,Et,Ct,ne,oe,null))}function gs(){b.forEach(Ro),$e(i.width,i.height,!0)}$i(si,oi,gs);const vs={};vs.mousedown=ms,vs.mousemove=os,vs.mouseup=fs,vs.dblclick=_s,vs.setSeries=(e,t,s,r)=>{-1!=(s=(0,ws.match[2])(i,t,s))&&Ut(s,r,!0,!1)},O&&(te(Ys,m,ms),te(Ks,m,os),te(Js,m,e=>{Ae(e),ns(!1)}),te(Xs,m,function(e,t,s,i,r,n,o){if(N._lock)return;Ae(e);let l=Ht;if(Ht){let e,t,s=!0,i=!0,r=10;0==S.ori?(e=Nt,t=Rt):(e=Rt,t=Nt),e&&t&&(s=Et<=r||Et>=ne-r,i=Ct<=r||Ct>=oe-r),e&&s&&(Et=Et<kt?0:ne),t&&i&&(Ct=Ct<Mt?0:oe),is(null,!0,!0),Ht=!1}Et=-10,Ct=-10,H.fill(null),is(null,!0,!0),l&&(Ht=l)}),te(ei,m,_s),Mo.add(i),i.syncRect=ns);const bs=i.hooks=e.hooks||{};function xs(e,t,s){Pt?Tt.push([e,t,s]):e in bs&&bs[e].forEach(e=>{e.call(null,i,t,s)})}(e.plugins||[]).forEach(e=>{for(let t in e.hooks)bs[t]=(bs[t]||[]).concat(e.hooks[t])});const ys=(e,t,s)=>s,ws=zr({key:null,setSeries:!1,filters:{pub:ar,sub:ar},scales:[w,v[1]?v[1].scale:null],match:[cr,cr,ys],values:[null,null]},N.sync);2==ws.match.length&&ws.match.push(ys),N.sync=ws;const $s=ws.key,ks=Jn($s);function Ms(e,t,s,i,r,n,o){ws.filters.pub(e,t,s,i,r,n,o)&&ks.pub(e,t,s,i,r,n,o)}function As(){xs("init",e,t),st(t||e.data,!1),P[w]?Lt(w,P[w]):it(),ye=Ot.show&&(Ot.width>0||Ot.height>0),xe=we=!0,$e(e.width,e.height)}return ks.sub(i),i.pub=function(e,t,s,i,r,n,o){ws.filters.sub(e,t,s,i,r,n,o)&&vs[e](null,t,s,i,r,n,o)},i.destroy=function(){ks.unsub(i),Mo.delete(i),ee.clear(),ki(si,oi,gs),c.remove(),I?.remove(),xs("destroy")},v.forEach(qe),b.forEach(function(e,t){if(e._show=e.show,e.show){let s=e.side%2,r=x[e.scale];null==r&&(e.scale=s?v[1].scale:w,r=x[e.scale]);let n=r.time;e.size=rr(e.size),e.space=rr(e.space),e.rotate=rr(e.rotate),wr(e.incrs)&&e.incrs.forEach(e=>{!_r.has(e)&&_r.set(e,gr(e))}),e.incrs=rr(e.incrs||(2==r.distr?Gr:n?1==g?ln:hn:Qr)),e.splits=rr(e.splits||(n&&1==r.distr?B:3==r.distr?Dn:4==r.distr?Bn:Tn)),e.stroke=rr(e.stroke),e.grid.stroke=rr(e.grid.stroke),e.ticks.stroke=rr(e.ticks.stroke),e.border.stroke=rr(e.border.stroke);let o=e.values;e.values=wr(o)&&!wr(o[0])?rr(o):n?wr(o)?mn(T,pn(o,D)):kr(o)?function(e,t){let s=Or(t);return(t,i,r,n,o)=>i.map(t=>s(e(t)))}(T,o):o||q:o||Pn,e.filter=rr(e.filter||(r.distr>=3&&10==r.log?Rn:3==r.distr&&2==r.log?On:or)),e.font=No(e.font),e.labelFont=No(e.labelFont),e._size=e.size(i,null,t,0),e._space=e._rotate=e._incrs=e._found=e._splits=e._values=null,e._size>0&&(Le[t]=!0,e._el=mi("u-axis",u))}}),s?s instanceof HTMLElement?(s.appendChild(c),As()):s(i,As):As(),i}Oo.assign=zr,Oo.fmtNum=Ri,Oo.rangeNum=Li,Oo.rangeLog=Pi,Oo.rangeAsinh=Ti,Oo.orient=Xn,Oo.pxRatio=ai,Oo.join=function(e,t){if(function(e){let t=e[0][0],s=t.length;for(let i=1;i<e.length;i++){let r=e[i][0];if(r.length!=s)return!1;if(r!=t)for(let e=0;e<s;e++)if(r[e]!=t[e])return!1}return!0}(e)){let t=e[0].slice();for(let s=1;s<e.length;s++)t.push(...e[s].slice(1));return function(e,t=100){const s=e.length;if(s<=1)return!0;let i=0,r=s-1;for(;i<=r&&null==e[i];)i++;for(;r>=i&&null==e[r];)r--;if(r<=i)return!0;const n=Qi(1,Vi((r-i+1)/t));for(let t=e[i],s=i+n;s<=r;s+=n){const i=e[s];if(null!=i){if(i<=t)return!1;t=i}}return!0}(t[0])||(t=function(e){let t=e[0],s=t.length,i=Array(s);for(let e=0;e<i.length;e++)i[e]=e;i.sort((e,s)=>t[e]-t[s]);let r=[];for(let t=0;t<e.length;t++){let n=e[t],o=Array(s);for(let e=0;e<s;e++)o[e]=n[i[e]];r.push(o)}return r}(t)),t}let s=new Set;for(let t=0;t<e.length;t++){let i=e[t][0],r=i.length;for(let e=0;e<r;e++)s.add(i[e])}let i=[Array.from(s).sort((e,t)=>e-t)],r=i[0].length,n=new Map;for(let e=0;e<r;e++)n.set(i[0][e],e);for(let s=0;s<e.length;s++){let o=e[s],l=o[0];for(let e=1;e<o.length;e++){let a=o[e],c=Array(r).fill(void 0),h=t?t[s][e]:1,d=[];for(let e=0;e<a.length;e++){let t=a[e],s=n.get(l[e]);null===t?0!=h&&(c[s]=t,2==h&&d.push(s)):c[s]=t}Pr(c,d,r),i.push(c)}}return i},Oo.fmtDate=Or,Oo.tzDate=function(e,t){let s;return"UTC"==t||"Etc/UTC"==t?s=new Date(+e+6e4*e.getTimezoneOffset()):t==jr?s=e:(s=new Date(e.toLocaleString("en-US",{timeZone:t})),s.setMilliseconds(e.getMilliseconds())),s},Oo.sync=Jn;{Oo.addGap=function(e,t,s){let i=e[e.length-1];i&&i[0]==t?i[1]=s:e.push([t,s])},Oo.clipGaps=io;let e=Oo.paths={points:vo};e.linear=wo,e.stepped=function(e){const t=Hi(e.align,1),s=Hi(e.ascDesc,!1),i=Hi(e.alignGaps,0),r=Hi(e.extend,!1);return(e,n,o,l)=>Xn(e,n,(a,c,h,d,u,p,m,f,_,g,v)=>{[o,l]=Ci(h,o,l);let b=a.pxRound,{left:x,width:y}=e.bbox,w=e=>b(p(e,d,g,f)),$=e=>b(m(e,u,v,_)),k=0==d.ori?co:ho;const M={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},A=M.stroke,S=d.dir*(0==d.ori?1:-1);let E=$(h[1==S?o:l]),C=w(c[1==S?o:l]),z=C,P=C;r&&-1==t&&(P=x,k(A,P,E)),k(A,C,E);for(let e=1==S?o:l;e>=o&&e<=l;e+=S){let s=h[e];if(null==s)continue;let i=w(c[e]),r=$(s);1==t?k(A,i,E):k(A,z,r),k(A,i,r),E=r,z=i}let T=z;r&&1==t&&(T=x+y,k(A,T,E));let[D,B]=eo(e,n);if(null!=a.fill||0!=D){let t=M.fill=new Path2D(A),s=$(a.fillTo(e,n,a.min,a.max,D));k(t,T,s),k(t,P,s)}if(!a.spanGaps){let r=[];r.push(...ro(c,h,o,l,S,w,i));let u=a.width*ai/2,p=s||1==t?u:-u,m=s||-1==t?-u:u;r.forEach(e=>{e[0]+=p,e[1]+=m}),M.gaps=r=a.gaps(e,n,o,l,r),M.clip=io(r,d.ori,f,_,g,v)}return 0!=B&&(M.band=2==B?[so(e,n,o,l,A,-1),so(e,n,o,l,A,1)]:so(e,n,o,l,A,B)),M})},e.bars=function(e){const t=Hi((e=e||br).size,[.6,er,1]),s=e.align||0,i=e.gap||0;let r=e.radius;r=null==r?[0,0]:"number"==typeof r?[r,0]:r;const n=rr(r),o=1-t[0],l=Hi(t[1],er),a=Hi(t[2],1),c=Hi(e.disp,br),h=Hi(e.each,e=>{}),{fill:d,stroke:u}=c;return(e,t,r,p)=>Xn(e,t,(m,f,_,g,v,b,x,y,w,$,k)=>{let M,A,S=m.pxRound,E=s,C=i*ai,z=l*ai,P=a*ai;0==g.ori?[M,A]=n(e,t):[A,M]=n(e,t);const T=g.dir*(0==g.ori?1:-1);let D,B,q,L=0==g.ori?uo:po,H=0==g.ori?h:(e,t,s,i,r,n,o)=>{h(e,t,s,r,i,o,n)},F=Hi(e.bands,xr).find(e=>e.series[0]==t),N=null!=F?F.dir:0,R=m.fillTo(e,t,m.min,m.max,N),O=S(x(R,v,k,w)),j=$,I=S(m.width*ai),V=!1,U=null,W=null,G=null,Q=null;null==d||0!=I&&null==u||(V=!0,U=d.values(e,t,r,p),W=new Map,new Set(U).forEach(e=>{null!=e&&W.set(e,new Path2D)}),I>0&&(G=u.values(e,t,r,p),Q=new Map,new Set(G).forEach(e=>{null!=e&&Q.set(e,new Path2D)})));let{x0:K,size:Y}=c;if(null!=K&&null!=Y){E=1,f=K.values(e,t,r,p),2==K.unit&&(f=f.map(t=>e.posToVal(y+t*$,g.key,!0)));let s=Y.values(e,t,r,p);B=2==Y.unit?s[0]*$:b(s[0],g,$,y)-b(0,g,$,y),j=$o(f,_,b,g,$,y,j),q=j-B+C}else j=$o(f,_,b,g,$,y,j),q=j*o+C,B=j-q;q<1&&(q=0),I>=B/2&&(I=0),q<5&&(S=nr);let Z=q>0;B=S(sr(j-q-(Z?I:0),P,z)),D=(0==E?B/2:E==T?0:B)-E*T*((0==E?C/2:0)+(Z?I/2:0));const J={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},X=V?null:new Path2D;let ee=null;if(null!=F)ee=e.data[F.series[1]];else{let{y0:s,y1:i}=c;null!=s&&null!=i&&(_=i.values(e,t,r,p),ee=s.values(e,t,r,p))}let te=M*B,se=A*B;for(let s=1==T?r:p;s>=r&&s<=p;s+=T){let i=_[s];if(null==i)continue;if(null!=ee){let e=ee[s]??0;if(i-e==0)continue;O=x(e,v,k,w)}let r=b(2!=g.distr||null!=c?f[s]:s,g,$,y),n=x(Hi(i,R),v,k,w),o=S(r-D),l=S(Qi(n,O)),a=S(Gi(n,O)),h=l-a;if(null!=i){let r=i<0?se:te,n=i<0?te:se;V?(I>0&&null!=G[s]&&L(Q.get(G[s]),o,a+Vi(I/2),B,Qi(0,h-I),r,n),null!=U[s]&&L(W.get(U[s]),o,a+Vi(I/2),B,Qi(0,h-I),r,n)):L(X,o,a+Vi(I/2),B,Qi(0,h-I),r,n),H(e,t,s,o-I/2,a,B+I,h)}}return I>0?J.stroke=V?Q:X:V||(J._fill=0==m.width?m._fill:m._stroke??m._fill,J.width=0),J.fill=V?W:X,J})},e.spline=function(e){return function(e,t){const s=Hi(t?.alignGaps,0);return(t,i,r,n)=>Xn(t,i,(o,l,a,c,h,d,u,p,m,f,_)=>{[r,n]=Ci(a,r,n);let g,v,b,x=o.pxRound,y=e=>x(d(e,c,f,p)),w=e=>x(u(e,h,_,m));0==c.ori?(g=lo,b=co,v=_o):(g=ao,b=ho,v=go);const $=c.dir*(0==c.ori?1:-1);let k=y(l[1==$?r:n]),M=k,A=[],S=[];for(let e=1==$?r:n;e>=r&&e<=n;e+=$)if(null!=a[e]){let t=y(l[e]);A.push(M=t),S.push(w(a[e]))}const E={stroke:e(A,S,g,b,v,x),fill:null,clip:null,band:null,gaps:null,flags:1},C=E.stroke;let[z,P]=eo(t,i);if(null!=o.fill||0!=z){let e=E.fill=new Path2D(C),s=w(o.fillTo(t,i,o.min,o.max,z));b(e,M,s),b(e,k,s)}if(!o.spanGaps){let e=[];e.push(...ro(l,a,r,n,$,y,s)),E.gaps=e=o.gaps(t,i,r,n,e),E.clip=io(e,c.ori,p,m,f,_)}return 0!=P&&(E.band=2==P?[so(t,i,r,n,C,-1),so(t,i,r,n,C,1)]:so(t,i,r,n,C,P)),E})}(ko,e)}}const jo=l`
  .chart-container {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    gap: 4px 16px;
    font-size: 12px;
    max-height: var(--legend-max-height, 160px);
    overflow-y: auto;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    min-width: 0;
  }
  .legend-item.hidden,
  tr.hidden {
    opacity: 0.4;
  }
  .legend-color {
    width: 14px;
    height: 4px;
    border-radius: 2px;
    flex-shrink: 0;
  }
  .legend-name {
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .legend-value {
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .legend-stat {
    font-weight: 400;
    color: var(--secondary-text-color);
  }
  .legend-table-wrap {
    flex-shrink: 0;
    max-height: var(--legend-max-height, 200px);
    overflow: auto;
  }
  table.legend-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .legend-table th {
    text-align: right;
    font-weight: 500;
    color: var(--secondary-text-color);
    padding: 2px 6px;
    white-space: nowrap;
  }
  .legend-table th:first-child,
  .legend-table td:first-child {
    text-align: left;
  }
  .legend-table td {
    padding: 2px 6px;
    text-align: right;
    white-space: nowrap;
    border-top: 1px solid var(--divider-color);
  }
  .legend-table tr {
    cursor: pointer;
  }
  .legend-table .name-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 260px;
  }
  .legend-table .name-cell span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .uplot {
    font-family: inherit;
  }
  .uplot .u-legend {
    display: none; /* own legend */
  }
`;function Io(e){let t=null,s=null,i=0,r=0,n=null;for(const o of e)null!==o&&(t=null===t?o:Math.min(t,o),s=null===s?o:Math.max(s,o),i+=o,r++,n=o);return{last:n,min:t,max:s,mean:r?i/r:null}}const Vo=new Set(["bytes","bits","kbytes","mbytes","gbytes","binBps","binbps","KiBs","MiBs"]);function Uo(e,t=5,s=1e3){if(!(e>0&&Number.isFinite(e)))return 1;if(1024===s&&e/t>=1024){const s=Math.floor(Math.log(e/t)/Math.log(1024)),i=Math.pow(1024,s);return Uo(e/i,t)*i}const i=e/t,r=Math.pow(10,Math.floor(Math.log10(i))),n=i/r;return(n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*r}let Wo=class extends Ps{_queryMode(){return"range"}_defaults(){return{time_range:"1h",show_legend:!0,show_current:!1,legend_mode:"list",fill:!1,fill_opacity:20,line_width:2,stacked:!1,show_x_axis:!0,show_y_axis:!0,show_grid:!0,palette:"classic",threshold_style:"off",refresh_interval:30}}_options(e,t){return t.map(t=>({value:t,label:Xe(`${e}${t}`,this.hass)}))}_sections(){const e=this._config,t=e?.fill||e?.stacked,s="table"===e?.legend_mode,i=!1!==e?.show_legend,r=!e?.card_height,n=i?[{name:"legend_mode",selector:{select:{mode:"dropdown",options:this._options("legend_mode_",["list","table"])}}},{name:"show_current",selector:{boolean:{}}}]:[];return[rs(),ns({},ss,is),os(as,ls,hs(this.hass),{name:"line_width",selector:{number:{min:.5,max:10,step:.5,mode:"slider",unit_of_measurement:"px"}}},{name:"fill",selector:{boolean:{}}},{name:"stacked",selector:{boolean:{}}},...t?[{name:"fill_opacity",selector:{number:{min:0,max:100,step:5,mode:"slider",unit_of_measurement:"%"}}}]:[],{name:"min",selector:{number:{mode:"box",step:"any"}}},{name:"max",selector:{number:{mode:"box",step:"any"}}},{name:"show_x_axis",selector:{boolean:{}}},{name:"show_y_axis",selector:{boolean:{}}},{name:"show_grid",selector:{boolean:{}}},...r?[{name:"height",selector:{number:{min:60,max:1e3,mode:"box",unit_of_measurement:"px"}}}]:[],{name:"show_legend",selector:{boolean:{}}},...n,{name:"threshold_style",selector:{select:{mode:"dropdown",options:this._options("threshold_style_",["off","line","area"])}}}),...i&&s?[{schema:[{name:"legend_values",selector:{select:{multiple:!0,mode:"list",options:this._options("legend_value_",["last","min","max","mean"])}}}]}]:[]]}};Wo=e([ue("prometheus-timeseries-card-editor")],Wo);let Go=class extends tt{constructor(){super(...arguments),this._data={times:[],series:[]},this._cursorIdx=null,this._hidden=new Set,this._chartSignature=""}static get styles(){return[Ye,l`${o('.uplot, .uplot *, .uplot *::before, .uplot *::after {box-sizing: border-box;}.uplot {font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";line-height: 1.5;width: min-content;}.u-title {text-align: center;font-size: 18px;font-weight: bold;}.u-wrap {position: relative;user-select: none;}.u-over, .u-under {position: absolute;}.u-under {overflow: hidden;}.uplot canvas {display: block;position: relative;width: 100%;height: 100%;}.u-axis {position: absolute;}.u-legend {font-size: 14px;margin: auto;text-align: center;}.u-inline {display: block;}.u-inline * {display: inline-block;}.u-inline tr {margin-right: 16px;}.u-legend th {font-weight: 600;}.u-legend th > * {vertical-align: middle;display: inline-block;}.u-legend .u-marker {width: 1em;height: 1em;margin-right: 4px;background-clip: padding-box !important;}.u-inline.u-live th::after {content: ":";vertical-align: middle;}.u-inline:not(.u-live) .u-value {display: none;}.u-series > * {padding: 4px;}.u-series th {cursor: pointer;}.u-legend .u-off > * {opacity: 0.3;}.u-select {background: rgba(0,0,0,0.07);position: absolute;pointer-events: none;}.u-cursor-x, .u-cursor-y {position: absolute;left: 0;top: 0;pointer-events: none;will-change: transform;}.u-hz .u-cursor-x, .u-vt .u-cursor-y {height: 100%;border-right: 1px dashed #607D8B;}.u-hz .u-cursor-y, .u-vt .u-cursor-x {width: 100%;border-bottom: 1px dashed #607D8B;}.u-cursor-pt {position: absolute;top: 0;left: 0;border-radius: 50%;border: 0 solid;pointer-events: none;will-change: transform;/*this has to be !important since we set inline "background" shorthand */background-clip: padding-box !important;}.u-axis.u-off, .u-select.u-off, .u-cursor-x.u-off, .u-cursor-y.u-off, .u-cursor-pt.u-off {display: none;}')}`,jo]}static getStubConfig(){return{type:"custom:prometheus-timeseries-card",title:"Scrape duration",query:"scrape_duration_seconds",legend_format:"{{job}}",time_range:"1h",unit:"s"}}static getConfigElement(){return document.createElement("prometheus-timeseries-card-editor")}setConfig(e){super.setConfig(e),this._destroyChart()}_defaultColumns(){return 12}getCardSize(){return this._config?.card_height?super.getCardSize():Math.ceil(((this._config?.height||200)+100)/50)}disconnectedCallback(){super.disconnectedCallback(),this._destroyChart()}updated(e){if(super.updated(e),!this._data.times.length||!this._chartContainer)return;const t=this._data.series.map(e=>`${e.key}|${e.color}`).join(",");this._chart&&t===this._chartSignature?(e.has("_data")||e.has("_hidden"))&&(this._chart.setData(this._aligned()),this._data.series.forEach((e,t)=>this._chart.setSeries(t+1,{show:!this._hidden.has(e.key)}))):(this._destroyChart(),this._chartSignature=t,this._initChart())}_aligned(){return function(e,t,s){const i=t?function(e,t){const s=[];return e.map(e=>t.has(e.key)?e.values.map(()=>null):e.values.map((e,t)=>(s[t]=(s[t]||0)+(e??0),null===e?null:s[t])))}(e.series,s):e.series.map(e=>e.values);return[e.times,...i]}(this._data,Boolean(this._config.stacked),this._hidden)}_destroyChart(){this._resizeObserver?.disconnect(),this._resizeObserver=void 0,this._chart?.destroy(),this._chart=void 0,this._chartSignature=""}_cssVar(e,t){return getComputedStyle(this).getPropertyValue(e).trim()||t}_fmt(e){return null==e?"-":$t(e,this._config.decimals,this._config.unit)}_chartHeight(){return this._fixedHeight()&&this._chartContainer?Math.max(60,Math.floor(this._chartContainer.clientHeight)):this._config.height||200}_dataExtent(e){let t=null,s=null;for(let i=1;i<e.length;i++)for(const r of e[i])null!=r&&(t=null===t?r:Math.min(t,r),s=null===s?r:Math.max(s,r));return[t,s]}_drawThresholds(e){const t=this._config,s=t.threshold_style||"off",i=[...t.thresholds||[]].sort((e,t)=>e.value-t.value);if("off"===s||!i.length)return;const r=e.ctx,{left:n,top:o,width:l,height:a}=e.bbox;r.save(),r.beginPath(),r.rect(n,o,l,a),r.clip(),i.forEach((t,a)=>{const c=zt(t);if(!c||"transparent"===c)return;const h=e.valToPos(t.value,"y",!0);if("area"===s){const t=i[a+1],s=t?e.valToPos(t.value,"y",!0):o;r.fillStyle=Tt(c,.12),r.fillRect(n,Math.min(h,s),l,Math.abs(h-s))}else(a>0||1===i.length)&&(r.strokeStyle=c,r.lineWidth=devicePixelRatio||1,r.setLineDash([6*(devicePixelRatio||1),4*(devicePixelRatio||1)]),r.beginPath(),r.moveTo(n,h),r.lineTo(n+l,h),r.stroke())}),r.restore()}_initChart(){if(!this._chartContainer||!this._config)return;const e=this._config,t=this._chartContainer.clientWidth||400,s=this._chartHeight(),i=this._cssVar("--secondary-text-color","#888"),r=this._cssVar("--divider-color","rgba(127,127,127,0.2)"),n=e.line_width??2,o=e.fill||e.stacked,l=Math.max(0,Math.min(100,e.fill_opacity??20))/100,a=!1!==e.show_x_axis,c=!1!==e.show_y_axis,h=!1!==e.show_grid?{stroke:r,width:1}:{show:!1},d=this._hass?.locale?.language,u=(p=e.unit)&&Vo.has(p)?1024:1e3;var p;const m=[{}];this._data.series.forEach(e=>{m.push({label:e.label,stroke:e.color,width:n,fill:o?Tt(e.color,l):void 0,spanGaps:!0,show:!this._hidden.has(e.key),points:{show:!1}})});const f=[{show:a,stroke:i,grid:h,ticks:{show:!1},size:24,space:70,values:(e,t)=>{const s=(e.scales.x.max??0)-(e.scales.x.min??0);return t.map(e=>null==e?"":qt(e,s,d))}},{show:c,stroke:i,grid:h,ticks:{show:!1},size:(e,t)=>{const s=(t||[]).reduce((e,t)=>Math.max(e,String(t??"").length),0);return Math.max(36,Math.min(110,7*s+14))},splits:(e,t,s,i)=>function(e,t,s=5,i=1e3){const r=Uo(t-e,s,i),n=[],o=Math.ceil(e/r-1e-9)*r;Math.abs(o-e)>1e-6*r&&n.push(e);for(let e=o;e<=t+1e-6*r&&n.length<50;e+=r)n.push(Math.abs(e)<1e-9*r?0:e);return n}(s,i,Math.max(2,Math.round(this._chartHeight()/45)),u),values:(e,t)=>t.map(e=>null==e?"":this._fmt(e))}],_={width:t,height:s,series:m,axes:f,legend:{show:!1},padding:[8,8,a?0:8,c?0:8],scales:{x:{time:!0},y:{range:t=>{const[s,i]=this._dataExtent(t.data),r=Math.max(2,Math.round(this._chartHeight()/45));return function(e,t,s){let i=e??0,r=t??1;if(s.stacked&&(i=Math.min(0,i)),void 0!==s.min&&null!==s.min&&(i=s.min),void 0!==s.max&&null!==s.max&&(r=s.max),r<i&&([i,r]=[r,i]),r===i){const e=.1*Math.abs(r)||1;void 0!==s.min&&null!==s.min||(i-=e),void 0!==s.max&&null!==s.max||(r+=e)}const n=Uo(r-i,s.ticks??5,s.base);return void 0!==s.min&&null!==s.min||(i=i>=0&&i<=.5*(r-i)?0:Math.floor(i/n)*n),void 0!==s.max&&null!==s.max||(r=Math.ceil(r/n)*n,r===i&&(r=i+n)),[i,r]}(s,i,{min:e.min,max:e.max,stacked:e.stacked,ticks:r,base:u})}}},cursor:{points:{size:6}},hooks:{setCursor:[e=>this._cursorIdx=e.cursor.idx??null],drawClear:[e=>this._drawThresholds(e)]}};this._chart=new Oo(_,this._aligned(),this._chartContainer),this._resizeObserver=new ResizeObserver(e=>{for(const t of e)if(t.target===this._chartContainer&&this._chart&&t.contentRect.width>0){const e={width:Math.floor(t.contentRect.width),height:this._chartHeight()};e.width===this._chart.width&&e.height===this._chart.height||this._chart.setSize(e)}}),this._resizeObserver.observe(this._chartContainer)}async _fetchData(){const e=this._config;try{this._loading=!0;const t=Bt(e.time_range||"1h"),s=e.step?String(e.step):t.step,i=await this._client.rangeQuery(e.query,t.start,t.end,s);this._data=function(e,t,s){const i=Nt(e,t).slice(0,Lt),r=new Set;i.forEach(e=>e.points.forEach(([e])=>r.add(e)));const n=Array.from(r).sort((e,t)=>e-t),o=i.map((e,t)=>{const r=new Map(e.points),o=n.map(e=>r.has(e)?r.get(e):null),l=e.label||`Series ${t+1}`;return{key:`${t}:${l}`,label:l,color:jt(t,i.length,s),values:o,stats:Io(o)}});return{times:n,series:o}}(i,e.legend_format,e.palette),this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1}}_toggle(e,t){const s=new Set(this._hidden),i=this._data.series.map(e=>e.key);if(t.ctrlKey||t.metaKey||t.shiftKey)s.has(e)?s.delete(e):s.add(e);else{const t=s.size===i.length-1&&!s.has(e);s.clear(),t||i.filter(t=>t!==e).forEach(e=>s.add(e))}this._hidden=s}_current(e){return null!==this._cursorIdx?e.values[this._cursorIdx]??null:e.stats.last}_showCurrent(){return!0===this._config.show_current}render(){if(!this._hasQuery())return this.renderPlaceholder();const e=this._config,t=this._data.times.length>0,s=this._fixedHeight();let i=Q;this._error?i=U`<div class="error-state">${this._error}</div>`:t||(i=this._loading?U`<div class="loading-state"></div>`:U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`);const r=s?"":`height: ${t?e.height||200:0}px`;return U`
      <ha-card>
        ${this.renderHeader()}
        <div class="chart-container ${s?"fill":""}" style=${r}></div>
        ${i}
        ${!1!==e.show_legend&&t?this._renderLegend():Q}
      </ha-card>
    `}_renderLegendTable(e){const t=this._showCurrent();return U`
      <div class="legend-table-wrap">
        <table class="legend-table">
          <thead>
            <tr>
              <th></th>
              ${e.map(e=>U`<th>${Xe(`legend_value_${e}`,this._hass)}</th>`)}
              ${t?U`<th>${Xe("current",this._hass)}</th>`:Q}
            </tr>
          </thead>
          <tbody>
            ${this._data.series.map(s=>U`
                <tr class=${this._hidden.has(s.key)?"hidden":""} @click=${e=>this._toggle(s.key,e)}>
                  <td>
                    <div class="name-cell" title=${s.label}>
                      <span class="legend-color" style="background:${s.color}"></span><span>${s.label}</span>
                    </div>
                  </td>
                  ${e.map(e=>U`<td>${this._fmt(s.stats[e])}</td>`)}
                  ${t?U`<td>${this._fmt(this._current(s))}</td>`:Q}
                </tr>
              `)}
          </tbody>
        </table>
      </div>
    `}_renderLegend(){return"table"===this._config.legend_mode?this._renderLegendTable(this._config.legend_values||[]):U`
      <div class="legend">
        ${this._data.series.map(e=>U`
            <div
              class="legend-item ${this._hidden.has(e.key)?"hidden":""}"
              title=${e.label}
              @click=${t=>this._toggle(e.key,t)}
            >
              <div class="legend-color" style="background-color: ${e.color}"></div>
              <span class="legend-name">${e.label}</span>
              ${this._showCurrent()?U`<span class="legend-value">${this._fmt(this._current(e))}</span>`:Q}
            </div>
          `)}
      </div>
    `}};e([_e()],Go.prototype,"_data",void 0),e([_e()],Go.prototype,"_cursorIdx",void 0),e([_e()],Go.prototype,"_hidden",void 0),e([ge(".chart-container")],Go.prototype,"_chartContainer",void 0),Go=e([ue("prometheus-timeseries-card")],Go);const Qo=l`
  .body {
    display: flex;
    flex-direction: column;
  }
  /* ---- horizontal ---- */
  .bars-horizontal {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  /* auto bar height: rows share the panel height (fixed-height panel), 24px otherwise */
  .body.fill .bars-horizontal.auto {
    flex: 1 1 auto;
    min-height: 0;
  }
  .body.fill .bars-horizontal.auto .bar-row {
    flex: 1 1 0;
    min-height: 8px;
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
  .track {
    position: relative;
    border-radius: 4px;
    background: var(--secondary-background-color, rgba(100, 100, 100, 0.2));
  }
  .track.clear {
    background: transparent;
  }
  .row-track {
    flex-grow: 1;
    height: var(--bar-h, 24px);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .body.fill .bars-horizontal.auto .row-track {
    height: 100%;
    max-height: 64px;
  }
  .row-track.with-end {
    --end-w: 76px;
    overflow: visible;
  }
  .row-track .bar-fill {
    height: 100%;
    flex-shrink: 0;
    transition: width 0.3s ease-out;
  }
  .bar-fill {
    border-radius: 4px;
  }
  .end-value {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
  .bar-value {
    min-width: 60px;
    flex-shrink: 0;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
  }
  /* ---- vertical ---- */
  .bars-vertical {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    height: 200px;
    justify-content: space-around;
  }
  .body.fill .bars-vertical {
    flex: 1 1 auto;
    height: auto;
    min-height: 0;
  }
  .bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    height: 100%;
    min-width: 0;
  }
  .bar-col-value {
    font-size: 12px;
    font-weight: 500;
  }
  .col-track {
    width: 100%;
    max-width: 40px;
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
  }
  .col-track .bar-fill {
    width: 100%;
    transition: height 0.3s ease-out;
  }
  .col-track .end-value {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -4px);
    font-size: 12px;
  }
  .bar-col-label {
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }
`;function Ko(e,t,s,i){if(!e||e.length<2||s<=0||!(t>0))return null;const r=[...e].sort((e,t)=>e.value-t.value),n=r.map((e,s)=>`${zt(e)||At[0]} ${0===s?0:(e=>Math.max(0,Math.min(100,e/t*100)))(e.value).toFixed(2)}%`),o=`${(100/s*100).toFixed(2)}%`;return i?`linear-gradient(0deg, ${n.join(", ")}) left bottom / 100% ${o} no-repeat`:`linear-gradient(90deg, ${n.join(", ")}) left top / ${o} 100% no-repeat`}function Yo(e,t){return Math.min(100,Math.max(0,e/t*100))}let Zo=class extends Ps{_defaults(){return{orientation:"horizontal",show_values:!0,transparent_track:!1,value_at_end:!1,gradient:!1,refresh_interval:30,sort:"desc",palette:"classic",color_mode:"thresholds"}}_options(e,t){return t.map(t=>({value:t,label:Xe(`${e}${t}`,this.hass)}))}_sections(){const e=this._config,t="vertical"!==e?.orientation;return[rs(),ns(),os(as,ls,{name:"orientation",selector:{select:{mode:"dropdown",options:this._options("",["horizontal","vertical"])}}},{name:"sort",selector:{select:{mode:"dropdown",options:this._options("sort_",["desc","asc","name","none"])}}},{name:"limit",selector:{number:{min:1,max:100,mode:"box"}}},{name:"max",selector:{number:{mode:"box",step:"any"}}},...t?[{name:"bar_height",selector:{number:{min:4,max:80,mode:"box",unit_of_measurement:"px"}}}]:[],{name:"show_values",selector:{boolean:{}}},{name:"transparent_track",selector:{boolean:{}}},...e?.transparent_track&&!1!==e?.show_values?[{name:"value_at_end",selector:{boolean:{}}}]:[],ds(this.hass),..."series"!==e?.color_mode?[{name:"gradient",selector:{boolean:{}}}]:[],hs(this.hass))]}};Zo=e([ue("prometheus-bar-card-editor")],Zo);let Jo=class extends tt{constructor(){super(...arguments),this._barData=[],this._calculatedMax=0,this._loaded=!1}static get styles(){return[Ye,Qo]}static getStubConfig(){return{type:"custom:prometheus-bar-card",title:"Scrape duration",query:"scrape_duration_seconds",legend_format:"{{job}}",unit:"s",orientation:"horizontal"}}static getConfigElement(){return document.createElement("prometheus-bar-card-editor")}async _fetchData(){try{this._loading=!0;const e=await this._client.instantQuery(this._config.query),{bars:t,max:s}=function(e,t){let s=Ft(e,t.legend_format).filter(e=>null!==e.value).map(e=>({label:Mt(e.metric,t.legend_format),value:e.value,color:""}));const i=t.sort||"desc";"desc"===i?s.sort((e,t)=>t.value-e.value):"asc"===i?s.sort((e,t)=>e.value-t.value):"name"===i&&s.sort((e,t)=>e.label.localeCompare(t.label,void 0,{numeric:!0})),t.limit&&t.limit>0&&(s=s.slice(0,t.limit));const r="series"!==t.color_mode&&t.thresholds?.length;s.forEach((e,i)=>{const n=jt(i,s.length,t.palette);e.color=r?Pt(e.value,t.thresholds,n):n});const n=s.reduce((e,t)=>Math.max(e,t.value),0);return{bars:s,max:t.max||n||100}}(e,this._config);this._barData=t,this._calculatedMax=s,this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}render(){if(!this._hasQuery())return this.renderPlaceholder();let e;return e=this._error?U`<div class="error-state">${this._error}</div>`:this._barData.length>0?this._renderBars():this._loaded?U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`:U`<div class="loading-state"></div>`,U`
      <ha-card>
        ${this.renderHeader()}
        <div class="body ${this._fixedHeight()?"fill":""}">${e}</div>
      </ha-card>
    `}_fmt(e){return $t(e,this._config.decimals,this._config.unit)}_fill(e,t,s){const i=this._config,r="series"!==i.color_mode;return`background: ${(i.gradient&&r?Ko(i.thresholds,this._calculatedMax||1,t,s):null)??e.color};`}_renderBars(){const e=this._config,t=this._calculatedMax||1,s=!1!==e.show_values,i=Boolean(e.transparent_track),r=s&&i&&Boolean(e.value_at_end),n="track "+(i?"clear":"");if("vertical"===e.orientation)return U`
        <div class="bars-vertical">
          ${this._barData.map(e=>{const i=Yo(e.value,t);return U`
              <div class="bar-col">
                ${s&&!r?U`<div class="bar-col-value">${this._fmt(e.value)}</div>`:Q}
                <div class="${n} col-track">
                  ${r?U`<div class="end-value" style="bottom: ${i}%">${this._fmt(e.value)}</div>`:Q}
                  <div class="bar-fill" style="height: ${i}%; ${this._fill(e,i,!0)}"></div>
                </div>
                <div class="bar-col-label" title="${e.label}">${e.label}</div>
              </div>
            `})}
        </div>
      `;const o=e.bar_height?`--bar-h: ${e.bar_height}px`:"";return U`
      <div class="bars-horizontal ${e.bar_height?"":"auto"}" style=${o}>
        ${this._barData.map(e=>{const i=Yo(e.value,t);return U`
            <div class="bar-row">
              <div class="bar-label" title="${e.label}">${e.label}</div>
              <div class="${n} row-track ${r?"with-end":""}">
                <!-- with the value at the end the bar scales to the space left for the value -->
                <div class="bar-fill" style="width: ${r?`calc((100% - var(--end-w)) * ${i/100})`:`${i}%`}; ${this._fill(e,i,!1)}"></div>
                ${r?U`<div class="end-value">${this._fmt(e.value)}</div>`:Q}
              </div>
              ${s&&!r?U`<div class="bar-value">${this._fmt(e.value)}</div>`:Q}
            </div>
          `})}
      </div>
    `}};e([_e()],Jo.prototype,"_barData",void 0),e([_e()],Jo.prototype,"_calculatedMax",void 0),e([_e()],Jo.prototype,"_loaded",void 0),Jo=e([ue("prometheus-bar-card")],Jo);const Xo=l`
  .timeline {
    display: grid;
    grid-template-columns: minmax(0, max-content) 1fr;
    column-gap: 8px;
    row-gap: 4px;
    align-items: center;
  }
  /* auto row height in a fixed-height panel: rows share the height */
  .timeline.fill.auto {
    grid-auto-rows: minmax(10px, 1fr);
    align-items: stretch;
  }
  .timeline.fill.auto .row-bar {
    height: auto;
    max-height: 80px;
  }
  .timeline.fill.auto .row-label {
    align-self: center;
  }
  .timeline.fill.auto .axis {
    align-self: start;
  }
  .row-label {
    font-size: 12px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }
  /* no track background: transparent states and gaps without data show the card background */
  .row-bar {
    position: relative;
    height: var(--row-height, 26px);
    border-radius: 4px;
    overflow: hidden;
  }
  .segment {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 11px;
    color: #fff;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
    white-space: nowrap;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.15);
  }
  .segment span {
    padding: 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .axis {
    grid-column: 2;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    box-sizing: border-box;
  }
  /* transparent state: outlined square in the legend */
  .legend-color.clear {
    border: 1px dashed var(--secondary-text-color);
  }
  .segment.clear {
    color: var(--secondary-text-color);
    text-shadow: none;
    box-shadow: none;
  }
`;function el(e,t){if(void 0!==e.value&&null!==e.value&&""!==String(e.value)){const s=Number(e.value);return Number.isFinite(s)?s===t:String(e.value)===String(t)}const s=void 0!==e.from&&null!==e.from,i=void 0!==e.to&&null!==e.to;return!(!s&&!i)&&((!s||t>=e.from)&&(!i||t<=e.to))}function tl(e,t,s){const i=$t(e,t.decimals,t.unit);for(const[s,r]of(t.mappings||[]).entries())if(el(r,e))return{key:`m${s}`,text:r.text||i,color:zt(r)||jt(s,(t.mappings||[]).length,t.palette)};if(t.thresholds?.length){const s=Pt(e,t.thresholds);return{key:`t${s}`,text:i,color:s}}return{key:`v${e}`,text:i,color:jt(Math.max(0,s.indexOf(e)),Math.max(s.length,2),t.palette)}}function sl(e,t,s,i,r){const n=[],o=!1!==r.merge_values;let l=1/0;for(let t=1;t<e.length;t++)l=Math.min(l,e[t][0]-e[t-1][0]);t=Number.isFinite(l)?Math.max(t,l):t;for(let l=0;l<e.length;l++){const[a,c]=e[l];if(null===c)continue;const h=e[l+1]?.[0],d=void 0!==h&&h-a<=2*t?h:Math.min(a+t,s),u=tl(c,r,i),p=n[n.length-1];o&&p&&p.key===u.key&&p.end>=a?p.end=d:n.push({...u,start:a,end:d})}return n}const il=[{name:"",type:"grid",schema:[{name:"value",selector:{text:{}}},{name:"text",selector:{text:{}}},{name:"from",selector:{number:{mode:"box",step:"any"}}},{name:"to",selector:{number:{mode:"box",step:"any"}}},{name:"color",selector:{text:{type:"color"}}},{name:"transparent_color",selector:{boolean:{}}}]}];let rl=class extends Ps{_queryMode(){return"range"}_defaults(){return{time_range:"6h",show_values:!0,show_legend:!0,merge_values:!0,palette:"classic",refresh_interval:60}}_sections(){return[rs(),ns({},ss,is),os(as,ls,{name:"row_height",selector:{number:{min:6,max:120,mode:"box",unit_of_measurement:"px"}}},hs(this.hass),{name:"show_values",selector:{boolean:{}}},{name:"show_legend",selector:{boolean:{}}},{name:"merge_values",selector:{boolean:{}}})]}_renderExtra(){return U`
      <div class="section-title">${Xe("section_mappings",this.hass)}</div>
      <div class="helper">${Xe("helper_mappings",this.hass)}</div>
      <prometheus-list-editor
        .hass=${this.hass}
        .items=${((e=[])=>e.map(({transparent:e,...t})=>e?{...t,transparent_color:!0}:t))(this._config?.mappings)}
        .schema=${il}
        .addLabel=${Xe("add_mapping",this.hass)}
        .newItem=${()=>({value:"",text:"",color:"#73BF69"})}
        @value-changed=${e=>{e.stopPropagation();const t=(e=>e.map(({transparent_color:e,...t})=>e?{...t,transparent:!0}:t))(e.detail.value);this._updateConfig({mappings:t.length?t:void 0})}}
      ></prometheus-list-editor>
    `}};rl=e([ue("prometheus-state-timeline-card-editor")],rl);let nl=class extends tt{constructor(){super(...arguments),this._rows=[],this._range=[0,0],this._loaded=!1}static get styles(){return[Ye,Xo]}static getStubConfig(){return{type:"custom:prometheus-state-timeline-card",title:"Targets",time_range:"6h",query:"up",legend_format:"{{job}}",mappings:[{value:"1",text:"UP",color:"#73BF69"},{value:"0",text:"DOWN",color:"#F2495C"}]}}static getConfigElement(){return document.createElement("prometheus-state-timeline-card-editor")}_defaultColumns(){return 12}getCardSize(){return this._config?.card_height?super.getCardSize():2+Math.ceil(this._rows.length/2)}async _fetchData(){const e=this._config;try{this._loading=!0;const t=Bt(e.time_range||"6h",300),{start:s,end:i}=t,r=e.step?String(e.step):t.step,n=await this._client.rangeQuery(e.query,s,i,r);this._rows=function(e,t,s,i){const r=t.legend_format?.trim()||void 0,n=Nt(e,r).map(e=>({label:Mt(e.metric,r),points:e.points})),o=Array.from(new Set(n.flatMap(e=>e.points.map(e=>e[1]).filter(e=>null!==e)))).sort((e,t)=>e-t);return n.slice(0,Lt).map(e=>({label:e.label,segments:sl(e.points,s,i,o,t)}))}(n,e,parseFloat(r)||60,i),this._range=[s,i],this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}_time(e){const t=this._range[1]-this._range[0]>172800?{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}:{hour:"2-digit",minute:"2-digit",hour12:!1};return new Date(1e3*e).toLocaleString(this._hass?.locale?.language,t)}_tick(e){return qt(e,this._range[1]-this._range[0],this._hass?.locale?.language)}_renderRow(e){const[t,s]=this._range,i=s-t||1,r=!1!==this._config.show_values;return U`
      <div class="row-label" title=${e.label}>${e.label}</div>
      <div class="row-bar">
        ${e.segments.map(s=>{const n=(s.start-t)/i*100,o=Math.max(.2,(s.end-s.start)/i*100),l=`${e.label}: ${s.text} (${this._time(s.start)} – ${this._time(s.end)})`;return U`<div
            class="segment ${"transparent"===s.color?"clear":""}"
            style="left:${n}%;width:${o}%;background:${s.color}"
            title=${l}
          >
            ${r&&o>6?U`<span>${s.text}</span>`:Q}
          </div>`})}
      </div>
    `}_renderLegend(){const e=new Map;return this._rows.forEach(t=>t.segments.forEach(t=>e.set(t.key,t))),U`<div class="legend">
      ${[...e.values()].map(e=>U`<div class="legend-item">
          <span class="legend-color ${"transparent"===e.color?"clear":""}" style="background:${e.color}"></span>${e.text}
        </div>`)}
    </div>`}render(){const e=this._config;if(!this._hasQuery())return this.renderPlaceholder();if(this._error)return this.renderError();if(!this._loaded)return this.renderLoading();const[t,s]=this._range,i=[0,.25,.5,.75,1].map(e=>t+(s-t)*e);return U`
      <ha-card>
        ${this.renderHeader()}
        ${this._rows.length?U`
              <div
                class="timeline ${this._fixedHeight()&&!e.row_height?"fill auto":""}"
                style=${e.row_height?`--row-height: ${e.row_height}px`:""}
              >
                ${this._rows.map(e=>this._renderRow(e))}
                <div class="axis">${i.map(e=>U`<span>${this._tick(e)}</span>`)}</div>
              </div>
              ${!1!==e.show_legend?this._renderLegend():Q}
            `:U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`}
      </ha-card>
    `}};e([_e()],nl.prototype,"_rows",void 0),e([_e()],nl.prototype,"_range",void 0),e([_e()],nl.prototype,"_loaded",void 0),nl=e([ue("prometheus-state-timeline-card")],nl);const ol=l`
  :host {
    display: block;
    container-type: inline-size;
  }
  /* Narrow card (card picker preview, 3-4 sections columns): legend goes below the chart */
  @container (max-width: 340px) {
    .body {
      flex-direction: column;
    }
    .body .legend {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 14px;
      max-height: none;
    }
    .chart {
      width: min(var(--pie-size, 180px), 70cqw);
    }
  }
  /* fixed-height panel: the chart is limited by the available height */
  .body.fill {
    flex: 1 1 auto;
    min-height: 0;
  }
  .body.fill .chart {
    width: auto;
    height: min(100%, var(--pie-size, 180px));
    max-height: 100%;
  }
  .body {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }
  .body.bottom {
    flex-direction: column;
  }
  .chart {
    position: relative;
    flex-shrink: 0;
    width: var(--pie-size, 180px);
    max-width: 100%;
    aspect-ratio: 1;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
  path.slice {
    stroke: var(--card-background-color, #fff);
    stroke-width: 1.5;
    transition: transform 0.15s ease, opacity 0.15s ease;
    transform-origin: 50% 50%;
    cursor: pointer;
  }
  path.slice.dim {
    opacity: 0.35;
  }
  path.slice.active {
    transform: scale(1.04);
  }
  .slice-label {
    font-size: 5px;
    fill: #fff;
    pointer-events: none;
    font-weight: 500;
  }
  .center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    text-align: center;
    padding: 20%;
  }
  .center .total {
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .center .caption {
    font-size: 11px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  .legend {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    min-width: 0;
    max-height: var(--pie-size, 180px);
    overflow-y: auto;
  }
  .body.bottom .legend {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    max-height: none;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    min-width: 0;
  }
  .legend-item.dim {
    opacity: 0.4;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .legend-name {
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .legend-value {
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    margin-left: auto;
    padding-left: 8px;
  }
`;function ll(e,t,s,i){const r=(i-90)*Math.PI/180;return[e+s*Math.cos(r),t+s*Math.sin(r)]}let al=class extends Ps{_defaults(){return{pie_type:"donut",donut_width:40,show_legend:!0,legend_position:"right",legend_values:["value"],show_labels:!1,show_total:!0,sort:"desc",size:180,palette:"classic",refresh_interval:30}}_hasThresholds(){return!1}_options(e,t){return t.map(t=>({value:t,label:Xe(`${e}${t}`,this.hass)}))}_sections(){const e="pie"!==this._config?.pie_type,t=!1!==this._config?.show_legend;return[rs(),ns(),os(as,ls,{name:"pie_type",selector:{select:{mode:"dropdown",options:this._options("pie_type_",["donut","pie"])}}},...e?[{name:"donut_width",selector:{number:{min:10,max:90,step:5,mode:"slider",unit_of_measurement:"%"}}},{name:"show_total",selector:{boolean:{}}}]:[],{name:"show_labels",selector:{boolean:{}}},{name:"size",selector:{number:{min:80,max:500,mode:"box",unit_of_measurement:"px"}}},{name:"sort",selector:{select:{mode:"dropdown",options:this._options("sort_",["desc","asc","none"])}}},{name:"limit",selector:{number:{min:1,max:50,mode:"box"}}},hs(this.hass),{name:"show_legend",selector:{boolean:{}}},...t?[{name:"legend_position",selector:{select:{mode:"dropdown",options:this._options("legend_position_",["right","bottom"])}}},{name:"legend_values",selector:{select:{multiple:!0,mode:"list",options:this._options("legend_pie_",["value","percent"])}}}]:[])]}};al=e([ue("prometheus-pie-card-editor")],al);let cl=class extends tt{constructor(){super(...arguments),this._slices=[],this._loaded=!1,this._active=null}static get styles(){return[Ye,ol]}static getStubConfig(){return{type:"custom:prometheus-pie-card",title:"Series by job",query:"count by (job) (up)",legend_format:"{{job}}",pie_type:"donut"}}static getConfigElement(){return document.createElement("prometheus-pie-card-editor")}getCardSize(){return this._config?.card_height?super.getCardSize():4}async _fetchData(){const e=this._config;try{this._loading=!0;const t=await this._client.instantQuery(e.query);this._slices=function(e,t,s){const i=t?.trim()||void 0;let r=[];for(const t of Ft(e,i))null===t.value||t.value<=0||r.push({label:Mt(t.metric,i),value:t.value});const n=s.sort||"desc";if("desc"===n?r.sort((e,t)=>t.value-e.value):"asc"===n&&r.sort((e,t)=>e.value-t.value),s.limit&&s.limit>0&&r.length>s.limit){const e=r.slice(s.limit);r=r.slice(0,s.limit),r.push({label:s.otherLabel,value:e.reduce((e,t)=>e+t.value,0),explicit:"#8E8E8E"})}const o=r.reduce((e,t)=>e+t.value,0)||1;return r.map((e,t)=>({label:e.label,value:e.value,color:jt(t,r.length,s.palette,e.explicit),percent:e.value/o*100}))}(t,e.legend_format,{palette:e.palette,sort:e.sort,limit:e.limit,otherLabel:Xe("other",this._hass)}),this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}_fmt(e){return $t(e,this._config.decimals,this._config.unit)}_renderChart(){const e=this._config,t="pie"!==e.pie_type,s=t?48*(1-Math.max(10,Math.min(90,e.donut_width??40))/100):0,i=this._slices.reduce((e,t)=>e+t.value,0);let r=0;const n=null!==this._active?this._slices[this._active]:void 0,o=this._slices.map((i,n)=>{const o=r,l=r+i.percent/100*360;r=l;const a=`slice ${this._active===n?"active":""} ${null!==this._active&&this._active!==n?"dim":""}`,[c,h]=function(e,t,s){return ll(50,50,s,(e+t)/2)}(o,l,t?(48+s)/2:48*.62);return W`
        <path class=${a} d=${function(e,t,s,i){const r=Math.min(t-e,359.999),n=e+r,o=r>180?1:0,[l,a]=ll(50,50,s,e),[c,h]=ll(50,50,s,n);if(i<=0)return`M 50 50 L ${l} ${a} A ${s} ${s} 0 ${o} 1 ${c} ${h} Z`;const[d,u]=ll(50,50,i,n),[p,m]=ll(50,50,i,e);return`M ${l} ${a} A ${s} ${s} 0 ${o} 1 ${c} ${h} L ${d} ${u} A ${i} ${i} 0 ${o} 0 ${p} ${m} Z`}(o,l,48,s)} fill=${i.color}
          @mouseenter=${()=>this._active=n} @mouseleave=${()=>this._active=null}>
          <title>${i.label}: ${this._fmt(i.value)} (${i.percent.toFixed(1)}%)</title>
        </path>
        ${e.show_labels&&i.percent>=5?W`<text class="slice-label" x=${c} y=${h} text-anchor="middle" dominant-baseline="middle">${Math.round(i.percent)}%</text>`:Q}
      `});return U`
      <div class="chart">
        <svg viewBox="0 0 100 100">${o}</svg>
        ${t&&!1!==e.show_total?U`<div class="center">
              <div class="total">${this._fmt(n?n.value:i)}</div>
              <div class="caption">${n?n.label:Xe("total",this._hass)}</div>
            </div>`:Q}
      </div>
    `}_renderLegend(){const e=this._config.legend_values||["value"];return U`<div class="legend">
      ${this._slices.map((t,s)=>U`<div
          class="legend-item ${null!==this._active&&this._active!==s?"dim":""}"
          title=${t.label}
          @mouseenter=${()=>this._active=s}
          @mouseleave=${()=>this._active=null}
        >
          <span class="legend-color" style="background:${t.color}"></span>
          <span class="legend-name">${t.label}</span>
          <span class="legend-value">
            ${e.includes("value")?this._fmt(t.value):Q}
            ${e.includes("percent")?U`${e.includes("value")?" · ":""}${t.percent.toFixed(1)}%`:Q}
          </span>
        </div>`)}
    </div>`}render(){const e=this._config;return this._hasQuery()?this._error?this.renderError():this._loaded?U`
      <ha-card>
        ${this.renderHeader()}
        ${this._slices.length?U`<div
              class="body ${"bottom"===e.legend_position?"bottom":""} ${this._fixedHeight()?"fill":""}"
              style="--pie-size: ${e.size||180}px"
            >
              ${this._renderChart()} ${!1!==e.show_legend?this._renderLegend():Q}
            </div>`:U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`}
      </ha-card>
    `:this.renderLoading():this.renderPlaceholder()}};e([_e()],cl.prototype,"_slices",void 0),e([_e()],cl.prototype,"_loaded",void 0),e([_e()],cl.prototype,"_active",void 0),cl=e([ue("prometheus-pie-card")],cl);let hl=class extends Ps{_defaults(){return{min:0,display_mode:"gradient",show_unfilled:!0,orientation:"horizontal",sort:"none",palette:"classic",color_mode:"thresholds",refresh_interval:30}}_options(e,t){return t.map(t=>({value:t,label:Xe(`${e}${t}`,this.hass)}))}_sections(){const e="vertical"!==this._config?.orientation;return[rs(),ns(),os(as,ls,{name:"display_mode",selector:{select:{mode:"dropdown",options:this._options("display_mode_",["gradient","basic","lcd"])}}},{name:"orientation",selector:{select:{mode:"dropdown",options:this._options("",["horizontal","vertical"])}}},{name:"min",selector:{number:{mode:"box",step:"any"}}},{name:"max",selector:{number:{mode:"box",step:"any"}}},{name:"show_unfilled",selector:{boolean:{}}},...e?[{name:"bar_height",selector:{number:{min:4,max:60,mode:"box",unit_of_measurement:"px"}}}]:[],{name:"sort",selector:{select:{mode:"dropdown",options:this._options("sort_",["none","desc","asc","name"])}}},{name:"limit",selector:{number:{min:1,max:100,mode:"box"}}},ds(this.hass),hs(this.hass))]}};hl=e([ue("prometheus-bar-gauge-card-editor")],hl);let dl=class extends tt{constructor(){super(...arguments),this._items=[],this._loaded=!1}static get styles(){return[Ye,l`
        .list { display: flex; flex-direction: column; gap: 10px; }
        .list.fill.auto .row { flex: 1 1 0; min-height: 0; }
        .list.fill.auto .track { flex: 1 1 auto; height: auto; min-height: 4px; max-height: 64px; }
        .cols.fill { height: auto; }
        .row { display: flex; flex-direction: column; gap: 3px; }
        .row-head { display: flex; justify-content: space-between; gap: 8px; font-size: 13px; }
        .label { color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .value { font-weight: 600; white-space: nowrap; }
        .track { position: relative; border-radius: 3px; overflow: hidden; height: var(--bar-h, 18px); }
        .track.unfilled { background: var(--secondary-background-color, rgba(127, 127, 127, 0.15)); }
        .fill { height: 100%; border-radius: 3px; transition: width 0.4s ease; }
        .cols { display: flex; gap: 10px; align-items: flex-end; height: 180px; }
        .col { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; }
        .col .track { width: 100%; max-width: 48px; height: auto; flex: 1; display: flex; align-items: flex-end; }
        .col .fill { width: 100%; transition: height 0.4s ease; }
        .col .label { font-size: 11px; max-width: 100%; }
        .col .value { font-size: 12px; }
      `]}static getStubConfig(){return{type:"custom:prometheus-bar-gauge-card",title:"Disk usage",query:"100 - node_filesystem_avail_bytes / node_filesystem_size_bytes * 100",legend_format:"{{mountpoint}}",unit:"percent",min:0,max:100,thresholds:[{value:0,color:"#73BF69"},{value:70,color:"#FF9830"},{value:90,color:"#F2495C"}]}}static getConfigElement(){return document.createElement("prometheus-bar-gauge-card-editor")}async _fetchData(){const e=this._config;try{this._loading=!0;let t=Ft(await this._client.instantQuery(e.query),e.legend_format).filter(e=>null!==e.value).map(t=>({...t,label:Mt(t.metric,e.legend_format)}));const s=e.sort||"none";"desc"===s?t.sort((e,t)=>t.value-e.value):"asc"===s?t.sort((e,t)=>e.value-t.value):"name"===s&&t.sort((e,t)=>e.label.localeCompare(t.label,void 0,{numeric:!0})),e.limit&&e.limit>0&&(t=t.slice(0,e.limit)),this._items=t,this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}_bar(e,t,s,i){const r=this._config,n=r.min??0,o=e.value??n,l=s>n?Math.max(0,Math.min(100,(o-n)/(s-n)*100)):0,a=jt(t,this._items.length,r.palette),c="series"===r.color_mode?[]:r.thresholds||[],h=function(e,t,s,i,r,n){const o=r.length?Pt(t,r):n;if("basic"===e||!r.length||i<=s)return{fill:o,color:o};const l=i-s,a=e=>Math.max(0,Math.min(100,(e-s)/l*100)),c=[...r].sort((e,t)=>e.value-t.value),h=a(t)||1;if("lcd"===e){const e=20,t=[];for(let i=0;i<e;i++){const r=Pt(s+(i+.5)/e*l,c),n=i/e*100,o=(i+1)/e*100;t.push(`${r} ${n}%`,`${r} ${o-100/e*.12}%`,`transparent ${o-100/e*.12}%`,`transparent ${o}%`)}return{fill:`linear-gradient(90deg, ${t.join(", ")}) 0 0 / ${100/h*100}% 100%`,color:o}}const d=c.map(e=>({at:a(e.value),color:Ct(e.color)})).filter(e=>e.at<=h).map(e=>`${e.color} ${e.at/h*100}%`);return d.length<2?{fill:o,color:o}:{fill:`linear-gradient(90deg, ${d.join(", ")}, ${o} 100%)`,color:o}}(r.display_mode||"gradient",o,n,s,c,a),d=wt(e.value,r.unit,r.decimals),u=!1!==r.show_unfilled?"track unfilled":"track",p=i?`height:${l}%`:`width:${l}%`;return U`
      <div class=${i?"col":"row"}>
        ${i?U`<span class="value" style="color:${h.color}">${d.prefix}${d.text}${d.suffix}</span>`:U`<div class="row-head">
              <span class="label" title=${e.label}>${e.label}</span>
              <span class="value" style="color:${h.color}">${d.prefix}${d.text}${d.suffix}</span>
            </div>`}
        <div class=${u}><div class="fill" style="${p};background:${h.fill}"></div></div>
        ${i?U`<span class="label" title=${e.label}>${e.label}</span>`:Q}
      </div>
    `}render(){const e=this._config;if(!this._hasQuery())return this.renderPlaceholder();if(this._error)return this.renderError();if(!this._loaded)return this.renderLoading();const t=e.max??Math.max(100,...this._items.map(e=>e.value??0)),s="vertical"===e.orientation;return U`
      <ha-card>
        ${this.renderHeader()}
        ${this._items.length?U`<div
              class="${s?"cols":"list"} ${this._fixedHeight()?"fill":""} ${e.bar_height?"":"auto"}"
              style=${e.bar_height?`--bar-h:${e.bar_height}px`:""}
            >
              ${this._items.map((e,i)=>this._bar(e,i,t,s))}
            </div>`:U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`}
      </ha-card>
    `}};e([_e()],dl.prototype,"_items",void 0),e([_e()],dl.prototype,"_loaded",void 0),dl=e([ue("prometheus-bar-gauge-card")],dl);let ul=class extends Ps{_defaults(){return{sort_by:"value",sort_dir:"desc",color_cells:!1,refresh_interval:30}}_options(e,t){return t.map(t=>({value:t,label:Xe(`${e}${t}`,this.hass)}))}_sections(){const e=ns({legend:!1});return e.schema.push({name:"columns",selector:{text:{multiple:!0}}},{name:"hide_columns",selector:{text:{multiple:!0}}}),[rs(),e,os(as,ls,{name:"value_column",selector:{text:{}}},{name:"max_rows",selector:{number:{min:1,max:1e3,mode:"box"}}},{name:"sort_by",selector:{select:{mode:"dropdown",options:this._options("sort_by_",["value","label"])}}},{name:"sort_dir",selector:{select:{mode:"dropdown",options:this._options("sort_dir_",["desc","asc"])}}},{name:"color_cells",selector:{boolean:{}}})]}};ul=e([ue("prometheus-table-card-editor")],ul);let pl=class extends tt{constructor(){super(...arguments),this._model={columns:[],rows:[]},this._loaded=!1}static get styles(){return[Ye,l`
        ha-card { padding: 16px 0 8px; }
        .card-header { padding: 0 16px; }
        .wrap { overflow: auto; max-height: var(--table-max-height, 420px); }
        .wrap.fill { max-height: none; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { position: sticky; top: 0; background: var(--card-background-color, #fff); text-align: left;
          font-weight: 500; color: var(--secondary-text-color); padding: 6px 12px; cursor: pointer;
          white-space: nowrap; border-bottom: 1px solid var(--divider-color); user-select: none; }
        th.num, td.num { text-align: right; }
        td { padding: 5px 12px; border-bottom: 1px solid var(--divider-color); white-space: nowrap; }
        tr:last-child td { border-bottom: none; }
        td.num { font-weight: 600; font-variant-numeric: tabular-nums; }
        .arrow { opacity: 0.6; font-size: 10px; margin-left: 4px; }
      `]}static getStubConfig(){return{type:"custom:prometheus-table-card",title:"Targets",query:"up",columns:["job","instance"],thresholds:[{value:0,color:"#F2495C"},{value:1,color:"#73BF69"}],color_cells:!0}}static getConfigElement(){return document.createElement("prometheus-table-card-editor")}_defaultColumns(){return 12}async _fetchData(){const e=this._config;try{this._loading=!0;const t=await this._client.instantQuery(e.query);this._model=function(e,t){const s=Ft(e),i=new Set(t.hide||[]);let r;if(t.columns&&t.columns.length)r=t.columns.filter(e=>!i.has(e));else{const e=new Set;for(const t of s)Object.keys(t.metric).forEach(t=>e.add(t));const t=new Set(s.map(e=>e.metric.__name__));t.size<=1&&e.delete("__name__"),r=[...e].filter(e=>!i.has(e)).sort((e,t)=>"__name__"===e?-1:"__name__"===t?1:e.localeCompare(t))}const n=s.map(e=>({labels:e.metric,value:e.value})),o="asc"===t.sortDir?1:-1;if("label"===t.sortBy&&r.length){const e=r[0];n.sort((t,s)=>-1*o*(t.labels[e]??"").localeCompare(s.labels[e]??"",void 0,{numeric:!0}))}else n.sort((e,t)=>o*((e.value??-1/0)-(t.value??-1/0)));return{columns:r,rows:t.maxRows?n.slice(0,t.maxRows):n}}(t,{columns:e.columns,hide:e.hide_columns,sortBy:e.sort_by,sortDir:e.sort_dir,maxRows:e.max_rows}),this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}_rows(){const e=[...this._model.rows];if(!this._sort)return e;const{col:t,dir:s}=this._sort;return e.sort((e,i)=>"__value__"===t?s*((e.value??-1/0)-(i.value??-1/0)):s*(e.labels[t]??"").localeCompare(i.labels[t]??"",void 0,{numeric:!0}))}_toggleSort(e){this._sort=this._sort?.col===e?{col:e,dir:1===this._sort.dir?-1:1}:{col:e,dir:"__value__"===e?-1:1}}_th(e,t,s=!1){const i=this._sort?.col===e?1===this._sort.dir?"▲":"▼":"";return U`<th class=${s?"num":""} @click=${()=>this._toggleSort(e)}>
      ${t}${i?U`<span class="arrow">${i}</span>`:Q}
    </th>`}render(){const e=this._config;if(!this._hasQuery())return this.renderPlaceholder();if(this._error)return this.renderError();if(!this._loaded)return this.renderLoading();const{columns:t}=this._model,s=this._rows();return U`
      <ha-card>
        ${this.renderHeader()}
        ${s.length?U`<div class="wrap ${this._fixedHeight()?"fill":""}"><table>
              <thead><tr>
                ${t.map(e=>this._th(e,"__name__"===e?"metric":e))}
                ${this._th("__value__",e.value_column||Xe("value",this._hass),!0)}
              </tr></thead>
              <tbody>
                ${s.map(s=>{const i=e.thresholds?.length&&null!==s.value?Pt(s.value,e.thresholds):"",r=i?e.color_cells?`background:${Tt(i,.25)};color:${i}`:`color:${i}`:"";return U`<tr>
                    ${t.map(e=>U`<td>${s.labels[e]??""}</td>`)}
                    <td class="num" style=${r}>${$t(s.value,e.decimals,e.unit)}</td>
                  </tr>`})}
              </tbody>
            </table></div>`:U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`}
      </ha-card>
    `}};function ml(e){if("+Inf"===e)return 1/0;const t=parseFloat(e);return Number.isFinite(t)?t:NaN}function fl(e){let t=null;return e.map(e=>{if(null===e)return null;const s=null===t?null:e>=t?e-t:e;return t=e,s})}function _l(e,t,s,i=!1){const r=Nt(e,s,void 0,"histogram"===t?1/0:void 0),n=new Set;r.forEach(e=>e.points.forEach(([e])=>n.add(e)));const o=[...n].sort((e,t)=>e-t),l=new Map(o.map((e,t)=>[e,t]));let a,c;if("histogram"===t){const e=new Map;for(const t of r){const s=ml(t.metric.le??"");if(Number.isNaN(s))continue;let r=new Array(o.length).fill(null);for(const[e,s]of t.points)r[l.get(e)]=s;i&&(r=fl(r));const n=e.get(s)??new Array(o.length).fill(null);r.forEach((e,t)=>{null!==e&&(n[t]=(n[t]??0)+e)}),e.set(s,n)}const t=[...e.keys()].sort((e,t)=>e-t);a=t.map(e=>function(e){return e===1/0?"+Inf":String(parseFloat(e.toPrecision(4)))}(e)),c=t.map((s,i)=>{const r=e.get(s);if(0===i)return r;const n=e.get(t[i-1]);return r.map((e,t)=>null===e?null:Math.max(0,e-(n[t]??0)))});const s=o.findIndex((e,t)=>c.some(e=>null!==e[t]));s>0&&(o.splice(0,s),c=c.map(e=>e.slice(s)))}else a=r.map(e=>s?e.label:kt(e.metric)),c=r.map(e=>{const t=new Array(o.length).fill(null);for(const[s,i]of e.points)t[l.get(s)]=i;return t});let h=1/0,d=-1/0;for(const e of c)for(const t of e)null!==t&&(t<h&&(h=t),t>d&&(d=t));return Number.isFinite(h)||(h=0,d=0),{times:o,rows:a,cells:c,min:h,max:d}}e([_e()],pl.prototype,"_model",void 0),e([_e()],pl.prototype,"_loaded",void 0),e([_e()],pl.prototype,"_sort",void 0),pl=e([ue("prometheus-table-card")],pl);const gl={oranges:["#fff5eb","#fdd0a2","#fd8d3c","#d94801","#7f2704"],spectral:["#3288bd","#99d594","#e6f598","#fee08b","#fc8d59","#d53e4f"],viridis:["#440154","#3b528b","#21918c","#5ec962","#fde725"],blues:["#f7fbff","#c6dbef","#6baed6","#2171b5","#08306b"],greens:["#f7fcf5","#c7e9c0","#74c476","#238b45","#00441b"],reds:["#fff5f0","#fcbba1","#fb6a4a","#cb181d","#67000d"],purples:["#fcfbfd","#dadaeb","#9e9ac8","#6a51a3","#3f007d"]};function vl(e){const t=parseInt(e.slice(1),16);return[t>>16&255,t>>8&255,255&t]}function bl(e,t=e=>6*e.length){const s=e.reduce((e,s)=>Math.max(e,t(s)),0);return Math.min(110,Math.ceil(s)+8)}function xl(e,t,s){const i=e.clientWidth||400,r=window.devicePixelRatio||1;e.width=i*r,e.height=s.height*r,e.parentElement?.classList.contains("fill")||(e.style.height=`${s.height}px`);const n=e.getContext("2d");if(!n)return;n.scale(r,r),n.clearRect(0,0,i,s.height),n.font="10px sans-serif";const o=bl(t.rows,e=>n.measureText(e).width);e.__labelW=o;const l=i-o,a=s.height-16,c=l/t.times.length,h=a/t.rows.length;t.cells.forEach((e,i)=>{const r=a-(i+1)*h;e.forEach((e,i)=>{null!==e&&(n.fillStyle=function(e,t){const s=gl[e]||gl.oranges,i=Math.max(0,Math.min(1,t))*(s.length-1),r=Math.min(s.length-2,Math.floor(i)),n=i-r,o=vl(s[r]),l=vl(s[r+1]),a=o.map((e,t)=>Math.round(e+(l[t]-e)*n));return`rgb(${a[0]}, ${a[1]}, ${a[2]})`}(s.scheme,function(e,t,s,i=!1){if(s<=t)return e>0?1:0;if(i){const i=Math.log10(Math.max(t,1e-9)+1),r=Math.log10(s+1);return Math.max(0,Math.min(1,(Math.log10(Math.max(e,0)+1)-i)/(r-i||1)))}return Math.max(0,Math.min(1,(e-t)/(s-t)))}(e,t.min,t.max,s.log)),n.fillRect(o+i*c,r,Math.ceil(c)+.5,Math.max(1,Math.ceil(h)-1)))})}),n.fillStyle=s.textColor,n.textBaseline="middle",n.textAlign="left";const d=Math.max(1,Math.ceil(12/h));t.rows.forEach((e,t)=>{if(t%d)return;let s=e;for(;s.length>2&&n.measureText(s).width>o-8;)s=s.slice(0,-2)+"…";n.fillText(s,0,a-(t+.5)*h)}),n.textBaseline="top";const u=Math.min(5,t.times.length);for(let e=0;e<u;e++){const i=u>1?Math.round(e/(u-1)*(t.times.length-1)):0,r=qt(t.times[i],t.times[t.times.length-1]-t.times[0],s.language);n.textAlign=0===e?"left":e===u-1?"right":"center",n.fillText(r,o+i*c,a+3)}}let yl=class extends Ps{_queryMode(){return"range"}_defaults(){return{time_range:"6h",heatmap_mode:"histogram",counters:"auto",color_scheme:"oranges",log_scale:!1,show_legend_scale:!0,refresh_interval:60}}_hasThresholds(){return!1}_options(e,t){return t.map(t=>({value:t,label:Xe(`${e}${t}`,this.hass)}))}_sections(){const e="series"===this._config?.heatmap_mode,t=ns({legend:e},ss,{name:"heatmap_mode",selector:{select:{mode:"dropdown",options:this._options("heatmap_mode_",["histogram","series"])}}},...e?[]:[{name:"counters",selector:{select:{mode:"dropdown",options:this._options("counters_",["auto","yes","no"])}}}]);return[rs(),t,os(as,ls,{name:"color_scheme",selector:{select:{mode:"dropdown",options:this._options("scheme_",["oranges","spectral","viridis","blues","greens","reds","purples"])}}},{name:"log_scale",selector:{boolean:{}}},...this._config?.card_height?[]:[{name:"height",selector:{number:{min:60,max:1e3,mode:"box",unit_of_measurement:"px"}}}],{name:"show_legend_scale",selector:{boolean:{}}})]}};yl=e([ue("prometheus-heatmap-card-editor")],yl);let wl=class extends tt{constructor(){super(...arguments),this._hover=""}static get styles(){return[Ye,l`
        .plot { position: relative; }
        .plot.fill { flex: 1 1 auto; min-height: 60px; }
        canvas { width: 100%; display: block; }
        .plot.fill canvas { position: absolute; inset: 0; height: 100%; }
        .foot { display: flex; justify-content: space-between; align-items: center; gap: 8px;
          font-size: 11px; color: var(--secondary-text-color); min-height: 16px; }
        .scale { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
        .bar { width: 120px; height: 8px; border-radius: 4px; }
      `]}static getStubConfig(){return{type:"custom:prometheus-heatmap-card",title:"Request duration",query:"sum by (le) (rate(prometheus_http_request_duration_seconds_bucket[5m]))",heatmap_mode:"histogram",time_range:"6h"}}static getConfigElement(){return document.createElement("prometheus-heatmap-card-editor")}_defaultColumns(){return 12}disconnectedCallback(){super.disconnectedCallback(),this._resize?.disconnect(),this._resize=void 0}async _fetchData(){const e=this._config;try{this._loading=!0;const{start:t,end:s,step:i}=Bt(e.time_range||"6h",120),r=await this._client.rangeQuery(e.query,t,s,i),n="yes"===e.counters||"auto"===(e.counters||"auto")&&function(e){return!(!e||!/_bucket\b/.test(e)||/\b(rate|irate|increase|delta|idelta|deriv)\s*\(/.test(e))}(e.query);this._model=_l(r,e.heatmap_mode||"histogram",e.legend_format,n),this._error=void 0}catch(e){this._error=this._formatError(e)}finally{this._loading=!1}}updated(e){super.updated(e),this._canvas&&!this._resize&&"undefined"!=typeof ResizeObserver&&(this._resize=new ResizeObserver(()=>this._draw()),this._resize.observe(this._canvas.parentElement||this._canvas)),(e.has("_model")||e.has("_config"))&&this._draw()}_draw(){const e=this._model;e&&this._canvas&&e.times.length&&e.rows.length&&xl(this._canvas,e,{height:this._plotHeight(),scheme:this._config.color_scheme||"oranges",log:Boolean(this._config.log_scale),textColor:getComputedStyle(this).getPropertyValue("--secondary-text-color").trim()||"#888",language:this._hass?.locale?.language})}_plotHeight(){const e=this._canvas?.parentElement;return this._fixedHeight()&&e?.clientHeight?Math.max(60,e.clientHeight):this._config.height||200}_onMove(e){const t=this._model;if(!t||!this._canvas)return;const s=function(e,t,s,i,r,n=bl(e.rows)){const o=s-t.left-n,l=i-t.top,a=r-16;if(o<0||l<0||l>a)return null;const c=Math.floor(o/(t.width-n)*e.times.length),h=e.rows.length-1-Math.floor(l/a*e.rows.length);return c<0||c>=e.times.length||h<0||h>=e.rows.length?null:[h,c]}(t,this._canvas.getBoundingClientRect(),e.clientX,e.clientY,this._plotHeight(),this._canvas.__labelW);if(!s)return void(this._hover="");const[i,r]=s,n=t.cells[i][r],o=new Date(1e3*t.times[r]).toLocaleString(this._hass?.locale?.language),l="histogram"===(this._config.heatmap_mode||"histogram")?`le ${t.rows[i]}`:t.rows[i];this._hover=`${l} · ${o} · ${null===n?"-":$t(n,this._config.decimals,this._config.unit)}`}render(){const e=this._config;if(!this._hasQuery())return this.renderPlaceholder();if(this._error)return this.renderError();if(!this._model)return this.renderLoading();const t=this._model,s=(gl[e.color_scheme||"oranges"]||gl.oranges).join(", ");return U`
      <ha-card>
        ${this.renderHeader()}
        ${t.times.length&&t.rows.length?U`<div class="plot ${this._fixedHeight()?"fill":""}">
                <canvas @mousemove=${this._onMove} @mouseleave=${()=>this._hover=""}></canvas>
              </div>
              <div class="foot">
                <span>${this._hover}</span>
                ${!1!==e.show_legend_scale?U`<span class="scale">${$t(t.min,e.decimals,e.unit)}
                      <span class="bar" style="background:linear-gradient(90deg, ${s})"></span>
                      ${$t(t.max,e.decimals,e.unit)}</span>`:Q}
              </div>`:U`<div class="placeholder-state">${Xe("no_data",this._hass)}</div>`}
      </ha-card>
    `}};e([_e()],wl.prototype,"_model",void 0),e([_e()],wl.prototype,"_hover",void 0),e([ge("canvas")],wl.prototype,"_canvas",void 0),wl=e([ue("prometheus-heatmap-card")],wl);const $l={critical:0,error:1,warning:2,info:3,none:4},kl={firing:0,pending:1,inactive:2};function Ml(e,t,s=Date.now()){const i=function(e){if(null==e||""===e)return 0;if("number"==typeof e)return Math.max(0,e);const t=String(e).trim();if(/^\d+(\.\d+)?$/.test(t))return parseFloat(t);const s={s:1,m:60,h:3600,d:86400,w:604800};let i=0,r="";for(const e of t.matchAll(/(\d+(?:\.\d+)?)([smhdw])/g))i+=parseFloat(e[1])*s[e[2]],r+=e[0];return r===t.replace(/\s+/g,"")?i:0}(t.min_active),r=new Set(t.states?.length?t.states:["firing","pending"]),n=(t.severities||"").split(",").map(e=>e.trim().toLowerCase()).filter(Boolean);let o;if(t.name_filter?.trim())try{o=new RegExp(t.name_filter.trim(),"i")}catch{const e=t.name_filter.trim().toLowerCase();o={test:t=>t.toLowerCase().includes(e)}}return e.filter(e=>r.has(e.state)).filter(e=>!n.length||n.includes((e.labels.severity||"").toLowerCase())).filter(e=>!o||o.test(e.labels.alertname||"")).filter(e=>!t.source||"local"===t.source==("home_assistant"===e.source)).filter(e=>!i||"inactive"===e.state||function(e,t=Date.now()){const s=e.activeAt?Date.parse(e.activeAt):NaN;return Number.isNaN(s)?0:Math.max(0,(t-s)/1e3)}(e,s)>=i).sort((e,t)=>(kl[e.state]??9)-(kl[t.state]??9)||($l[(e.labels.severity||"none").toLowerCase()]??5)-($l[(t.labels.severity||"none").toLowerCase()]??5)||(t.activeAt||"").localeCompare(e.activeAt||""))}let Al=class extends Ps{_defaults(){return{states:["firing","pending"],source:"",show_annotations:!0,show_labels:!1,group_by_name:!1,refresh_interval:30}}_canCreateAlert(){return!1}_hasThresholds(){return!1}_sections(){const e=["firing","pending","inactive"].map(e=>({value:e,label:Xe(`state_${e}`,this.hass)})),t=ns({legend:!1,query:!1},{name:"source",selector:{select:{mode:"dropdown",options:["","prometheus","local"].map(e=>({value:e,label:Xe(`source_${e||"all"}`,this.hass)}))}}},{name:"min_active",selector:{text:{}}},{name:"severities",selector:{text:{}}},{name:"name_filter",selector:{text:{}}});return t.schema.push({name:"states",selector:{select:{multiple:!0,mode:"list",options:e}}}),[rs(),t,os({name:"show_annotations",selector:{boolean:{}}},{name:"show_labels",selector:{boolean:{}}},{name:"group_by_name",selector:{boolean:{}}},{name:"max_rows",selector:{number:{min:1,max:200,mode:"box"}}})]}};Al=e([ue("prometheus-alerts-card-editor")],Al);const Sl=e=>JSON.stringify(Object.entries(e.labels).sort(([e],[t])=>e.localeCompare(t))),El=new Set(["alertname","severity"]);let Cl=class extends tt{constructor(){super(...arguments),this._alerts=[],this._loaded=!1,this._silencing={}}static get styles(){return[Ye,l`
        .list { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; }
        .list.fill { min-height: 0; }
        .series-count { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
        .alert { display: flex; gap: 10px; padding: 8px 10px; border-radius: 8px;
          background: var(--secondary-background-color, rgba(127, 127, 127, 0.08)); border-left: 4px solid var(--sev); }
        .alert.pending { opacity: 0.75; border-left-style: dashed; }
        .body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
        .title { display: flex; gap: 8px; align-items: baseline; }
        .alertname { font-weight: 600; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .badge { font-size: 10px; text-transform: uppercase; padding: 1px 6px; border-radius: 8px; color: #fff; background: var(--sev); white-space: nowrap; }
        .time { margin-left: auto; font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
        .summary { font-size: 12px; color: var(--primary-text-color); }
        .labels { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
        .label { font-size: 10px; padding: 1px 6px; border-radius: 6px; background: var(--card-background-color); color: var(--secondary-text-color); }
        .alert.silenced { opacity: 0.6; }
        .silence, .silenced { align-self: center; display: inline-flex; align-items: center; gap: 4px; font-size: 11px;
          color: var(--secondary-text-color); white-space: nowrap; --mdc-icon-size: 16px; }
        .silence { border: 1px solid var(--divider-color); background: none; border-radius: 12px; padding: 2px 8px;
          cursor: pointer; font: inherit; font-size: 11px; color: var(--primary-color); }
        .silence[disabled] { opacity: 0.5; cursor: default; }
        .notice { font-size: 12px; color: var(--secondary-text-color); margin-top: 6px; }
        .ok { display: flex; align-items: center; gap: 8px; color: var(--success-color, #43a047); font-size: 14px; padding: 8px 0; }
      `]}static getStubConfig(){return{type:"custom:prometheus-alerts-card",title:"Alerts",show_annotations:!0}}static getConfigElement(){return document.createElement("prometheus-alerts-card-editor")}_hasQuery(){return!0}async _fetchData(){try{this._loading=!0,this._alerts=await this._client.getAlerts(),this._error=void 0,void 0===this._canSilence&&(this._canSilence=await this._alertmanagerConfigured())}catch(e){this._error=this._formatError(e)}finally{this._loading=!1,this._loaded=!0}}async _alertmanagerConfigured(){if(this._client.demo||!_s(this._hass))return!1;try{const e=await Ke.getEntries(this._hass),t=this._config.entry_id?e.find(e=>e.entry_id===this._config.entry_id):e.find(e=>!1!==e.loaded);return Boolean(t?.alertmanager)}catch{return!1}}async _silence(e,t){t.stopPropagation();const s=Sl(e);this._silencing={...this._silencing,[s]:!0};try{await this._client.silence(e.labels),this._alerts=this._alerts.map(e=>Sl(e)===s?{...e,silenced:!0}:e),this._notice=Xe("silence_done",this._hass)}catch(e){this._notice=this._formatError(e)}this._silencing={...this._silencing,[s]:!1}}_renderSilence(e,t){if(e.silenced){const t=e.silenced_until?new Date(e.silenced_until):void 0,s=t&&!Number.isNaN(t.getTime())?t.toLocaleString(this._hass?.locale?.language):"";return U`<span class="silenced" title=${s?Xe("silenced_until",this._hass,{time:s}):""}>
        <ha-icon icon="mdi:bell-off-outline"></ha-icon>${Xe("silenced",this._hass)}
      </span>`}return!this._canSilence||t>1||"inactive"===e.state?Q:U`<button class="silence" ?disabled=${this._silencing[Sl(e)]} @click=${t=>this._silence(e,t)}>
      <ha-icon icon="mdi:bell-off-outline"></ha-icon>${Xe("silence",this._hass)}
    </button>`}_renderAlert(e,t=1,s=!1){const i=this._config,r=e.labels.severity,n=e.annotations?.summary||e.annotations?.description,o=Object.entries(e.labels).filter(([e])=>!El.has(e));return U`
      <div class="alert ${e.state} ${e.silenced?"silenced":""}" style="--sev:${function(e){switch((e||"").toLowerCase()){case"critical":case"error":return"#F2495C";case"warning":return"#FF9830";case"info":return"#5794F2";default:return"#8E8E8E"}}(r)}">
        <div class="body">
          <div class="title">
            <span class="alertname" title=${e.labels.alertname}>${e.labels.alertname}</span>
            ${r?U`<span class="badge">${r}</span>`:Q}
            ${t>1?U`<span class="series-count">× ${t}</span>`:Q}
            <span class="time" title=${e.activeAt||""}>
              ${"pending"===e.state?`${Xe("state_pending",this._hass)} · `:""}${function(e,t=Date.now()){if(!e)return"";const s=Date.parse(e);if(Number.isNaN(s))return"";let i=Math.max(0,Math.floor((t-s)/1e3));const r=Math.floor(i/86400);i-=86400*r;const n=Math.floor(i/3600);i-=3600*n;const o=Math.floor(i/60);return r?`${r}d ${n}h`:n?`${n}h ${o}m`:`${o}m`}(e.activeAt)}
            </span>
          </div>
          ${!1!==i.show_annotations&&n?U`<div class="summary">${n}</div>`:Q}
          ${(i.show_labels||s)&&1===t&&o.length?U`<div class="labels">${o.map(([e,t])=>U`<span class="label">${e}=${t}</span>`)}</div>`:Q}
        </div>
        ${this._renderSilence(e,t)}
      </div>
    `}render(){const e=this._config;if(this._error)return this.renderError();if(!this._loaded)return this.renderLoading();const t=Ml(this._alerts,e);let s=e.group_by_name?function(e){const t=new Map;for(const s of e){const e=s.labels.alertname||"",i=t.get(e);i?i.count++:t.set(e,{alert:s,count:1})}return[...t.values()]}(t):t.map(e=>({alert:e,count:1}));const i=t.length;e.max_rows&&(s=s.slice(0,e.max_rows));const r=new Map;t.forEach(e=>r.set(e.labels.alertname,(r.get(e.labels.alertname)||0)+1));const n=i?U`<span class="card-extra">${i}</span>`:Q;return U`
      <ha-card>
        ${this.renderHeader(n)}
        ${s.length?U`<div class="list ${this._fixedHeight()?"fill":""}">
              ${s.map(e=>this._renderAlert(e.alert,e.count,(r.get(e.alert.labels.alertname)||0)>1))}
            </div>`:U`<div class="ok"><ha-icon icon="mdi:check-circle"></ha-icon>${Xe("no_alerts",this._hass)}</div>`}
        ${this._notice?U`<div class="notice">${this._notice}</div>`:Q}
      </ha-card>
    `}};function zl(e,t,s){const i=new Set;let r;try{r=s?new RegExp(s):void 0}catch{r=void 0}for(const s of e?.data?.result||[]){let e=s.metric?.[t];if(void 0!==e&&""!==e){if(r){const t=r.exec(e);if(!t)continue;e=t[1]??t[0]}i.add(e)}}return[...i].sort((e,t)=>e.localeCompare(t,void 0,{numeric:!0}))}function Pl(e,t){if(t.label_name)return t.label_name;const s=new Set;for(const t of e?.data?.result||[])Object.keys(t.metric||{}).forEach(e=>"__name__"!==e&&s.add(e));return 1===s.size?[...s][0]:s.has(t.name)?t.name:void 0}function Tl(e,t,s){const i=s=>t.includes(s)||e.include_all&&s===He;if(void 0!==s){const t=(Array.isArray(s)?s:[s]).filter(i);if(t.length)return e.multi?t:t[0]}return void 0!==e.default&&i(e.default)?e.multi?[e.default]:e.default:e.include_all?e.multi?[He]:He:t.length?e.multi?[t[0]]:t[0]:e.multi?[]:""}e([_e()],Cl.prototype,"_alerts",void 0),e([_e()],Cl.prototype,"_loaded",void 0),e([_e()],Cl.prototype,"_canSilence",void 0),e([_e()],Cl.prototype,"_silencing",void 0),e([_e()],Cl.prototype,"_notice",void 0),Cl=e([ue("prometheus-alerts-card")],Cl);const Dl=[{name:"",type:"grid",schema:[{name:"name",required:!0,selector:{text:{}}},{name:"label",selector:{text:{}}}]},{name:"query",selector:{text:{multiline:!0}}},{name:"",type:"grid",schema:[{name:"label_name",selector:{text:{}}},{name:"regex",selector:{text:{}}},{name:"values",selector:{text:{multiple:!0}}},{name:"default",selector:{text:{}}},{name:"multi",selector:{boolean:{}}},{name:"include_all",selector:{boolean:{}}}]}];let Bl=class extends Ps{_defaults(){return{layout:"row",refresh_interval:300}}_hasThresholds(){return!1}_canCreateAlert(){return!1}_sections(){const e=["row","column"].map(e=>({value:e,label:Xe(`layout_${e}`,this.hass)}));return[{title:"section_panel",schema:[es,{name:"",type:"grid",schema:[Xt,{name:"layout",selector:{select:{mode:"dropdown",options:e}}}]}]},{title:"section_query",schema:[Yt,Jt]}]}_renderExtra(){const e=this._config;return U`
      <div class="section-title">${Xe("section_variables",this.hass)}</div>
      <div class="helper">${Xe("helper_variables",this.hass)}</div>
      <prometheus-list-editor
        .hass=${this.hass}
        .items=${e.variables||[]}
        .schema=${Dl}
        .entryId=${e.entry_id||void 0}
        .queryAlerts=${!1}
        .itemTitle=${Xe("variable_n",this.hass)}
        .newItem=${()=>({name:`var${(e.variables?.length||0)+1}`,query:"up",label_name:"instance"})}
        .addLabel=${Xe("add_variable",this.hass)}
        @value-changed=${e=>{e.stopPropagation(),this._updateConfig({variables:e.detail.value})}}
      ></prometheus-list-editor>
    `}};Bl=e([ue("prometheus-variables-card-editor")],Bl);let ql=class extends tt{constructor(){super(...arguments),this._options={},this._values={},this._loaded=!1}static get styles(){return[Ye,l`
        ha-card { padding: 12px 16px; }
        .vars { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: flex-end; }
        .vars.column { flex-direction: column; align-items: stretch; }
        label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--secondary-text-color); min-width: 140px; }
        select {
          font: inherit; font-size: 14px; color: var(--primary-text-color);
          background: var(--input-fill-color, var(--secondary-background-color, rgba(127, 127, 127, 0.1)));
          border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3)); border-radius: 6px; padding: 6px 8px;
        }
        select[multiple] { min-height: 64px; }
        .err { color: var(--error-color, #db4437); font-size: 12px; margin-top: 6px; }
      `]}static getStubConfig(){return{type:"custom:prometheus-variables-card",variables:[{name:"instance",label:"Instance",query:"up",label_name:"instance",include_all:!0,multi:!0}]}}static getConfigElement(){return document.createElement("prometheus-variables-card-editor")}setConfig(e){super.setConfig({...e,variables:Array.isArray(e.variables)?e.variables:[]})}_defaultColumns(){return 12}getCardSize(){return 1}_hasQuery(){return(this._config.variables||[]).length>0}_queryTemplate(){return(this._config.variables||[]).map(e=>e.query||"").join("\n")}async _fetchData(){const e={},t={},s=[];for(const i of this._config.variables){if(!i.name)continue;let r=(i.values||[]).map(String);if(i.query)try{const e=await this._client.instantQuery(i.query),t=Pl(e,i);r=t?zl(e,t,i.regex):[]}catch(e){s.push(`${i.name}: ${this._formatError(e)}`)}e[i.name]=r;const n=this._client.demo;t[i.name]=Tl(i,r,n?this._values[i.name]:je(i.name)),n||(Ie(i.name,r),Ve({[i.name]:t[i.name]}))}this._options=e,this._values=t,this._error=s.length?s.join("; "):void 0,this._loaded=!0}_change(e,t){const s=t.target;let i=e.multi?[...s.selectedOptions].map(e=>e.value):s.value;if(Array.isArray(i)&&i.length>1&&i.includes(He)){i=[].concat(this._values[e.name]||[]).includes(He)?i.filter(e=>e!==He):[He]}this._values={...this._values,[e.name]:i},this._client.demo||Ve({[e.name]:i})}_renderVariable(e){const t=this._options[e.name]||[],s=this._values[e.name],i=e=>Array.isArray(s)?s.includes(e):s===e;return U`<label>
      ${e.label||e.name}
      <select ?multiple=${Boolean(e.multi)} @change=${t=>this._change(e,t)}>
        ${e.include_all?U`<option value=${He} ?selected=${i(He)}>${Xe("var_all",this._hass)}</option>`:Q}
        ${t.map(e=>U`<option value=${e} ?selected=${i(e)}>${e}</option>`)}
      </select>
    </label>`}render(){const e=this._config;return e.variables.length?U`
      <ha-card>
        ${this.renderHeader()}
        <div class="vars ${"column"===e.layout?"column":""}">
          ${e.variables.filter(e=>e.name).map(e=>this._renderVariable(e))}
        </div>
        ${this._error?U`<div class="err">${this._error}</div>`:Q}
        ${this._loaded||this._error?Q:U`<div class="loading-state"></div>`}
      </ha-card>
    `:this.renderPlaceholder("no_variables")}};e([_e()],ql.prototype,"_options",void 0),e([_e()],ql.prototype,"_values",void 0),e([_e()],ql.prototype,"_loaded",void 0),ql=e([ue("prometheus-variables-card")],ql);const Ll=[{type:"prometheus-stat-card",key:"stat"},{type:"prometheus-gauge-card",key:"gauge"},{type:"prometheus-timeseries-card",key:"timeseries"},{type:"prometheus-bar-card",key:"bar"},{type:"prometheus-state-timeline-card",key:"timeline"},{type:"prometheus-pie-card",key:"pie"},{type:"prometheus-bar-gauge-card",key:"bargauge"},{type:"prometheus-table-card",key:"table"},{type:"prometheus-heatmap-card",key:"heatmap"},{type:"prometheus-alerts-card",key:"alerts"},{type:"prometheus-variables-card",key:"variables"}],Hl=window;Hl.customCards=Hl.customCards||[];for(const e of Ll)Hl.customCards.some(t=>t.type===e.type)||Hl.customCards.push({type:e.type,name:Xe(`${e.key}_name`),description:Xe(`${e.key}_desc`),preview:!0,documentationURL:"https://github.com/1orgar/ha_prom_graph_cards"});console.info("%c PROMETHEUS-CARDS %c v0.8.0 ","color: white; background: #e65100; font-weight: bold;","color: #e65100; background: white; font-weight: bold;");
