var t=Object.defineProperty,e=(e,a,r)=>((e,a,r)=>a in e?t(e,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[a]=r)(e,"symbol"!=typeof a?a+"":a,r);import{d as a,r,b as o,z as s,e as n,f as i}from"./vue-CtmyoV7S.js";import{M as c,T as l,l as p,b as d,m as u}from"./maptalks.es-DBJKwkJk.js";import{_ as m}from"./index-Bl4Y0iSq.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const h={id:"map",ref:"mapRef",class:"content"};const f=m(a({__name:"App",setup(t,{expose:a}){a();const n=r();function i(){const t=new c(n.value,{center:[-.113049,51.498568],zoom:14,baseLayer:new l("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})});class a extends u{constructor(t,a,r){super(t,r),e(this,"data"),this.data=a}setData(t){return this.data=t,this}getData(){return this.data}}a.mergeOptions({color:"Red",font:"30px san-serif"});class r extends p.CanvasRenderer{checkResources(){return[]}draw(){const t=this._drawData(this.layer.getData(),this.layer.options.color);this._drawnData=t,this.completeRender()}drawOnInteracting(t){this._drawnData&&0!==this._drawnData.length&&this._drawData(this._drawnData,this.layer.options.color)}_drawData(t,e){if(!Array.isArray(t))return;const a=this.getMap();this.prepareCanvas();const r=this.context;r.fillStyle=e,r.font=this.layer.options.font;const o=a.getContainerExtent(),s=[];return t.forEach((t=>{const e=a.coordinateToContainerPoint(new d(t.coord));if(!o.contains(e))return;const n=t.text,i=r.measureText(n);r.fillText(n,e.x-i.width/2,e.y),s.push(t)})),s}}a.registerRenderer("canvas",r);const o=new a("hello");return o.setData([{coord:t.getCenter().toArray(),text:"Hello World"},{coord:t.getCenter().add(.01,.01).toArray(),text:"Hello World 2"}]),o.addTo(t),()=>{t.remove()}}o((()=>{const t=i();s((()=>{t()}))}));const m={mapRef:n,initMap:i};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),[["render",function(t,e,a,r,o,s){return n(),i("div",h,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/hellolayer/drawoninteracting/src/App.vue"]]);export{f as default};