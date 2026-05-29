// ==UserScript==
// @name         Squadrats on Google Maps
// @namespace    max.squadrats
// @version      1.0
// @description  Overlay your earned Squadrats / Squadratinhos grid on Google Maps for trip planning.
// @match        https://www.google.com/maps*
// @match        https://www.google.*/maps*
// @match        https://maps.google.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==
/*
  Your tiles come from Squadrats as Mapbox Vector Tiles, keyed by your Firebase UID:
    https://tiles1.squadrats.com/<UID>/trophies/<timestamp>/{z}/{x}/{y}.pbf
  CORS is open and the UID is the only "auth", so a plain fetch works. Google Maps puts
  center+zoom in the URL (@lat,lng,zoomz) and updates it via history.replaceState; we hook
  that, parse the view, and paint the tiles onto a fixed <canvas> with Web-Mercator math.

  IF IT EVER STOPS SHADING: your UID rotated (rare) or Google changed their URL format.
  Re-grab the UID from a logged-in squadrats.com tab (DevTools > Network > filter "pbf";
  the path segment right after the host is your UID) and update UID below.

  TOGGLES:  S = show/hide overlay   O = show/hide region outline

  Decoder below is @mapbox/vector-tile + pbf, bundled (MIT / ISC).
*/
(()=>{var V=(e,t)=>()=>(e&&(t=e(e=0)),t);var M=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);function C(e,t,i){let n=i.buf,r,s;if(s=n[i.pos++],r=(s&112)>>4,s<128||(s=n[i.pos++],r|=(s&127)<<3,s<128)||(s=n[i.pos++],r|=(s&127)<<10,s<128)||(s=n[i.pos++],r|=(s&127)<<17,s<128)||(s=n[i.pos++],r|=(s&127)<<24,s<128)||(s=n[i.pos++],r|=(s&1)<<31,s<128))return f(e,r,t);throw new Error("Expected varint not more than 10 bytes")}function f(e,t,i){return i?t*4294967296+(e>>>0):(t>>>0)*4294967296+(e>>>0)}function A(e,t,i){let n="",r=t;for(;r<i;){let s=e[r],h=null,o=s>239?4:s>223?3:s>191?2:1;if(r+o>i)break;let a,d,l;o===1?s<128&&(h=s):o===2?(a=e[r+1],(a&192)===128&&(h=(s&31)<<6|a&63,h<=127&&(h=null))):o===3?(a=e[r+1],d=e[r+2],(a&192)===128&&(d&192)===128&&(h=(s&15)<<12|(a&63)<<6|d&63,(h<=2047||h>=55296&&h<=57343)&&(h=null))):o===4&&(a=e[r+1],d=e[r+2],l=e[r+3],(a&192)===128&&(d&192)===128&&(l&192)===128&&(h=(s&15)<<18|(a&63)<<12|(d&63)<<6|l&63,(h<=65535||h>=1114112)&&(h=null))),h===null?(h=65533,o=1):h>65535&&(h-=65536,n+=String.fromCharCode(h>>>10&1023|55296),h=56320|h&1023),n+=String.fromCharCode(h),r+=o}return n}var B,S,D,T,P,I,y,k=V(()=>{B=12,S=typeof TextDecoder>"u"?null:new TextDecoder("utf-8"),D=0,T=1,P=2,I=5,y=class{constructor(t){this.buf=ArrayBuffer.isView(t)?t:new Uint8Array(t),this.dataView=new DataView(this.buf.buffer),this.pos=0,this.type=0,this._valueStart=-1,this.length=this.buf.length}readFields(t,i,n=this.length){let r;for(;r=this.nextField(n);)t(r,i,this);return i}readMessage(t,i){return this.readFields(t,i,this.readVarint()+this.pos)}readFixed32(){let t=this.dataView.getUint32(this.pos,!0);return this.pos+=4,t}readSFixed32(){let t=this.dataView.getInt32(this.pos,!0);return this.pos+=4,t}readFixed64(){let t=this.dataView.getUint32(this.pos,!0)+this.dataView.getUint32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readSFixed64(){let t=this.dataView.getUint32(this.pos,!0)+this.dataView.getInt32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readFloat(){let t=this.dataView.getFloat32(this.pos,!0);return this.pos+=4,t}readDouble(){let t=this.dataView.getFloat64(this.pos,!0);return this.pos+=8,t}readVarint(t){let i=this.buf,n=i[this.pos++];if(n<128)return n;let r=n&127,s;return s=i[this.pos++],r|=(s&127)<<7,s<128||(s=i[this.pos++],r|=(s&127)<<14,s<128)||(s=i[this.pos++],r|=(s&127)<<21,s<128)?r:(s=i[this.pos],r|=(s&15)<<28,C(r,t,this))}readSVarint(){let t=this.readVarint();return t%2===1?(t+1)/-2:t/2}readBoolean(){return!!this.readVarint()}readString(){let t=this.readVarint()+this.pos,i=this.pos;return this.pos=t,t-i>=B&&S?S.decode(this.buf.subarray(i,t)):A(this.buf,i,t)}readBytes(){let t=this.readVarint()+this.pos,i=this.buf.subarray(this.pos,t);return this.pos=t,i}readPackedVarint(t=[],i){let n=this.readPackedEnd();for(;this.pos<n;)t.push(this.readVarint(i));return t}readPackedSVarint(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readSVarint());return t}readPackedBoolean(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readBoolean());return t}readPackedFloat(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readFloat());return t}readPackedDouble(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readDouble());return t}readPackedFixed32(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readFixed32());return t}readPackedSFixed32(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readSFixed32());return t}readPackedFixed64(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readFixed64());return t}readPackedSFixed64(t=[]){let i=this.readPackedEnd();for(;this.pos<i;)t.push(this.readSFixed64());return t}readPackedEnd(){return this.type===P?this.readVarint()+this.pos:this.pos+1}nextField(t=this.length){if(this.pos===this._valueStart&&this.skip(this.type),this.pos>=t)return 0;let i=this.readVarint();return this.type=i&7,this._valueStart=this.pos,i>>>3}skip(t){let i=t&7;if(i===D)for(;this.buf[this.pos++]>127;);else if(i===P)this.pos=this.readVarint()+this.pos;else if(i===I)this.pos+=4;else if(i===T)this.pos+=8;else throw new Error(`Unimplemented type: ${i}`)}}});function x(e,t){this.x=e,this.y=t}var m=V(()=>{x.prototype={clone(){return new x(this.x,this.y)},add(e){return this.clone()._add(e)},sub(e){return this.clone()._sub(e)},multByPoint(e){return this.clone()._multByPoint(e)},divByPoint(e){return this.clone()._divByPoint(e)},mult(e){return this.clone()._mult(e)},div(e){return this.clone()._div(e)},rotate(e){return this.clone()._rotate(e)},rotateAround(e,t){return this.clone()._rotateAround(e,t)},matMult(e){return this.clone()._matMult(e)},unit(){return this.clone()._unit()},perp(){return this.clone()._perp()},round(){return this.clone()._round()},mag(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals(e){return this.x===e.x&&this.y===e.y},dist(e){return Math.sqrt(this.distSqr(e))},distSqr(e){let t=e.x-this.x,i=e.y-this.y;return t*t+i*i},angle(){return Math.atan2(this.y,this.x)},angleTo(e){return Math.atan2(this.y-e.y,this.x-e.x)},angleWith(e){return this.angleWithSep(e.x,e.y)},angleWithSep(e,t){return Math.atan2(this.x*t-this.y*e,this.x*e+this.y*t)},_matMult(e){let t=e[0]*this.x+e[1]*this.y,i=e[2]*this.x+e[3]*this.y;return this.x=t,this.y=i,this},_add(e){return this.x+=e.x,this.y+=e.y,this},_sub(e){return this.x-=e.x,this.y-=e.y,this},_mult(e){return this.x*=e,this.y*=e,this},_div(e){return this.x/=e,this.y/=e,this},_multByPoint(e){return this.x*=e.x,this.y*=e.y,this},_divByPoint(e){return this.x/=e.x,this.y/=e.y,this},_unit(){return this._div(this.mag()),this},_perp(){let e=this.y;return this.y=this.x,this.x=-e,this},_rotate(e){let t=Math.cos(e),i=Math.sin(e),n=t*this.x-i*this.y,r=i*this.x+t*this.y;return this.x=n,this.y=r,this},_rotateAround(e,t){let i=Math.cos(e),n=Math.sin(e),r=t.x+i*(this.x-t.x)-n*(this.y-t.y),s=t.y+n*(this.x-t.x)+i*(this.y-t.y);return this.x=r,this.y=s,this},_round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},constructor:x};x.convert=function(e){if(e instanceof x)return e;if(Array.isArray(e))return new x(+e[0],+e[1]);if(e.x!==void 0&&e.y!==void 0)return new x(+e.x,+e.y);throw new Error("Expected [x, y] or {x, y} point format")}});function L(e){let t=e.length;if(t<=1)return[e];let i=[],n,r;for(let s=0;s<t;s++){let h=U(e[s]);h!==0&&(r===void 0&&(r=h<0),r===h<0?(n&&i.push(n),n=[e[s]]):n&&n.push(e[s]))}return n&&i.push(n),i}function U(e){let t=0;for(let i=0,n=e.length,r=n-1,s,h;i<n;r=i++)s=e[i],h=e[r],t+=(h.x-s.x)*(s.y+h.y);return t}function H(e){let t=null,i=e.readVarint()+e.pos;for(;e.pos<i;){let n=e.readVarint();t=n===10?e.readString():n===21?e.readFloat():n===25?e.readDouble():n===32?e.readVarint(!0):n===40?e.readVarint():n===48?e.readSVarint():n===56?e.readBoolean():(e.skip(n),null)}if(t==null)throw new Error("unknown feature value");return t}var F,_,p,E=V(()=>{m();F=class{constructor(t,i,n,r,s){for(this.properties=Object.create(null),this.extent=n,this.type=0,this.id=void 0,this._pbf=t,this._geometry=-1,this._keys=r,this._values=s;t.pos<i;){let h=t.readVarint();if(h===8)this.id=t.readVarint();else if(h===18){let o=t.readVarint()+t.pos;for(;t.pos<o;){let a=r[t.readVarint()],d=s[t.readVarint()];this.properties[a]=d}}else h===24?this.type=t.readVarint():(h===34&&(this._geometry=t.pos),t.skip(h))}}loadGeometry(){if(this._geometry<0)throw new Error("feature has no geometry");let t=this._pbf;t.pos=this._geometry;let i=t.readVarint()+t.pos,n=[],r,s=1,h=0,o=0,a=0;for(;t.pos<i;){if(h<=0){let d=t.readVarint();if(s=d&7,h=d>>3,h===0)continue}if(h--,s===1)o+=t.readSVarint(),a+=t.readSVarint(),r&&n.push(r),r=[new x(o,a)];else if(s===2)o+=t.readSVarint(),a+=t.readSVarint(),r&&r.push(new x(o,a));else if(s===7)r&&r.push(r[0].clone());else throw new Error(`unknown command ${s}`)}return r&&n.push(r),n}bbox(){if(this._geometry<0)throw new Error("feature has no geometry");let t=this._pbf;t.pos=this._geometry;let i=t.readVarint()+t.pos,n=1,r=0,s=0,h=0,o=1/0,a=-1/0,d=1/0,l=-1/0;for(;t.pos<i;){if(r<=0){let w=t.readVarint();if(n=w&7,r=w>>3,r===0)continue}if(r--,n===1||n===2)s+=t.readSVarint(),h+=t.readSVarint(),s<o&&(o=s),s>a&&(a=s),h<d&&(d=h),h>l&&(l=h);else if(n!==7)throw new Error(`unknown command ${n}`)}return[o,d,a,l]}toGeoJSON(t,i,n){let r=this.extent*Math.pow(2,n),s=this.extent*t,h=this.extent*i,o=this.loadGeometry();function a(u){return[(u.x+s)*360/r-180,360/Math.PI*Math.atan(Math.exp((1-(u.y+h)*2/r)*Math.PI))-90]}function d(u){return u.map(a)}let l;if(this.type===1){let u=[];for(let g of o)u.push(g[0]);let c=d(u);l=u.length===1?{type:"Point",coordinates:c[0]}:{type:"MultiPoint",coordinates:c}}else if(this.type===2){let u=o.map(d);l=u.length===1?{type:"LineString",coordinates:u[0]}:{type:"MultiLineString",coordinates:u}}else if(this.type===3){let u=L(o),c=[];for(let g of u)c.push(g.map(d));l=c.length===1?{type:"Polygon",coordinates:c[0]}:{type:"MultiPolygon",coordinates:c}}else throw new Error("unknown feature type");let w={type:"Feature",geometry:l,properties:this.properties};return this.id!=null&&(w.id=this.id),w}};F.types=["Unknown","Point","LineString","Polygon"];_=class{constructor(t,i){for(this.version=1,this.name="",this.extent=4096,this.length=0,this._pbf=t,this._keys=[],this._values=[],this._features=[],i===void 0&&(i=t.length);t.pos<i;){let n=t.readVarint();n===10?this.name=t.readString():n===18?(this._features.push(t.pos),t.skip(n)):n===26?this._keys.push(t.readString()):n===34?this._values.push(H(t)):n===40?this.extent=t.readVarint():n===120?this.version=t.readVarint():t.skip(n)}this.length=this._features.length}feature(t){if(t<0||t>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[t];let i=this._pbf.readVarint()+this._pbf.pos;return new F(this._pbf,i,this.extent,this._keys,this._values)}};p=class{constructor(t,i=t.length){let n=Object.create(null);for(;t.pos<i;){let r=t.readVarint();if(r===26){let s=new _(t,t.readVarint()+t.pos);s.length&&(n[s.name]=s)}else t.skip(r)}this.layers=n}}});var R=M(()=>{k();E();window.__SQD_VT={PbfReader:y,VectorTile:p}});R();})();
/* ===== Squadrats overlay logic (decoder provided by inlined bundle above: window.__SQD_VT) ===== */
(() => {
  // ---------------- config ----------------
  const UID = 'YOUR_SQUADRATS_UID';
  const SERVER = 'https://tiles1.squadrats.com';
  const PLANNER = 'google-maps';
  const SRCZ_MAX = 12;            // trophies data max native zoom; overzoom above this
  const SHOW_INHO_FROM = 13;      // draw squadratinhos at/above this view zoom

  const COL_SQ   = 'rgba(102,51,153,0.25)';   // squadrats fill (purple)
  const COL_INHO = 'rgba(0,200,120,0.38)';    // squadratinhos fill (green)
  const COL_LINE = 'rgba(102,51,153,0.85)';   // region outline

  let enabled = true;
  let outline = false;
  let stopped = false;
  let warm = null;

  if (window.__sqdStop) { try { window.__sqdStop(); } catch (e) {} }

  const { PbfReader, VectorTile } = window.__SQD_VT;
  function decode(uint8) {
    const t = new VectorTile(new PbfReader(uint8));
    const out = {};
    for (const name of Object.keys(t.layers)) {
      const L = t.layers[name]; const feats = [];
      for (let i = 0; i < L.length; i++) feats.push({ geom: L.feature(i).loadGeometry() });
      out[name] = { extent: L.extent, feats };
    }
    return out;
  }

  // ---------------- web mercator (normalized 0..1) ----------------
  const normFromLngLat = (lng, lat) => {
    const s = Math.sin(lat * Math.PI / 180);
    return { x: (lng + 180) / 360, y: 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI) };
  };
  const getView = () => {
    const m = location.href.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
    return m ? { lat: +m[1], lng: +m[2], zoom: +m[3] } : null;
  };

  // ---------------- overlay canvas ----------------
  // Mount inside Google's map-tile container (the parent of the WebGL scene
  // canvas) so it sits above the tiles but BELOW Google's side panel, place
  // cards and controls, which live in sibling containers that stack on top.
  // Fall back to a fixed full-window layer if the container can't be found.
  const canvas = document.createElement('canvas');
  canvas.id = 'sqd-canvas';
  const ctx = canvas.getContext('2d');
  // Google's WebGL map canvas usually does NOT exist yet at document-idle, so we
  // can't mount into its container immediately. locateHost() finds it (excluding
  // our own canvas); ensureMounted() (re)parents the overlay the moment that
  // container appears or is swapped on navigation, falling back to a fixed layer
  // only while no map canvas exists.
  const locateHost = () => {
    const scene = document.querySelector('canvas:not(#sqd-canvas)');
    return scene ? scene.parentElement : null;
  };
  const place = (host) => {
    const parent = host || document.body;
    if (!parent) return; // body not ready yet (very early run); warm-up loop retries
    const fixed = !host;
    canvas.style.cssText = 'position:' + (fixed ? 'fixed' : 'absolute') +
      ';inset:0;pointer-events:none;z-index:1;transition:opacity .12s;';
    parent.appendChild(canvas);
  };
  const ensureMounted = () => {
    const host = locateHost();
    if (host) { if (canvas.parentElement !== host) place(host); }
    else if (!canvas.isConnected) place(null);
  };
  ensureMounted();

  const cache = new Map();
  let timestamp = null;
  const getTimestamp = async () => {
    if (timestamp) return timestamp;
    timestamp = (await (await fetch(`${SERVER}/${UID}/trophies/timestamp?planner=${PLANNER}`)).text()).trim();
    return timestamp;
  };
  const getTile = (z, x, y) => {
    const key = z + '/' + x + '/' + y;
    if (cache.has(key)) return cache.get(key);
    const pr = getTimestamp().then(ts => fetch(`${SERVER}/${UID}/trophies/${ts}/${z}/${x}/${y}.pbf`))
      .then(async r => r.status === 200 ? decode(new Uint8Array(await r.arrayBuffer())) : null)
      .catch(() => null);
    cache.set(key, pr);
    return pr;
  };

  function drawLayer(layer, z, tx, ty, nc, scale, cw, ch, fill, stroke) {
    if (!layer) return;
    const div = layer.extent * Math.pow(2, z);
    ctx.beginPath();
    for (const f of layer.feats) {
      if (!f.geom) continue;
      for (const ring of f.geom) {
        for (let i = 0; i < ring.length; i++) {
          const nx = (tx * layer.extent + ring[i].x) / div;
          const ny = (ty * layer.extent + ring[i].y) / div;
          const sx = cw / 2 + (nx - nc.x) * scale;
          const sy = ch / 2 + (ny - nc.y) * scale;
          i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
        }
      }
    }
    if (fill) { ctx.fillStyle = fill; ctx.fill('nonzero'); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.4; ctx.stroke(); }
  }

  let token = 0;
  async function render() {
    if (stopped) return;
    ensureMounted(); // upgrade into the map container once it exists; re-attach after navigation
    const dpr = window.devicePixelRatio || 1;
    const cw = window.innerWidth, ch = window.innerHeight;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    canvas.style.opacity = enabled ? '1' : '0';
    const view = getView();
    if (!view || !enabled) return;

    const my = ++token;
    const scale = 256 * Math.pow(2, view.zoom);
    const nc = normFromLngLat(view.lng, view.lat);
    const nMinX = nc.x - (cw / 2) / scale, nMaxX = nc.x + (cw / 2) / scale;
    const nMinY = nc.y - (ch / 2) / scale, nMaxY = nc.y + (ch / 2) / scale;
    const z = Math.max(0, Math.min(SRCZ_MAX, Math.floor(view.zoom)));
    const n = Math.pow(2, z);
    const x0 = Math.floor(nMinX * n), x1 = Math.floor(nMaxX * n);
    const y0 = Math.max(0, Math.floor(nMinY * n)), y1 = Math.min(n - 1, Math.floor(nMaxY * n));
    const showInho = view.zoom >= SHOW_INHO_FROM;

    const jobs = [];
    for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++)
      jobs.push(getTile(z, ((x % n) + n) % n, y).then(L => ({ x, y, L })));
    const tiles = await Promise.all(jobs);
    if (my !== token) return;

    for (const { x, y, L } of tiles) {
      if (!L) continue;
      // clip to this tile's screen box so the MVT geometry buffer doesn't
      // double-paint translucent fills at tile seams
      const sx0 = cw / 2 + (x / n - nc.x) * scale, sy0 = ch / 2 + (y / n - nc.y) * scale;
      const sx1 = cw / 2 + ((x + 1) / n - nc.x) * scale, sy1 = ch / 2 + ((y + 1) / n - nc.y) * scale;
      ctx.save();
      ctx.beginPath(); ctx.rect(sx0, sy0, sx1 - sx0, sy1 - sy0); ctx.clip();
      drawLayer(L.squadrats, z, x, y, nc, scale, cw, ch, COL_SQ, null);
      if (showInho) drawLayer(L.squadratinhos, z, x, y, nc, scale, cw, ch, COL_INHO, null);
      if (outline) drawLayer(L.squadratsoutline, z, x, y, nc, scale, cw, ch, null, COL_LINE);
      ctx.restore();
    }
  }

  // ---------------- react to movement ----------------
  const _rs = history.replaceState, _ps = history.pushState;
  let raf = null, st = null;
  const schedule = () => {
    if (stopped) return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
    clearTimeout(st); st = setTimeout(render, 250); // fallback if rAF is throttled (background tab)
  };
  const onReplace = function () { _rs.apply(this, arguments); schedule(); };
  const onPush = function () { _ps.apply(this, arguments); schedule(); };
  history.replaceState = onReplace; history.pushState = onPush;

  // hide only during an actual drag (mousedown + move); a plain click to open a
  // place must NOT blink the overlay. Always restore on release.
  let down = false, dragging = false;
  const onDown = () => { down = true; };
  const onMove = () => { if (down && !dragging) { dragging = true; if (enabled) canvas.style.opacity = '0'; } };
  const onUp = () => { down = false; if (dragging) { dragging = false; schedule(); } };
  const onWheel = () => { if (enabled) canvas.style.opacity = '0'; schedule(); };
  const onKey = (e) => {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    if (e.key === 's' || e.key === 'S') { enabled = !enabled; schedule(); }
    if (e.key === 'o' || e.key === 'O') { outline = !outline; schedule(); }
  };
  window.addEventListener('popstate', schedule);
  window.addEventListener('resize', schedule);
  window.addEventListener('mousedown', onDown, true);
  window.addEventListener('mousemove', onMove, true);
  window.addEventListener('mouseup', onUp, true);
  window.addEventListener('wheel', onWheel, true);
  window.addEventListener('keydown', onKey);
  let lastHref = '';
  const poll = setInterval(() => { if (location.href !== lastHref) { lastHref = location.href; schedule(); } }, 350);

  window.__sqdStop = () => {
    stopped = true;
    if (history.replaceState === onReplace) history.replaceState = _rs;
    if (history.pushState === onPush) history.pushState = _ps;
    window.removeEventListener('popstate', schedule);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('mousedown', onDown, true);
    window.removeEventListener('mousemove', onMove, true);
    window.removeEventListener('mouseup', onUp, true);
    window.removeEventListener('wheel', onWheel, true);
    window.removeEventListener('keydown', onKey);
    clearInterval(poll); clearInterval(warm); canvas.remove();
  };

  // Map canvas loads asynchronously after document-idle — keep redrawing until
  // the container exists (so we mount into it), then stop the warm-up loop.
  warm = setInterval(() => {
    if (stopped) { clearInterval(warm); return; }
    schedule();
    if (locateHost()) clearInterval(warm);
  }, 300);
  setTimeout(() => clearInterval(warm), 20000);

  render();
})();
