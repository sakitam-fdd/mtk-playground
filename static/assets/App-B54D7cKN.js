import{d as e,r as t,b as a,z as o,e as r,f as n}from"./vue-CtmyoV7S.js";import{M as s,T as i,L as p,V as l}from"./maptalks.es-DBJKwkJk.js";import{_ as c}from"./index-Bl4Y0iSq.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const m={id:"map",ref:"mapRef",class:"content"};const u=c(e({__name:"App",setup(e,{expose:r}){r();const n=t();function c(){const e=new s(n.value,{center:[-.113049,51.498568],zoom:14,pitch:56,bearing:60,baseLayer:new i("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),t=new p([[-.131049,51.498568],[-.107049,51.498568],[-.101049,51.498568]],{symbol:{lineColor:"#1bbc9b",lineWidth:3},properties:{altitude:[100,400,1200]}});return new p([[-.131049,51.498568],[-.107049,51.498568]],{symbol:{lineColor:"#000",lineDasharray:[10,5,5],lineWidth:3}}),new l("vector",[t],{enableAltitude:!0,drawAltitude:{polygonFill:"#1bbc9b",polygonOpacity:.3,lineWidth:0}}).addTo(e),()=>{e.remove()}}a((()=>{const e=c();o((()=>{e()}))}));const m={mapRef:n,initMap:c};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),[["render",function(e,t,a,o,s,i){return r(),n("div",m,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/3d/line-draw-altitude/src/App.vue"]]);export{u as default};