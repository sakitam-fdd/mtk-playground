import{d as e,r as a,b as r,e as t,f as o}from"./vue-Dk88WT-Z.js";import{M as n,T as s,V as m,a as p}from"./maptalks.es-7YTiJo2Q.js";import{_ as i}from"./index-r5JEVMmp.js";import"./common-DJbht5QT.js";import"./element-CcAO_LfK.js";const l={id:"map",ref:"mapRef",class:"content"};const c=i(e({__name:"App",setup(e,{expose:t}){t();const o=a();function i(){const e=new n(o.value,{center:[-.113049,51.498568],zoom:14,baseLayer:new s("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),a=new m("v",{globalCompositeOperation:"difference"}).addTo(e),r=e.getCenter(),t=[],i=["#f00","#0f0","#00f"];for(let o=0;o<=50;o++){const e=r.x+.055*(Math.random()-.5)*.5,a=r.y+.03*(Math.random()-.5)*.5,o=i[Math.floor(3*Math.random())];t.push(new p([e,a],{symbol:{markerType:"ellipse",markerFill:o,markerFillOpacity:1,markerLineWidth:1,markerLineColor:o,markerWidth:70,markerHeight:70}}))}a.addGeometry(t)}r((()=>{i()}));const l={mapRef:o,initMap:i};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}}),[["render",function(e,a,r,n,s,m){return t(),o("div",l,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/layer/globalcompositeoperation/src/App.vue"]]);export{c as default};
