import{d as e,r as a,b as o,z as t,e as n,f as r,h as s,F as p}from"./vue-CtmyoV7S.js";import{M as i,T as m,V as c,a as l}from"./maptalks.es-DBJKwkJk.js";import{_ as u}from"./index-Bl4Y0iSq.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const f={id:"map",ref:"mapRef",class:"content"},d=["innerHTML"];const y=u(e({__name:"App",setup(e,{expose:n}){n();const r=a(),s=a("");function p(){const e=new i(r.value,{center:[-.113049,51.498568],zoom:14,baseLayer:new m("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"}),layers:[new c("v")]}),a=new l([-.113049,51.498568],{properties:{name:"point marker"}}).addTo(e.getLayer("v"));return s.value=JSON.stringify(a.toGeoJSON()),()=>{e.remove()}}o((()=>{const e=p();t((()=>{e()}))}));const u={mapRef:r,info:s,initMap:p};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),[["render",function(e,a,o,t,i,m){return n(),r(p,null,[s("div",f,null,512),s("div",{class:"info",innerHTML:t.info},null,8,d)],64)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/json/geometry-to-geojson/src/App.vue"]]);export{y as default};