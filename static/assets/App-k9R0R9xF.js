import{d as e,r as t,b as a,z as o,e as s,f as r}from"./vue-CtmyoV7S.js";import{M as n,T as p,a as m,V as i}from"./maptalks.es-DBJKwkJk.js";import{P as c}from"./tweakpane-BMzNnAXA.js";import{_ as l}from"./index-cYjY4ZMz.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const u={id:"map",ref:"mapRef",class:"content"};const d=l(e({__name:"App",setup(e,{expose:s}){s();const r=t();function l(){const e=new n(r.value,{center:[-.113049,51.498568],zoom:14,baseLayer:new p("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),t=new m(e.getCenter(),{symbol:{textFaceName:"sans-serif",textName:"FLASH\nME",textFill:"#34495e",textSize:40,textHaloColor:"white",textHaloRadius:8}});new i("vector",t).addTo(e);const a=new c;return a.addButton({title:"Flash"}).on("click",(()=>{t.flash(200,5,(function(){alert("flash ended")}))})),()=>{a.dispose(),e.remove()}}a((()=>{const e=l();o((()=>{e()}))}));const u={mapRef:r,initMap:l};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),[["render",function(e,t,a,o,n,p){return s(),r("div",u,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/geometry/flash-geometry/src/App.vue"]]);export{d as default};