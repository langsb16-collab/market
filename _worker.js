var wt=Object.defineProperty;var Be=e=>{throw TypeError(e)};var _t=(e,t,s)=>t in e?wt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s;var f=(e,t,s)=>_t(e,typeof t!="symbol"?t+"":t,s),Ce=(e,t,s)=>t.has(e)||Be("Cannot "+s);var o=(e,t,s)=>(Ce(e,t,"read from private field"),s?s.call(e):t.get(e)),b=(e,t,s)=>t.has(e)?Be("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,s),m=(e,t,s,r)=>(Ce(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s),g=(e,t,s)=>(Ce(e,t,"access private method"),s);var Ie=(e,t,s,r)=>({set _(a){m(e,t,a,s)},get _(){return o(e,t,r)}});var ze=(e,t,s)=>(r,a)=>{let n=-1;return i(0);async function i(c){if(c<=n)throw new Error("next() called multiple times");n=c;let l,d=!1,u;if(e[c]?(u=e[c][0][0],r.req.routeIndex=c):u=c===e.length&&a||void 0,u)try{l=await u(r,()=>i(c+1))}catch(p){if(p instanceof Error&&t)r.error=p,l=await t(p,r),d=!0;else throw p}else r.finalized===!1&&s&&(l=await s(r));return l&&(r.finalized===!1||d)&&(r.res=l),r}},Et=Symbol(),Rt=async(e,t=Object.create(null))=>{const{all:s=!1,dot:r=!1}=t,n=(e instanceof nt?e.raw.headers:e.headers).get("Content-Type");return n!=null&&n.startsWith("multipart/form-data")||n!=null&&n.startsWith("application/x-www-form-urlencoded")?St(e,{all:s,dot:r}):{}};async function St(e,t){const s=await e.formData();return s?kt(s,t):{}}function kt(e,t){const s=Object.create(null);return e.forEach((r,a)=>{t.all||a.endsWith("[]")?jt(s,a,r):s[a]=r}),t.dot&&Object.entries(s).forEach(([r,a])=>{r.includes(".")&&(Ot(s,r,a),delete s[r])}),s}var jt=(e,t,s)=>{e[t]!==void 0?Array.isArray(e[t])?e[t].push(s):e[t]=[e[t],s]:t.endsWith("[]")?e[t]=[s]:e[t]=s},Ot=(e,t,s)=>{let r=e;const a=t.split(".");a.forEach((n,i)=>{i===a.length-1?r[n]=s:((!r[n]||typeof r[n]!="object"||Array.isArray(r[n])||r[n]instanceof File)&&(r[n]=Object.create(null)),r=r[n])})},et=e=>{const t=e.split("/");return t[0]===""&&t.shift(),t},Tt=e=>{const{groups:t,path:s}=Ct(e),r=et(s);return At(r,t)},Ct=e=>{const t=[];return e=e.replace(/\{[^}]+\}/g,(s,r)=>{const a=`@${r}`;return t.push([a,s]),a}),{groups:t,path:e}},At=(e,t)=>{for(let s=t.length-1;s>=0;s--){const[r]=t[s];for(let a=e.length-1;a>=0;a--)if(e[a].includes(r)){e[a]=e[a].replace(r,t[s][1]);break}}return e},we={},Pt=(e,t)=>{if(e==="*")return"*";const s=e.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);if(s){const r=`${e}#${t}`;return we[r]||(s[2]?we[r]=t&&t[0]!==":"&&t[0]!=="*"?[r,s[1],new RegExp(`^${s[2]}(?=/${t})`)]:[e,s[1],new RegExp(`^${s[2]}$`)]:we[r]=[e,s[1],!0]),we[r]}return null},He=(e,t)=>{try{return t(e)}catch{return e.replace(/(?:%[0-9A-Fa-f]{2})+/g,s=>{try{return t(s)}catch{return s}})}},Dt=e=>He(e,decodeURI),tt=e=>{const t=e.url,s=t.indexOf("/",t.indexOf(":")+4);let r=s;for(;r<t.length;r++){const a=t.charCodeAt(r);if(a===37){const n=t.indexOf("?",r),i=t.slice(s,n===-1?void 0:n);return Dt(i.includes("%25")?i.replace(/%25/g,"%2525"):i)}else if(a===63)break}return t.slice(s,r)},Mt=e=>{const t=tt(e);return t.length>1&&t.at(-1)==="/"?t.slice(0,-1):t},se=(e,t,...s)=>(s.length&&(t=se(t,...s)),`${(e==null?void 0:e[0])==="/"?"":"/"}${e}${t==="/"?"":`${(e==null?void 0:e.at(-1))==="/"?"":"/"}${(t==null?void 0:t[0])==="/"?t.slice(1):t}`}`),st=e=>{if(e.charCodeAt(e.length-1)!==63||!e.includes(":"))return null;const t=e.split("/"),s=[];let r="";return t.forEach(a=>{if(a!==""&&!/\:/.test(a))r+="/"+a;else if(/\:/.test(a))if(/\?/.test(a)){s.length===0&&r===""?s.push("/"):s.push(r);const n=a.replace("?","");r+="/"+n,s.push(r)}else r+="/"+a}),s.filter((a,n,i)=>i.indexOf(a)===n)},Ae=e=>/[%+]/.test(e)?(e.indexOf("+")!==-1&&(e=e.replace(/\+/g," ")),e.indexOf("%")!==-1?He(e,at):e):e,rt=(e,t,s)=>{let r;if(!s&&t&&!/[%+]/.test(t)){let i=e.indexOf("?",8);if(i===-1)return;for(e.startsWith(t,i+1)||(i=e.indexOf(`&${t}`,i+1));i!==-1;){const c=e.charCodeAt(i+t.length+1);if(c===61){const l=i+t.length+2,d=e.indexOf("&",l);return Ae(e.slice(l,d===-1?void 0:d))}else if(c==38||isNaN(c))return"";i=e.indexOf(`&${t}`,i+1)}if(r=/[%+]/.test(e),!r)return}const a={};r??(r=/[%+]/.test(e));let n=e.indexOf("?",8);for(;n!==-1;){const i=e.indexOf("&",n+1);let c=e.indexOf("=",n);c>i&&i!==-1&&(c=-1);let l=e.slice(n+1,c===-1?i===-1?void 0:i:c);if(r&&(l=Ae(l)),n=i,l==="")continue;let d;c===-1?d="":(d=e.slice(c+1,i===-1?void 0:i),r&&(d=Ae(d))),s?(a[l]&&Array.isArray(a[l])||(a[l]=[]),a[l].push(d)):a[l]??(a[l]=d)}return t?a[t]:a},Ht=rt,Nt=(e,t)=>rt(e,t,!0),at=decodeURIComponent,$e=e=>He(e,at),ne,O,z,it,ot,De,q,Ue,nt=(Ue=class{constructor(e,t="/",s=[[]]){b(this,z);f(this,"raw");b(this,ne);b(this,O);f(this,"routeIndex",0);f(this,"path");f(this,"bodyCache",{});b(this,q,e=>{const{bodyCache:t,raw:s}=this,r=t[e];if(r)return r;const a=Object.keys(t)[0];return a?t[a].then(n=>(a==="json"&&(n=JSON.stringify(n)),new Response(n)[e]())):t[e]=s[e]()});this.raw=e,this.path=t,m(this,O,s),m(this,ne,{})}param(e){return e?g(this,z,it).call(this,e):g(this,z,ot).call(this)}query(e){return Ht(this.url,e)}queries(e){return Nt(this.url,e)}header(e){if(e)return this.raw.headers.get(e)??void 0;const t={};return this.raw.headers.forEach((s,r)=>{t[r]=s}),t}async parseBody(e){var t;return(t=this.bodyCache).parsedBody??(t.parsedBody=await Rt(this,e))}json(){return o(this,q).call(this,"text").then(e=>JSON.parse(e))}text(){return o(this,q).call(this,"text")}arrayBuffer(){return o(this,q).call(this,"arrayBuffer")}blob(){return o(this,q).call(this,"blob")}formData(){return o(this,q).call(this,"formData")}addValidatedData(e,t){o(this,ne)[e]=t}valid(e){return o(this,ne)[e]}get url(){return this.raw.url}get method(){return this.raw.method}get[Et](){return o(this,O)}get matchedRoutes(){return o(this,O)[0].map(([[,e]])=>e)}get routePath(){return o(this,O)[0].map(([[,e]])=>e)[this.routeIndex].path}},ne=new WeakMap,O=new WeakMap,z=new WeakSet,it=function(e){const t=o(this,O)[0][this.routeIndex][1][e],s=g(this,z,De).call(this,t);return s&&/\%/.test(s)?$e(s):s},ot=function(){const e={},t=Object.keys(o(this,O)[0][this.routeIndex][1]);for(const s of t){const r=g(this,z,De).call(this,o(this,O)[0][this.routeIndex][1][s]);r!==void 0&&(e[s]=/\%/.test(r)?$e(r):r)}return e},De=function(e){return o(this,O)[1]?o(this,O)[1][e]:e},q=new WeakMap,Ue),Bt={Stringify:1},lt=async(e,t,s,r,a)=>{typeof e=="object"&&!(e instanceof String)&&(e instanceof Promise||(e=e.toString()),e instanceof Promise&&(e=await e));const n=e.callbacks;return n!=null&&n.length?(a?a[0]+=e:a=[e],Promise.all(n.map(c=>c({phase:t,buffer:a,context:r}))).then(c=>Promise.all(c.filter(Boolean).map(l=>lt(l,t,!1,r,a))).then(()=>a[0]))):Promise.resolve(e)},It="text/plain; charset=UTF-8",Pe=(e,t)=>({"Content-Type":e,...t}),he,be,H,ie,N,j,ge,oe,le,K,xe,ye,F,re,Ve,zt=(Ve=class{constructor(e,t){b(this,F);b(this,he);b(this,be);f(this,"env",{});b(this,H);f(this,"finalized",!1);f(this,"error");b(this,ie);b(this,N);b(this,j);b(this,ge);b(this,oe);b(this,le);b(this,K);b(this,xe);b(this,ye);f(this,"render",(...e)=>(o(this,oe)??m(this,oe,t=>this.html(t)),o(this,oe).call(this,...e)));f(this,"setLayout",e=>m(this,ge,e));f(this,"getLayout",()=>o(this,ge));f(this,"setRenderer",e=>{m(this,oe,e)});f(this,"header",(e,t,s)=>{this.finalized&&m(this,j,new Response(o(this,j).body,o(this,j)));const r=o(this,j)?o(this,j).headers:o(this,K)??m(this,K,new Headers);t===void 0?r.delete(e):s!=null&&s.append?r.append(e,t):r.set(e,t)});f(this,"status",e=>{m(this,ie,e)});f(this,"set",(e,t)=>{o(this,H)??m(this,H,new Map),o(this,H).set(e,t)});f(this,"get",e=>o(this,H)?o(this,H).get(e):void 0);f(this,"newResponse",(...e)=>g(this,F,re).call(this,...e));f(this,"body",(e,t,s)=>g(this,F,re).call(this,e,t,s));f(this,"text",(e,t,s)=>!o(this,K)&&!o(this,ie)&&!t&&!s&&!this.finalized?new Response(e):g(this,F,re).call(this,e,t,Pe(It,s)));f(this,"json",(e,t,s)=>g(this,F,re).call(this,JSON.stringify(e),t,Pe("application/json",s)));f(this,"html",(e,t,s)=>{const r=a=>g(this,F,re).call(this,a,t,Pe("text/html; charset=UTF-8",s));return typeof e=="object"?lt(e,Bt.Stringify,!1,{}).then(r):r(e)});f(this,"redirect",(e,t)=>{const s=String(e);return this.header("Location",/[^\x00-\xFF]/.test(s)?encodeURI(s):s),this.newResponse(null,t??302)});f(this,"notFound",()=>(o(this,le)??m(this,le,()=>new Response),o(this,le).call(this,this)));m(this,he,e),t&&(m(this,N,t.executionCtx),this.env=t.env,m(this,le,t.notFoundHandler),m(this,ye,t.path),m(this,xe,t.matchResult))}get req(){return o(this,be)??m(this,be,new nt(o(this,he),o(this,ye),o(this,xe))),o(this,be)}get event(){if(o(this,N)&&"respondWith"in o(this,N))return o(this,N);throw Error("This context has no FetchEvent")}get executionCtx(){if(o(this,N))return o(this,N);throw Error("This context has no ExecutionContext")}get res(){return o(this,j)||m(this,j,new Response(null,{headers:o(this,K)??m(this,K,new Headers)}))}set res(e){if(o(this,j)&&e){e=new Response(e.body,e);for(const[t,s]of o(this,j).headers.entries())if(t!=="content-type")if(t==="set-cookie"){const r=o(this,j).headers.getSetCookie();e.headers.delete("set-cookie");for(const a of r)e.headers.append("set-cookie",a)}else e.headers.set(t,s)}m(this,j,e),this.finalized=!0}get var(){return o(this,H)?Object.fromEntries(o(this,H)):{}}},he=new WeakMap,be=new WeakMap,H=new WeakMap,ie=new WeakMap,N=new WeakMap,j=new WeakMap,ge=new WeakMap,oe=new WeakMap,le=new WeakMap,K=new WeakMap,xe=new WeakMap,ye=new WeakMap,F=new WeakSet,re=function(e,t,s){const r=o(this,j)?new Headers(o(this,j).headers):o(this,K)??new Headers;if(typeof t=="object"&&"headers"in t){const n=t.headers instanceof Headers?t.headers:new Headers(t.headers);for(const[i,c]of n)i.toLowerCase()==="set-cookie"?r.append(i,c):r.set(i,c)}if(s)for(const[n,i]of Object.entries(s))if(typeof i=="string")r.set(n,i);else{r.delete(n);for(const c of i)r.append(n,c)}const a=typeof t=="number"?t:(t==null?void 0:t.status)??o(this,ie);return new Response(e,{status:a,headers:r})},Ve),_="ALL",$t="all",qt=["get","post","put","delete","options","patch"],ct="Can not add a route since the matcher is already built.",dt=class extends Error{},Ft="__COMPOSED_HANDLER",Lt=e=>e.text("404 Not Found",404),qe=(e,t)=>{if("getResponse"in e){const s=e.getResponse();return t.newResponse(s.body,s)}return console.error(e),t.text("Internal Server Error",500)},C,E,pt,A,Y,_e,Ee,Ye,ut=(Ye=class{constructor(t={}){b(this,E);f(this,"get");f(this,"post");f(this,"put");f(this,"delete");f(this,"options");f(this,"patch");f(this,"all");f(this,"on");f(this,"use");f(this,"router");f(this,"getPath");f(this,"_basePath","/");b(this,C,"/");f(this,"routes",[]);b(this,A,Lt);f(this,"errorHandler",qe);f(this,"onError",t=>(this.errorHandler=t,this));f(this,"notFound",t=>(m(this,A,t),this));f(this,"fetch",(t,...s)=>g(this,E,Ee).call(this,t,s[1],s[0],t.method));f(this,"request",(t,s,r,a)=>t instanceof Request?this.fetch(s?new Request(t,s):t,r,a):(t=t.toString(),this.fetch(new Request(/^https?:\/\//.test(t)?t:`http://localhost${se("/",t)}`,s),r,a)));f(this,"fire",()=>{addEventListener("fetch",t=>{t.respondWith(g(this,E,Ee).call(this,t.request,t,void 0,t.request.method))})});[...qt,$t].forEach(n=>{this[n]=(i,...c)=>(typeof i=="string"?m(this,C,i):g(this,E,Y).call(this,n,o(this,C),i),c.forEach(l=>{g(this,E,Y).call(this,n,o(this,C),l)}),this)}),this.on=(n,i,...c)=>{for(const l of[i].flat()){m(this,C,l);for(const d of[n].flat())c.map(u=>{g(this,E,Y).call(this,d.toUpperCase(),o(this,C),u)})}return this},this.use=(n,...i)=>(typeof n=="string"?m(this,C,n):(m(this,C,"*"),i.unshift(n)),i.forEach(c=>{g(this,E,Y).call(this,_,o(this,C),c)}),this);const{strict:r,...a}=t;Object.assign(this,a),this.getPath=r??!0?t.getPath??tt:Mt}route(t,s){const r=this.basePath(t);return s.routes.map(a=>{var i;let n;s.errorHandler===qe?n=a.handler:(n=async(c,l)=>(await ze([],s.errorHandler)(c,()=>a.handler(c,l))).res,n[Ft]=a.handler),g(i=r,E,Y).call(i,a.method,a.path,n)}),this}basePath(t){const s=g(this,E,pt).call(this);return s._basePath=se(this._basePath,t),s}mount(t,s,r){let a,n;r&&(typeof r=="function"?n=r:(n=r.optionHandler,r.replaceRequest===!1?a=l=>l:a=r.replaceRequest));const i=n?l=>{const d=n(l);return Array.isArray(d)?d:[d]}:l=>{let d;try{d=l.executionCtx}catch{}return[l.env,d]};a||(a=(()=>{const l=se(this._basePath,t),d=l==="/"?0:l.length;return u=>{const p=new URL(u.url);return p.pathname=p.pathname.slice(d)||"/",new Request(p,u)}})());const c=async(l,d)=>{const u=await s(a(l.req.raw),...i(l));if(u)return u;await d()};return g(this,E,Y).call(this,_,se(t,"*"),c),this}},C=new WeakMap,E=new WeakSet,pt=function(){const t=new ut({router:this.router,getPath:this.getPath});return t.errorHandler=this.errorHandler,m(t,A,o(this,A)),t.routes=this.routes,t},A=new WeakMap,Y=function(t,s,r){t=t.toUpperCase(),s=se(this._basePath,s);const a={basePath:this._basePath,path:s,method:t,handler:r};this.router.add(t,s,[r,a]),this.routes.push(a)},_e=function(t,s){if(t instanceof Error)return this.errorHandler(t,s);throw t},Ee=function(t,s,r,a){if(a==="HEAD")return(async()=>new Response(null,await g(this,E,Ee).call(this,t,s,r,"GET")))();const n=this.getPath(t,{env:r}),i=this.router.match(a,n),c=new zt(t,{path:n,matchResult:i,env:r,executionCtx:s,notFoundHandler:o(this,A)});if(i[0].length===1){let d;try{d=i[0][0][0][0](c,async()=>{c.res=await o(this,A).call(this,c)})}catch(u){return g(this,E,_e).call(this,u,c)}return d instanceof Promise?d.then(u=>u||(c.finalized?c.res:o(this,A).call(this,c))).catch(u=>g(this,E,_e).call(this,u,c)):d??o(this,A).call(this,c)}const l=ze(i[0],this.errorHandler,o(this,A));return(async()=>{try{const d=await l(c);if(!d.finalized)throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");return d.res}catch(d){return g(this,E,_e).call(this,d,c)}})()},Ye),mt=[];function Wt(e,t){const s=this.buildAllMatchers(),r=(a,n)=>{const i=s[a]||s[_],c=i[2][n];if(c)return c;const l=n.match(i[0]);if(!l)return[[],mt];const d=l.indexOf("",1);return[i[1][d],l]};return this.match=r,r(e,t)}var Se="[^/]+",me=".*",fe="(?:|/.*)",ae=Symbol(),Ut=new Set(".\\+*[^]$()");function Vt(e,t){return e.length===1?t.length===1?e<t?-1:1:-1:t.length===1||e===me||e===fe?1:t===me||t===fe?-1:e===Se?1:t===Se?-1:e.length===t.length?e<t?-1:1:t.length-e.length}var J,X,P,Ge,Me=(Ge=class{constructor(){b(this,J);b(this,X);b(this,P,Object.create(null))}insert(t,s,r,a,n){if(t.length===0){if(o(this,J)!==void 0)throw ae;if(n)return;m(this,J,s);return}const[i,...c]=t,l=i==="*"?c.length===0?["","",me]:["","",Se]:i==="/*"?["","",fe]:i.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);let d;if(l){const u=l[1];let p=l[2]||Se;if(u&&l[2]&&(p===".*"||(p=p.replace(/^\((?!\?:)(?=[^)]+\)$)/,"(?:"),/\((?!\?:)/.test(p))))throw ae;if(d=o(this,P)[p],!d){if(Object.keys(o(this,P)).some(h=>h!==me&&h!==fe))throw ae;if(n)return;d=o(this,P)[p]=new Me,u!==""&&m(d,X,a.varIndex++)}!n&&u!==""&&r.push([u,o(d,X)])}else if(d=o(this,P)[i],!d){if(Object.keys(o(this,P)).some(u=>u.length>1&&u!==me&&u!==fe))throw ae;if(n)return;d=o(this,P)[i]=new Me}d.insert(c,s,r,a,n)}buildRegExpStr(){const s=Object.keys(o(this,P)).sort(Vt).map(r=>{const a=o(this,P)[r];return(typeof o(a,X)=="number"?`(${r})@${o(a,X)}`:Ut.has(r)?`\\${r}`:r)+a.buildRegExpStr()});return typeof o(this,J)=="number"&&s.unshift(`#${o(this,J)}`),s.length===0?"":s.length===1?s[0]:"(?:"+s.join("|")+")"}},J=new WeakMap,X=new WeakMap,P=new WeakMap,Ge),ke,ve,Ke,Yt=(Ke=class{constructor(){b(this,ke,{varIndex:0});b(this,ve,new Me)}insert(e,t,s){const r=[],a=[];for(let i=0;;){let c=!1;if(e=e.replace(/\{[^}]+\}/g,l=>{const d=`@\\${i}`;return a[i]=[d,l],i++,c=!0,d}),!c)break}const n=e.match(/(?::[^\/]+)|(?:\/\*$)|./g)||[];for(let i=a.length-1;i>=0;i--){const[c]=a[i];for(let l=n.length-1;l>=0;l--)if(n[l].indexOf(c)!==-1){n[l]=n[l].replace(c,a[i][1]);break}}return o(this,ve).insert(n,t,r,o(this,ke),s),r}buildRegExp(){let e=o(this,ve).buildRegExpStr();if(e==="")return[/^$/,[],[]];let t=0;const s=[],r=[];return e=e.replace(/#(\d+)|@(\d+)|\.\*\$/g,(a,n,i)=>n!==void 0?(s[++t]=Number(n),"$()"):(i!==void 0&&(r[Number(i)]=++t),"")),[new RegExp(`^${e}`),s,r]}},ke=new WeakMap,ve=new WeakMap,Ke),Gt=[/^$/,[],Object.create(null)],Re=Object.create(null);function ft(e){return Re[e]??(Re[e]=new RegExp(e==="*"?"":`^${e.replace(/\/\*$|([.\\+*[^\]$()])/g,(t,s)=>s?`\\${s}`:"(?:|/.*)")}$`))}function Kt(){Re=Object.create(null)}function Jt(e){var d;const t=new Yt,s=[];if(e.length===0)return Gt;const r=e.map(u=>[!/\*|\/:/.test(u[0]),...u]).sort(([u,p],[h,v])=>u?1:h?-1:p.length-v.length),a=Object.create(null);for(let u=0,p=-1,h=r.length;u<h;u++){const[v,R,x]=r[u];v?a[R]=[x.map(([w])=>[w,Object.create(null)]),mt]:p++;let y;try{y=t.insert(R,p,v)}catch(w){throw w===ae?new dt(R):w}v||(s[p]=x.map(([w,ee])=>{const de=Object.create(null);for(ee-=1;ee>=0;ee--){const[D,Oe]=y[ee];de[D]=Oe}return[w,de]}))}const[n,i,c]=t.buildRegExp();for(let u=0,p=s.length;u<p;u++)for(let h=0,v=s[u].length;h<v;h++){const R=(d=s[u][h])==null?void 0:d[1];if(!R)continue;const x=Object.keys(R);for(let y=0,w=x.length;y<w;y++)R[x[y]]=c[R[x[y]]]}const l=[];for(const u in i)l[u]=s[i[u]];return[n,l,a]}function te(e,t){if(e){for(const s of Object.keys(e).sort((r,a)=>a.length-r.length))if(ft(s).test(t))return[...e[s]]}}var L,W,je,ht,Je,Xt=(Je=class{constructor(){b(this,je);f(this,"name","RegExpRouter");b(this,L);b(this,W);f(this,"match",Wt);m(this,L,{[_]:Object.create(null)}),m(this,W,{[_]:Object.create(null)})}add(e,t,s){var c;const r=o(this,L),a=o(this,W);if(!r||!a)throw new Error(ct);r[e]||[r,a].forEach(l=>{l[e]=Object.create(null),Object.keys(l[_]).forEach(d=>{l[e][d]=[...l[_][d]]})}),t==="/*"&&(t="*");const n=(t.match(/\/:/g)||[]).length;if(/\*$/.test(t)){const l=ft(t);e===_?Object.keys(r).forEach(d=>{var u;(u=r[d])[t]||(u[t]=te(r[d],t)||te(r[_],t)||[])}):(c=r[e])[t]||(c[t]=te(r[e],t)||te(r[_],t)||[]),Object.keys(r).forEach(d=>{(e===_||e===d)&&Object.keys(r[d]).forEach(u=>{l.test(u)&&r[d][u].push([s,n])})}),Object.keys(a).forEach(d=>{(e===_||e===d)&&Object.keys(a[d]).forEach(u=>l.test(u)&&a[d][u].push([s,n]))});return}const i=st(t)||[t];for(let l=0,d=i.length;l<d;l++){const u=i[l];Object.keys(a).forEach(p=>{var h;(e===_||e===p)&&((h=a[p])[u]||(h[u]=[...te(r[p],u)||te(r[_],u)||[]]),a[p][u].push([s,n-d+l+1]))})}}buildAllMatchers(){const e=Object.create(null);return Object.keys(o(this,W)).concat(Object.keys(o(this,L))).forEach(t=>{e[t]||(e[t]=g(this,je,ht).call(this,t))}),m(this,L,m(this,W,void 0)),Kt(),e}},L=new WeakMap,W=new WeakMap,je=new WeakSet,ht=function(e){const t=[];let s=e===_;return[o(this,L),o(this,W)].forEach(r=>{const a=r[e]?Object.keys(r[e]).map(n=>[n,r[e][n]]):[];a.length!==0?(s||(s=!0),t.push(...a)):e!==_&&t.push(...Object.keys(r[_]).map(n=>[n,r[_][n]]))}),s?Jt(t):null},Je),U,B,Xe,Qt=(Xe=class{constructor(e){f(this,"name","SmartRouter");b(this,U,[]);b(this,B,[]);m(this,U,e.routers)}add(e,t,s){if(!o(this,B))throw new Error(ct);o(this,B).push([e,t,s])}match(e,t){if(!o(this,B))throw new Error("Fatal error");const s=o(this,U),r=o(this,B),a=s.length;let n=0,i;for(;n<a;n++){const c=s[n];try{for(let l=0,d=r.length;l<d;l++)c.add(...r[l]);i=c.match(e,t)}catch(l){if(l instanceof dt)continue;throw l}this.match=c.match.bind(c),m(this,U,[c]),m(this,B,void 0);break}if(n===a)throw new Error("Fatal error");return this.name=`SmartRouter + ${this.activeRouter.name}`,i}get activeRouter(){if(o(this,B)||o(this,U).length!==1)throw new Error("No active router has been determined yet.");return o(this,U)[0]}},U=new WeakMap,B=new WeakMap,Xe),pe=Object.create(null),V,k,Q,ce,S,I,G,Qe,bt=(Qe=class{constructor(e,t,s){b(this,I);b(this,V);b(this,k);b(this,Q);b(this,ce,0);b(this,S,pe);if(m(this,k,s||Object.create(null)),m(this,V,[]),e&&t){const r=Object.create(null);r[e]={handler:t,possibleKeys:[],score:0},m(this,V,[r])}m(this,Q,[])}insert(e,t,s){m(this,ce,++Ie(this,ce)._);let r=this;const a=Tt(t),n=[];for(let i=0,c=a.length;i<c;i++){const l=a[i],d=a[i+1],u=Pt(l,d),p=Array.isArray(u)?u[0]:l;if(p in o(r,k)){r=o(r,k)[p],u&&n.push(u[1]);continue}o(r,k)[p]=new bt,u&&(o(r,Q).push(u),n.push(u[1])),r=o(r,k)[p]}return o(r,V).push({[e]:{handler:s,possibleKeys:n.filter((i,c,l)=>l.indexOf(i)===c),score:o(this,ce)}}),r}search(e,t){var c;const s=[];m(this,S,pe);let a=[this];const n=et(t),i=[];for(let l=0,d=n.length;l<d;l++){const u=n[l],p=l===d-1,h=[];for(let v=0,R=a.length;v<R;v++){const x=a[v],y=o(x,k)[u];y&&(m(y,S,o(x,S)),p?(o(y,k)["*"]&&s.push(...g(this,I,G).call(this,o(y,k)["*"],e,o(x,S))),s.push(...g(this,I,G).call(this,y,e,o(x,S)))):h.push(y));for(let w=0,ee=o(x,Q).length;w<ee;w++){const de=o(x,Q)[w],D=o(x,S)===pe?{}:{...o(x,S)};if(de==="*"){const $=o(x,k)["*"];$&&(s.push(...g(this,I,G).call(this,$,e,o(x,S))),m($,S,D),h.push($));continue}const[Oe,Ne,ue]=de;if(!u&&!(ue instanceof RegExp))continue;const M=o(x,k)[Oe],vt=n.slice(l).join("/");if(ue instanceof RegExp){const $=ue.exec(vt);if($){if(D[Ne]=$[0],s.push(...g(this,I,G).call(this,M,e,o(x,S),D)),Object.keys(o(M,k)).length){m(M,S,D);const Te=((c=$[0].match(/\//))==null?void 0:c.length)??0;(i[Te]||(i[Te]=[])).push(M)}continue}}(ue===!0||ue.test(u))&&(D[Ne]=u,p?(s.push(...g(this,I,G).call(this,M,e,D,o(x,S))),o(M,k)["*"]&&s.push(...g(this,I,G).call(this,o(M,k)["*"],e,D,o(x,S)))):(m(M,S,D),h.push(M)))}}a=h.concat(i.shift()??[])}return s.length>1&&s.sort((l,d)=>l.score-d.score),[s.map(({handler:l,params:d})=>[l,d])]}},V=new WeakMap,k=new WeakMap,Q=new WeakMap,ce=new WeakMap,S=new WeakMap,I=new WeakSet,G=function(e,t,s,r){const a=[];for(let n=0,i=o(e,V).length;n<i;n++){const c=o(e,V)[n],l=c[t]||c[_],d={};if(l!==void 0&&(l.params=Object.create(null),a.push(l),s!==pe||r&&r!==pe))for(let u=0,p=l.possibleKeys.length;u<p;u++){const h=l.possibleKeys[u],v=d[l.score];l.params[h]=r!=null&&r[h]&&!v?r[h]:s[h]??(r==null?void 0:r[h]),d[l.score]=!0}}return a},Qe),Z,Ze,Zt=(Ze=class{constructor(){f(this,"name","TrieRouter");b(this,Z);m(this,Z,new bt)}add(e,t,s){const r=st(t);if(r){for(let a=0,n=r.length;a<n;a++)o(this,Z).insert(e,r[a],s);return}o(this,Z).insert(e,t,s)}match(e,t){return o(this,Z).search(e,t)}},Z=new WeakMap,Ze),gt=class extends ut{constructor(e={}){super(e),this.router=e.router??new Qt({routers:[new Xt,new Zt]})}},es=e=>{const s={...{origin:"*",allowMethods:["GET","HEAD","PUT","POST","DELETE","PATCH"],allowHeaders:[],exposeHeaders:[]},...e},r=(n=>typeof n=="string"?n==="*"?()=>n:i=>n===i?i:null:typeof n=="function"?n:i=>n.includes(i)?i:null)(s.origin),a=(n=>typeof n=="function"?n:Array.isArray(n)?()=>n:()=>[])(s.allowMethods);return async function(i,c){var u;function l(p,h){i.res.headers.set(p,h)}const d=await r(i.req.header("origin")||"",i);if(d&&l("Access-Control-Allow-Origin",d),s.credentials&&l("Access-Control-Allow-Credentials","true"),(u=s.exposeHeaders)!=null&&u.length&&l("Access-Control-Expose-Headers",s.exposeHeaders.join(",")),i.req.method==="OPTIONS"){s.origin!=="*"&&l("Vary","Origin"),s.maxAge!=null&&l("Access-Control-Max-Age",s.maxAge.toString());const p=await a(i.req.header("origin")||"",i);p.length&&l("Access-Control-Allow-Methods",p.join(","));let h=s.allowHeaders;if(!(h!=null&&h.length)){const v=i.req.header("Access-Control-Request-Headers");v&&(h=v.split(/\s*,\s*/))}return h!=null&&h.length&&(l("Access-Control-Allow-Headers",h.join(",")),i.res.headers.append("Vary","Access-Control-Request-Headers")),i.res.headers.delete("Content-Length"),i.res.headers.delete("Content-Type"),new Response(null,{headers:i.res.headers,status:204,statusText:"No Content"})}await c(),s.origin!=="*"&&i.header("Vary","Origin",{append:!0})}},ts=/^\s*(?:text\/(?!event-stream(?:[;\s]|$))[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i,Fe=(e,t=rs)=>{const s=/\.([a-zA-Z0-9]+?)$/,r=e.match(s);if(!r)return;let a=t[r[1]];return a&&a.startsWith("text")&&(a+="; charset=utf-8"),a},ss={aac:"audio/aac",avi:"video/x-msvideo",avif:"image/avif",av1:"video/av1",bin:"application/octet-stream",bmp:"image/bmp",css:"text/css",csv:"text/csv",eot:"application/vnd.ms-fontobject",epub:"application/epub+zip",gif:"image/gif",gz:"application/gzip",htm:"text/html",html:"text/html",ico:"image/x-icon",ics:"text/calendar",jpeg:"image/jpeg",jpg:"image/jpeg",js:"text/javascript",json:"application/json",jsonld:"application/ld+json",map:"application/json",mid:"audio/x-midi",midi:"audio/x-midi",mjs:"text/javascript",mp3:"audio/mpeg",mp4:"video/mp4",mpeg:"video/mpeg",oga:"audio/ogg",ogv:"video/ogg",ogx:"application/ogg",opus:"audio/opus",otf:"font/otf",pdf:"application/pdf",png:"image/png",rtf:"application/rtf",svg:"image/svg+xml",tif:"image/tiff",tiff:"image/tiff",ts:"video/mp2t",ttf:"font/ttf",txt:"text/plain",wasm:"application/wasm",webm:"video/webm",weba:"audio/webm",webmanifest:"application/manifest+json",webp:"image/webp",woff:"font/woff",woff2:"font/woff2",xhtml:"application/xhtml+xml",xml:"application/xml",zip:"application/zip","3gp":"video/3gpp","3g2":"video/3gpp2",gltf:"model/gltf+json",glb:"model/gltf-binary"},rs=ss,as=(...e)=>{let t=e.filter(a=>a!=="").join("/");t=t.replace(new RegExp("(?<=\\/)\\/+","g"),"");const s=t.split("/"),r=[];for(const a of s)a===".."&&r.length>0&&r.at(-1)!==".."?r.pop():a!=="."&&r.push(a);return r.join("/")||"."},xt={br:".br",zstd:".zst",gzip:".gz"},ns=Object.keys(xt),is="index.html",os=e=>{const t=e.root??"./",s=e.path,r=e.join??as;return async(a,n)=>{var u,p,h,v;if(a.finalized)return n();let i;if(e.path)i=e.path;else try{if(i=decodeURIComponent(a.req.path),/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(i))throw new Error}catch{return await((u=e.onNotFound)==null?void 0:u.call(e,a.req.path,a)),n()}let c=r(t,!s&&e.rewriteRequestPath?e.rewriteRequestPath(i):i);e.isDir&&await e.isDir(c)&&(c=r(c,is));const l=e.getContent;let d=await l(c,a);if(d instanceof Response)return a.newResponse(d.body,d);if(d){const R=e.mimes&&Fe(c,e.mimes)||Fe(c);if(a.header("Content-Type",R||"application/octet-stream"),e.precompressed&&(!R||ts.test(R))){const x=new Set((p=a.req.header("Accept-Encoding"))==null?void 0:p.split(",").map(y=>y.trim()));for(const y of ns){if(!x.has(y))continue;const w=await l(c+xt[y],a);if(w){d=w,a.header("Content-Encoding",y),a.header("Vary","Accept-Encoding",{append:!0});break}}}return await((h=e.onFound)==null?void 0:h.call(e,c,a)),a.body(d)}await((v=e.onNotFound)==null?void 0:v.call(e,c,a)),await n()}},ls=async(e,t)=>{let s;t&&t.manifest?typeof t.manifest=="string"?s=JSON.parse(t.manifest):s=t.manifest:typeof __STATIC_CONTENT_MANIFEST=="string"?s=JSON.parse(__STATIC_CONTENT_MANIFEST):s=__STATIC_CONTENT_MANIFEST;let r;t&&t.namespace?r=t.namespace:r=__STATIC_CONTENT;const a=s[e]||e;if(!a)return null;const n=await r.get(a,{type:"stream"});return n||null},cs=e=>async function(s,r){return os({...e,getContent:async n=>ls(n,{manifest:e.manifest,namespace:e.namespace?e.namespace:s.env?s.env.__STATIC_CONTENT:void 0})})(s,r)},ds=e=>cs(e);const T=new gt;T.use("/api/*",es());T.use("/static/*",ds({root:"./public"}));const Le={en:{title:"EventBET - Blockchain Betting Platform",subtitle:"Where Global Events Meet Your Predictions",description:"Your predictions meet real-world events",explore:"Explore Markets",categories:"Categories",trending:"Trending Markets",myBets:"My Bets",connectWallet:"Connect Wallet",totalVolume:"Total Volume",placeBet:"Place Bet",amount:"Amount",selectCrypto:"Select Cryptocurrency",potentialPayout:"Potential Payout",betHistory:"Bet History",resolvesOn:"Resolves on",volume:"Volume"},ko:{title:"EventBET(이벤트벳) - 예측 시장 블록체인 배팅 플랫폼",subtitle:"Where Global Events Meet Your Predictions",description:"전 세계 이슈와 당신의 예측이 만나는 곳",explore:"마켓 탐색",categories:"카테고리",trending:"인기 마켓",myBets:"내 베팅",connectWallet:"지갑 연결",totalVolume:"총 거래량",placeBet:"베팅하기",amount:"금액",selectCrypto:"암호화폐 선택",potentialPayout:"예상 수익",betHistory:"베팅 내역",resolvesOn:"결과 확정일",volume:"거래량"},zh:{title:"EventBET - 区块链博彩平台",subtitle:"Where Global Events Meet Your Predictions",description:"全球事件与您的预测相遇之处",explore:"探索市场",categories:"分类",trending:"热门市场",myBets:"我的投注",connectWallet:"连接钱包",totalVolume:"总交易量",placeBet:"下注",amount:"金额",selectCrypto:"选择加密货币",potentialPayout:"预期收益",betHistory:"投注历史",resolvesOn:"结算日期",volume:"交易量"},ja:{title:"EventBET - ブロックチェーンベッティングプラットフォーム",subtitle:"Where Global Events Meet Your Predictions",description:"世界のイベントとあなたの予測が出会う場所",explore:"マーケットを探す",categories:"カテゴリー",trending:"トレンドマーケット",myBets:"私のベット",connectWallet:"ウォレット接続",totalVolume:"総取引量",placeBet:"ベットする",amount:"金額",selectCrypto:"暗号通貨を選択",potentialPayout:"予想配当",betHistory:"ベット履歴",resolvesOn:"決済日",volume:"取引量"}};T.get("/api/categories",async e=>{const t=e.req.query("lang")||"en",{env:s}=e,{results:r}=await s.DB.prepare(`
    SELECT id, 
           name_${t} as name,
           slug, icon
    FROM categories
    ORDER BY id
  `).all();return e.json({categories:r})});T.get("/api/events",async e=>{const t=e.req.query("lang")||"en",s=e.req.query("category"),{env:r}=e;let a=`
    SELECT e.id, e.category_id,
           e.title_${t} as title,
           e.description_${t} as description,
           e.image_url, e.end_date, e.status, e.total_volume,
           c.name_${t} as category_name,
           c.slug as category_slug,
           c.icon as category_icon
    FROM events e
    JOIN categories c ON e.category_id = c.id
    WHERE e.status = 'active'
  `;s&&(a+=` AND c.slug = '${s}'`),a+=" ORDER BY e.total_volume DESC, e.created_at DESC";const{results:n}=await r.DB.prepare(a).all();for(const i of n){const{results:c}=await r.DB.prepare(`
      SELECT id, 
             name_${t} as name,
             probability, total_bets
      FROM outcomes
      WHERE event_id = ?
      ORDER BY probability DESC
    `).bind(i.id).all();i.outcomes=c}return e.json({events:n})});T.get("/api/events/:id",async e=>{const t=e.req.query("lang")||"en",s=e.req.param("id"),{env:r}=e,a=await r.DB.prepare(`
    SELECT e.id, e.category_id,
           e.title_${t} as title,
           e.description_${t} as description,
           e.resolution_criteria_${t} as resolution_criteria,
           e.image_url, e.end_date, e.resolution_date,
           e.status, e.total_volume,
           c.name_${t} as category_name,
           c.slug as category_slug,
           c.icon as category_icon
    FROM events e
    JOIN categories c ON e.category_id = c.id
    WHERE e.id = ?
  `).bind(s).first();if(!a)return e.json({error:"Event not found"},404);const{results:n}=await r.DB.prepare(`
    SELECT id, 
           name_${t} as name,
           probability, total_bets
    FROM outcomes
    WHERE event_id = ?
    ORDER BY probability DESC
  `).bind(s).all();return e.json({event:{...a,outcomes:n}})});T.post("/api/bets",async e=>{const{env:t}=e,{wallet_address:s,event_id:r,outcome_id:a,amount:n,crypto_type:i,crypto_amount:c,transaction_hash:l}=await e.req.json();if(!s||!r||!a||!n||!i||!c)return e.json({error:"Missing required fields"},400);let d=await t.DB.prepare(`
    SELECT id FROM users WHERE wallet_address = ?
  `).bind(s).first();d||(d={id:(await t.DB.prepare(`
      INSERT INTO users (wallet_address) VALUES (?)
    `).bind(s).run()).meta.last_row_id});const u=await t.DB.prepare(`
    SELECT probability FROM outcomes WHERE id = ?
  `).bind(a).first();if(!u)return e.json({error:"Outcome not found"},404);const p=u.probability,h=n/p,v=await t.DB.prepare(`
    INSERT INTO bets (
      user_id, event_id, outcome_id, amount, crypto_type, crypto_amount,
      probability_at_bet, potential_payout, status, transaction_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(d.id,r,a,n,i,c,p,h,l?"confirmed":"pending",l||null).run();await t.DB.prepare(`
    UPDATE outcomes 
    SET total_bets = total_bets + ?
    WHERE id = ?
  `).bind(n,a).run();const{results:R}=await t.DB.prepare(`
    SELECT id, total_bets FROM outcomes WHERE event_id = ?
  `).bind(r).all(),x=R.reduce((y,w)=>y+w.total_bets,0);for(const y of R){const w=x>0?y.total_bets/x:1/R.length;await t.DB.prepare(`
      UPDATE outcomes SET probability = ? WHERE id = ?
    `).bind(w,y.id).run()}return await t.DB.prepare(`
    UPDATE events SET total_volume = total_volume + ? WHERE id = ?
  `).bind(n,r).run(),e.json({success:!0,bet_id:v.meta.last_row_id,potential_payout:h})});T.get("/api/bets/:wallet",async e=>{const t=e.req.query("lang")||"en",s=e.req.param("wallet"),{env:r}=e,{results:a}=await r.DB.prepare(`
    SELECT b.id, b.amount, b.crypto_type, b.crypto_amount,
           b.probability_at_bet, b.potential_payout, b.status,
           b.created_at, b.confirmed_at,
           e.title_${t} as event_title,
           o.name_${t} as outcome_name,
           o.probability as current_probability
    FROM bets b
    JOIN events e ON b.event_id = e.id
    JOIN outcomes o ON b.outcome_id = o.id
    JOIN users u ON b.user_id = u.id
    WHERE u.wallet_address = ?
    ORDER BY b.created_at DESC
    LIMIT 50
  `).bind(s).all();return e.json({bets:a})});T.post("/api/submissions",async e=>{const{env:t}=e,s=await e.req.json(),r=["title_en","title_ko","title_zh","title_ja","wallet_address","crypto_type","outcomes"];for(const c of r)if(!s[c])return e.json({error:`Missing required field: ${c}`},400);if(s.crypto_type!=="USDT")return e.json({error:"Invalid crypto_type. Only USDT is supported"},400);const a=parseFloat(s.bet_limit_min)||1,n=parseFloat(s.bet_limit_max)||1e3;if(a<1||n>1e3||a>n)return e.json({error:"Invalid bet limits. Min: 1-1000, Max must be >= Min"},400);const i=await t.DB.prepare(`
    INSERT INTO user_submissions (
      title_en, title_ko, title_zh, title_ja,
      description_en, description_ko, description_zh, description_ja,
      bet_limit_min, bet_limit_max, crypto_type, outcomes,
      wallet_address, email, nickname, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `).bind(s.title_en,s.title_ko,s.title_zh,s.title_ja,s.description_en||"",s.description_ko||"",s.description_zh||"",s.description_ja||"",a,n,s.crypto_type,JSON.stringify(s.outcomes),s.wallet_address,s.email||null,s.nickname||null).run();return e.json({success:!0,submission_id:i.meta.last_row_id,message:"Submission received. It will be reviewed by admin."})});T.get("/api/submissions/:wallet",async e=>{const t=e.req.param("wallet"),{env:s}=e,{results:r}=await s.DB.prepare(`
    SELECT id, title_en, title_ko, title_zh, title_ja,
           crypto_type, bet_limit_min, bet_limit_max,
           status, created_at, admin_notes
    FROM user_submissions
    WHERE wallet_address = ?
    ORDER BY created_at DESC
  `).bind(t).all();return e.json({submissions:r})});T.get("/api/translations/:lang",e=>{const t=e.req.param("lang");return e.json(Le[t]||Le.en)});T.get("/",e=>e.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EventBET - Decentralized Prediction Market</title>
        <script src="https://cdn.tailwindcss.com"><\/script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            /* Apple-Inspired Design - Light Mode (Default) */
            body {
                background: linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%);
                color: #1d1d1f;
                transition: background 0.3s ease, color 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            }
            
            body.dark-mode {
                background: linear-gradient(180deg, #000000 0%, #1a1a1a 100%);
                color: #f5f5f7;
            }
            
            /* Apple-Style Header */
            .header {
                background: rgba(255, 255, 255, 0.72);
                backdrop-filter: saturate(180%) blur(20px);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
            }
            
            body.dark-mode .header {
                background: rgba(29, 29, 31, 0.72);
                backdrop-filter: saturate(180%) blur(20px);
                -webkit-backdrop-filter: saturate(180%) blur(20px);
                border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
            }
            
            /* Apple-Style Cards */
            .card {
                background: #ffffff;
                border: none;
                border-radius: 18px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            body.dark-mode .card {
                background: #1d1d1f;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 1px 4px rgba(0, 0, 0, 0.2);
            }
            
            .card:hover {
                transform: translateY(-4px) scale(1.01);
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
            }
            
            body.dark-mode .card:hover {
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
            }
            
            /* Line Clamp */
            .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            /* Image Styles */
            .card img {
                transition: transform 0.3s ease;
            }
            
            .card:hover img {
                transform: scale(1.05);
            }
            
            /* Apple-Style Buttons */
            .btn-primary {
                background: linear-gradient(180deg, #007aff 0%, #0051d5 100%);
                color: #ffffff;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                letter-spacing: -0.01em;
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
                transition: all 0.2s ease;
            }
            
            .btn-primary:hover {
                background: linear-gradient(180deg, #0051d5 0%, #003d99 100%);
                box-shadow: 0 4px 16px rgba(0, 122, 255, 0.4);
                transform: translateY(-1px);
            }
            
            .btn-category {
                background-color: rgba(120, 120, 128, 0.12);
                color: #1d1d1f;
                border: none;
                border-radius: 20px;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            
            body.dark-mode .btn-category {
                background-color: rgba(120, 120, 128, 0.24);
                color: #f5f5f7;
            }
            
            .btn-category:hover {
                background-color: rgba(120, 120, 128, 0.18);
                transform: scale(1.02);
            }
            
            body.dark-mode .btn-category:hover {
                background-color: rgba(120, 120, 128, 0.32);
            }
            
            .btn-category.active {
                background: linear-gradient(180deg, #007aff 0%, #0051d5 100%);
                color: #ffffff;
                box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
            }
            
            /* Outcome bars */
            .outcome-bar {
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
            }
            
            body.dark-mode .outcome-bar {
                background: #2a2a2a;
            }
            
            .outcome-fill {
                background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
                height: 100%;
                transition: width 0.3s ease;
            }
            
            /* Text colors */
            .text-secondary {
                color: #6b7280;
            }
            
            body.dark-mode .text-secondary {
                color: #9ca3af;
            }
            
            .text-accent {
                color: #3b82f6;
            }
            
            body.dark-mode .text-accent {
                color: #60a5fa;
            }
            
            /* Inputs and selects */
            select, input {
                background-color: #f9fafb;
                color: #000000;
                border: 1px solid #e0e0e0;
            }
            
            body.dark-mode select,
            body.dark-mode input {
                background-color: #1a1a1a;
                color: #ffffff;
                border: 1px solid #404040;
            }
            
            select:focus, input:focus {
                border-color: #3b82f6;
                outline: none;
            }
            
            /* Apple-Style Modal */
            .modal-content {
                background: #ffffff;
                border: none;
                border-radius: 20px;
                box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.08);
                backdrop-filter: blur(40px);
                -webkit-backdrop-filter: blur(40px);
            }
            
            body.dark-mode .modal-content {
                background: rgba(29, 29, 31, 0.95);
                box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4);
            }
            
            /* Theme toggle button */
            .theme-toggle {
                background-color: #f3f4f6;
                color: #000000;
                border: 1px solid #e0e0e0;
                cursor: pointer;
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                transition: all 0.3s ease;
            }
            
            body.dark-mode .theme-toggle {
                background-color: #2a2a2a;
                color: #ffffff;
                border: 1px solid #404040;
            }
            
            .theme-toggle:hover {
                background-color: #e5e7eb;
            }
            
            body.dark-mode .theme-toggle:hover {
                background-color: #3a3a3a;
            }
            
            /* Hide scrollbar */
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            
            /* Compact card design */
            .card {
                transition: all 0.2s ease;
            }
            
            .card h4 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                line-height: 1.4;
                min-height: 2.8em;
            }
            
            .card p {
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            
            /* Mobile text sizing */
            .mobile-text {
                font-size: 0.875rem;
            }
            
            /* Mobile optimizations */
            @media (max-width: 640px) {
                .mobile-text {
                    font-size: 0.75rem;
                }
                
                h1 {
                    font-size: 1.125rem !important;
                }
                
                h2 {
                    font-size: 1rem !important;
                    padding: 0.5rem 0.75rem;
                }
                
                h3 {
                    font-size: 0.875rem !important;
                }
                
                h4 {
                    font-size: 0.8rem !important;
                }
                
                .card {
                    padding: 0.625rem !important;
                    margin-bottom: 0.5rem;
                }
                
                .card h4 {
                    font-size: 0.8rem !important;
                    min-height: 2.2em;
                    line-height: 1.3;
                }
                
                .card p {
                    font-size: 0.7rem !important;
                }
                
                /* Header mobile optimization */
                .header {
                    padding: 0.5rem 0.75rem !important;
                }
                
                /* Button sizes */
                button {
                    font-size: 0.75rem !important;
                    padding: 0.375rem 0.625rem !important;
                }
                
                .btn-primary {
                    padding: 0.5rem 0.75rem !important;
                }
                
                /* Input/Select mobile */
                select, input, textarea {
                    font-size: 0.875rem !important;
                    padding: 0.5rem !important;
                }
                
                /* Category buttons mobile */
                .btn-category {
                    font-size: 0.7rem !important;
                    padding: 0.375rem 0.625rem !important;
                    white-space: nowrap;
                }
                
                /* Modal mobile */
                .modal-content {
                    margin: 0.5rem;
                    padding: 1rem !important;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                /* Hero section mobile */
                #heroTitle {
                    font-size: 0.875rem !important;
                    padding: 0.5rem 0.75rem !important;
                    line-height: 1.4;
                }
                
                #heroSubtitle {
                    font-size: 0.75rem !important;
                }
                
                #heroDescription {
                    font-size: 0.7rem !important;
                }
                
                /* Crypto icons */
                .text-accent.font-bold {
                    font-size: 1rem !important;
                }
                
                /* Grid spacing */
                .grid {
                    gap: 0.5rem !important;
                }
                
                /* Space adjustments */
                .space-x-2 > * + * {
                    margin-left: 0.25rem !important;
                }
                
                .space-x-4 > * + * {
                    margin-left: 0.5rem !important;
                }
                
                .space-x-6 > * + * {
                    margin-left: 0.75rem !important;
                }
                
                .mb-4 {
                    margin-bottom: 0.75rem !important;
                }
                
                .mb-6 {
                    margin-bottom: 1rem !important;
                }
                
                .mb-8 {
                    margin-bottom: 1.25rem !important;
                }
                
                /* Odds/Fee structure mobile */
                .card.p-4 {
                    padding: 0.75rem !important;
                }
                
                .card.p-6 {
                    padding: 1rem !important;
                }
                
                /* Form spacing mobile */
                .space-y-3 > * + * {
                    margin-top: 0.5rem !important;
                }
                
                .space-y-4 > * + * {
                    margin-top: 0.75rem !important;
                }
                
                /* Hide non-essential text on mobile */
                .hide-mobile {
                    display: none;
                }
            }
            
            /* Tablet optimization */
            @media (min-width: 641px) and (max-width: 1024px) {
                .card h4 {
                    font-size: 0.875rem;
                }
                
                .card p {
                    font-size: 0.8rem;
                }
            }
            
            /* Desktop optimization */
            @media (min-width: 1280px) {
                .card h4 {
                    font-size: 0.9rem;
                }
                .card p {
                    font-size: 0.8rem;
                }
            }
        </style>
    </head>
    <body class="min-h-screen">
        <!-- Header -->
        <header class="header sticky top-0 z-50">
            <div class="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                        <i class="fas fa-chart-line text-accent text-xl sm:text-2xl"></i>
                        <h1 class="text-lg sm:text-2xl font-bold mobile-text">EventBET</h1>
                    </div>
                    <div class="flex items-center space-x-2 sm:space-x-4">
                        <!-- Theme Toggle -->
                        <button id="themeToggle" class="theme-toggle text-xs sm:text-sm" title="Toggle Dark Mode">
                            <i class="fas fa-moon" id="themeIcon"></i>
                        </button>
                        <!-- Language Selector -->
                        <select id="langSelect" class="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 rounded-lg focus:border-blue-400 focus:outline-none">
                            <option value="en">🇬🇧 EN</option>
                            <option value="ko">🇰🇷 KO</option>
                            <option value="zh">🇨🇳 ZH</option>
                            <option value="ja">🇯🇵 JA</option>
                        </select>
                        <!-- Submit Issue Button -->
                        <button id="submitIssueBtn" class="btn-primary text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-lg mobile-text">
                            <i class="fas fa-plus-circle mr-1 sm:mr-2"></i>
                            <span>이슈 등록</span>
                        </button>
                        <button id="connectWalletBtn" class="btn-primary text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold shadow-lg mobile-text">
                            <i class="fas fa-wallet mr-1 sm:mr-2"></i>
                            <span id="walletBtnText">Connect Wallet</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div class="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
            <!-- Hero Section -->
            <div class="text-center mb-4 sm:mb-8">
                <h2 class="text-xl sm:text-3xl font-bold mb-2 sm:mb-3 text-red-500 border-2 border-red-500 inline-block px-4 py-2 rounded-lg" id="heroTitle">EventBET(이벤트벳) - 예측 시장 블록체인 배팅 플랫폼</h2>
                <p class="text-base sm:text-lg mb-2 mobile-text font-semibold" id="heroSubtitle">
                    Where Global Events Meet Your Predictions.
                </p>
                <p class="text-sm text-secondary mb-3 sm:mb-4 mobile-text" id="heroDescription">
                    전 세계 이슈와 당신의 예측이 만나는 곳.
                </p>
                <div class="flex justify-center text-xs mobile-text">
                    <div class="text-center">
                        <div class="text-accent font-bold text-lg sm:text-xl">₮ USDT (Tether)</div>
                        <p class="text-xs text-secondary mt-1">유일하게 지원되는 암호화폐</p>
                    </div>
                </div>
            </div>

            <!-- Categories Filter -->
            <div class="mb-4 sm:mb-6">
                <h3 class="text-base sm:text-lg font-bold mb-2 sm:mb-3 mobile-text" id="categoriesTitle">Categories</h3>
                <div id="categoriesContainer" class="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                    <!-- Categories will be loaded here -->
                </div>
            </div>

            <!-- Sort Filter -->
            <div class="mb-4 sm:mb-6">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <h3 class="text-lg sm:text-xl font-bold mobile-text" id="marketsTitle">
                        <span data-ko="인기 마켓" data-en="Popular Markets" data-zh="热门市场" data-ja="人気市場">인기 마켓</span>
                    </h3>
                    <div class="flex space-x-2 overflow-x-auto scrollbar-hide">
                        <button onclick="sortMarkets('date')" id="sort-date" class="btn-category active px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
                            <i class="fas fa-calendar mr-1"></i><span data-ko="날짜순서" data-en="Latest" data-zh="日期顺序" data-ja="日付順">날짜순서</span>
                        </button>
                        <button onclick="sortMarkets('volume')" id="sort-volume" class="btn-category px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
                            <i class="fas fa-chart-bar mr-1"></i><span data-ko="배팅규모" data-en="Volume" data-zh="交易量" data-ja="取引量">배팅규모</span>
                        </button>
                        <button onclick="sortMarkets('participants')" id="sort-participants" class="btn-category px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
                            <i class="fas fa-users mr-1"></i><span data-ko="참여인원" data-en="Participants" data-zh="参与人数" data-ja="参加者数">참여인원</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Markets Grid -->
            <div class="mb-6 sm:mb-8">
                <div id="marketsContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    <!-- Markets will be loaded here -->
                </div>
            </div>

            <!-- My Bets Section -->
            <div id="myBetsSection" class="hidden">
                <h3 class="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mobile-text" id="myBetsTitle">My Bets</h3>
                <div id="myBetsContainer" class="space-y-3 sm:space-y-4">
                    <!-- User bets will be loaded here -->
                </div>
            </div>

        <!-- Bet Modal -->
        <div id="betModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4">
            <div class="modal-content rounded-lg p-4 sm:p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 class="text-lg sm:text-2xl font-bold mobile-text" id="betModalTitle">Place Bet</h3>
                    <button id="closeBetModal" class="text-secondary hover:text-accent text-xl sm:text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div id="betModalContent">
                    <!-- Bet form will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Submit Issue Modal -->
        <div id="submitIssueModal" class="hidden fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
            <div class="modal-content rounded-lg p-4 sm:p-6 max-w-3xl w-full my-8">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg sm:text-2xl font-bold mobile-text">
                        <i class="fas fa-plus-circle mr-2 text-accent"></i>
                        이슈 등록하기
                    </h3>
                    <button id="closeSubmitModal" class="text-secondary hover:text-accent text-xl sm:text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="submitIssueForm" class="space-y-4">
                    <!-- Title Section -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-heading mr-2"></i>
                            이슈 제목 (4개 언어 필수)
                        </h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">🇰🇷 한국어 제목 *</label>
                                <input type="text" name="title_ko" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="예: 비트코인 2025년 말 $150,000 돌파?">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">🇬🇧 English Title *</label>
                                <input type="text" name="title_en" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="e.g., Bitcoin reaches $150,000 by end of 2025?">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">🇨🇳 中文标题 *</label>
                                <input type="text" name="title_zh" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="例如：比特币2025年底突破$150,000？">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">🇯🇵 日本語タイトル *</label>
                                <input type="text" name="title_ja" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="例：ビットコイン2025年末$150,000突破？">
                            </div>
                        </div>
                    </div>

                    <!-- Description Section (Optional) -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-align-left mr-2"></i>
                            설명 (선택사항)
                        </h4>
                        <div class="space-y-3">
                            <textarea name="description_ko" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="한국어 설명"></textarea>
                            <textarea name="description_en" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="English description"></textarea>
                            <textarea name="description_zh" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="中文描述"></textarea>
                            <textarea name="description_ja" rows="2" 
                                      class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                      placeholder="日本語の説明"></textarea>
                        </div>
                    </div>

                    <!-- Outcomes Section -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-list-check mr-2"></i>
                            결정 사항 (Yes/No) *
                        </h4>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-4">
                                <input type="radio" name="outcome_type" value="yes_no" checked class="w-4 h-4">
                                <label class="text-sm">Yes / No (예 / 아니오)</label>
                            </div>
                            <p class="text-xs text-secondary pl-8">
                                선택 결과는 자동으로 4개 언어로 변환됩니다
                            </p>
                        </div>
                    </div>

                    <!-- Betting Limits Section -->
                    <div class="card p-4">
                        <h4 class="font-semibold mb-3 text-accent">
                            <i class="fas fa-coins mr-2"></i>
                            1인당 배팅 한도 *
                        </h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-2">암호화폐 *</label>
                                <div class="px-4 py-3 rounded-lg border-2 border-green-500 bg-green-500 bg-opacity-20">
                                    <div class="flex items-center justify-center">
                                        <i class="fas fa-dollar-sign mr-2 text-green-500"></i>
                                        <span class="font-bold text-green-500">USDT (Tether)</span>
                                    </div>
                                    <p class="text-xs text-center text-secondary mt-1">유일하게 지원되는 암호화폐</p>
                                </div>
                                <input type="hidden" name="crypto_type" value="USDT" required>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-sm font-medium mb-1">최소 한도</label>
                                    <input type="number" name="bet_limit_min" min="1" max="1000" value="1" required 
                                           class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">최대 한도</label>
                                    <input type="number" name="bet_limit_max" min="1" max="1000" value="1000" required 
                                           class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm">
                                </div>
                            </div>
                            <p class="text-xs text-secondary">* 1개 ~ 1,000개 범위 내에서 설정</p>
                        </div>
                    </div>

                    <!-- User Info Section (Admin Only) -->
                    <div class="card p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500">
                        <h4 class="font-semibold mb-3 text-yellow-500">
                            <i class="fas fa-lock mr-2"></i>
                            운영자 전용 정보 (비공개)
                        </h4>
                        <div class="space-y-3">
                            <div>
                                <label class="block text-sm font-medium mb-1">지갑 주소 *</label>
                                <input type="text" name="wallet_address" required 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="0x... (배당 받을 지갑 주소)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">이메일</label>
                                <input type="email" name="email" 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="your@email.com (선택사항)">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">닉네임</label>
                                <input type="text" name="nickname" 
                                       class="w-full px-3 py-2 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
                                       placeholder="사용자 닉네임 (선택사항)">
                            </div>
                        </div>
                    </div>

                    <!-- Wallet Connection Warning (hidden by default) -->
                    <div id="walletWarningSubmit" class="hidden p-4 bg-yellow-500 bg-opacity-20 border-2 border-yellow-500 rounded-lg text-center">
                        <i class="fas fa-wallet text-2xl text-yellow-500 mb-2"></i>
                        <p class="text-sm font-bold mb-3">
                            <span class="lang-ko">이슈를 제출하려면 지갑을 연결해주세요</span>
                            <span class="lang-en hidden">Connect Wallet to Submit Issue</span>
                            <span class="lang-zh hidden">连接钱包以提交问题</span>
                            <span class="lang-ja hidden">ウォレットを接続して問題を提出してください</span>
                        </p>
                        <button type="button" onclick="closeModalAndConnectWalletSubmit()" 
                                class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold text-sm transition">
                            <i class="fas fa-plug mr-2"></i>
                            <span class="lang-ko">지갑 연결</span>
                            <span class="lang-en hidden">Connect Wallet</span>
                            <span class="lang-zh hidden">连接钱包</span>
                            <span class="lang-ja hidden">ウォレットを接続</span>
                        </button>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex space-x-3">
                        <button type="submit" id="submitIssueBtn2" class="flex-1 btn-primary py-3 rounded-lg font-semibold text-sm">
                            <i class="fas fa-paper-plane mr-2"></i>
                            제출하기
                        </button>
                        <button type="button" id="cancelSubmitBtn" class="px-6 py-3 rounded-lg font-semibold text-sm hover:bg-opacity-20">
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"><\/script>
        <script src="/static/app.js"><\/script>
    </body>
    </html>
  `));const We=new gt,us=Object.assign({"/src/index.tsx":T});let yt=!1;for(const[,e]of Object.entries(us))e&&(We.all("*",t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),We.notFound(t=>{let s;try{s=t.executionCtx}catch{}return e.fetch(t.req.raw,t.env,s)}),yt=!0);if(!yt)throw new Error("Can't import modules from ['/src/index.ts','/src/index.tsx','/app/server.ts']");export{We as default};
