import{d as e,r as t,b as a,z as r,e as o,f as s}from"./vue-CtmyoV7S.js";import{M as n,T as p,a as m,V as i}from"./maptalks.es-DBJKwkJk.js";import{_ as c}from"./index-Bl4Y0iSq.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const u={id:"map",ref:"mapRef",class:"content"};const l=c(e({__name:"App",setup(e,{expose:o}){o();const s=t();function c(){const e=new n(s.value,{center:[-.113049,51.498568],zoom:14,pitch:56,baseLayer:new p("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),t=new m([-.113049,51.498568],{properties:{altitude:400}}),a=new m([-.113049,51.498568]).updateSymbol({markerOpacity:.5,markerFill:"#bbb"});return new i("vector",[a,t],{enableAltitude:!0,altitudeProperty:"altitude"}).addTo(e),()=>{e.remove()}}a((()=>{const e=c();r((()=>{e()}))}));const u={mapRef:s,initMap:c};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),[["render",function(e,t,a,r,n,p){return o(),s("div",u,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/3d/marker-altitude/src/App.vue"]]);export{l as default};