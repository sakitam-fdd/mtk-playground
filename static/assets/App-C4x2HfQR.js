import{d as e,r as t,b as o,e as a,f as n}from"./vue-CtmyoV7S.js";import{M as r,T as s,V as p,P as i}from"./maptalks.es-DBJKwkJk.js";import{P as l}from"./tweakpane-DuxcKmjQ.js";import{_ as c}from"./index-Bl4Y0iSq.js";import"./common-DJbht5QT.js";import"./element-BF3D_0r8.js";const m={id:"map",ref:"mapRef",class:"content"};const u=c(e({__name:"App",setup(e,{expose:a}){a();const n=t();function c(){const e=new r(n.value,{center:[121.4854,31.2285],zoom:14,baseLayer:new s("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),t=new p("vector").addTo(e);function o(e){t.getGeometryById(e).updateSymbol([{polygonFill:"#f00"}])}for(let a=0;a<3;a++){new i([[121.455542+.02*a,31.233812],[121.468542+.02*a,31.233812],[121.468542+.02*a,31.222812],[121.455542+.02*a,31.222812]],{id:100*(a+1),properties:{count:100*(a+1)},symbol:[{polygonFill:"#747474",polygonOpacity:.5,lineColor:"#000",lineWidth:2},{textName:"{count}",textSize:40,textFill:"#fff"}]}).addTo(t);const e=new l;e.addButton({title:"Get ID of 100"}).on("click",(()=>{o(100)})),e.addButton({title:"Get ID of 200"}).on("click",(()=>{o(200)}))}}o((()=>{c()}));const m={mapRef:n,initMap:c};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),[["render",function(e,t,o,r,s,p){return a(),n("div",m,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/layer/vectorlayer-get-by-id/src/App.vue"]]);export{u as default};