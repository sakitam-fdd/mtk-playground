import{d as e,r as a,b as t,z as o,e as s,f as r,h as n}from"./vue-CtmyoV7S.js";import{M as p,T as m,V as c,a as i,R as l,r as u}from"./maptalks.es-DBJKwkJk.js";import{_ as d}from"./index-DOKcVjDC.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const f={class:"content"},b={id:"map",ref:"mapRef",class:"content-map"},y={id:"map1",ref:"map1Ref",class:"content-map"};const h=d(e({__name:"App",setup(e,{expose:s}){s();const r=a(),n=a();function d(){const e=[-.113049,51.498568],a=new p(r.value,{center:e,zoom:13,baseLayer:new m("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"}),layers:[new c("v")]}),t=new i(e),o=new l(e,1e3,800);a.getLayer("v").addGeometry(t,o);const s=new p(n.value,{center:e,zoom:13,baseLayer:new m("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),d=new c("v").addTo(s);return u.fromJSON(o.toJSON()).addTo(d),()=>{a.remove(),s.remove()}}t((()=>{const e=d();o((()=>{e()}))}));const f={mapRef:r,map1Ref:n,initMap:d};return Object.defineProperty(f,"__isScriptSetup",{enumerable:!1,value:!0}),f}}),[["render",function(e,a,t,o,p,m){return s(),r("div",f,[n("div",b,null,512),n("div",y,null,512)])}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/json/geometry-json/src/App.vue"]]);export{h as default};