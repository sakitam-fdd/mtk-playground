import{d as e,r as t,b as o,z as r,e as a,f as s}from"./vue-Dk88WT-Z.js";import{M as n,T as p,V as m,q as c}from"./maptalks.es-7YTiJo2Q.js";import{_ as i}from"./index-r5JEVMmp.js";import"./common-DJbht5QT.js";import"./element-CcAO_LfK.js";const u={id:"map",ref:"mapRef",class:"content"};const l=i(e({__name:"App",setup(e,{expose:a}){a();const s=t();function i(){const e=new n(s.value,{center:[-.113049,51.498568],zoom:14,baseLayer:new p("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"}),layers:[new m("v")]});return c.toGeometry({type:"Feature",geometry:{type:"Point",coordinates:[-.113049,51.498568]},properties:{name:"point marker"}}).addTo(e.getLayer("v")),()=>{e.remove()}}o((()=>{const e=i();r((()=>{e()}))}));const u={mapRef:s,initMap:i};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),[["render",function(e,t,o,r,n,p){return a(),s("div",u,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/json/geojson-to-geometry/src/App.vue"]]);export{l as default};
