import{d as e,r as t,b as o,z as a,e as r,f as n}from"./vue-CtmyoV7S.js";import{M as s,T as p}from"./maptalks.es-DBJKwkJk.js";import{_ as m}from"./index-cYjY4ZMz.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const c={id:"map",ref:"mapRef",class:"content"};const i=m(e({__name:"App",setup(e,{expose:r}){r();const n=t();function m(){const e={projection:"EPSG:3857",resolutions:function(){const e=[],t=12756274*Math.PI;for(let o=0;o<25;o++)e[o]=t/(256*Math.pow(2,o));return e}()},t=new s(n.value,{center:[105.08052356963802,36.04231948670001],spatialReference:e,zoom:4,baseLayer:new p("base",{maxAvailableZoom:22,urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})});return()=>{t.remove()}}o((()=>{const e=m();a((()=>{e()}))}));const c={mapRef:n,initMap:m};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}}),[["render",function(e,t,o,a,s,p){return r(),n("div",c,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/tilelayer-projection/max-zoom/src/App.vue"]]);export{i as default};