import{d as e,r as o,b as t,z as n,e as a,f as r}from"./vue-Dk88WT-Z.js";import{M as s,T as i,V as c,o as m,p as l}from"./maptalks.es-7YTiJo2Q.js";import{_ as p}from"./index-r5JEVMmp.js";import"./common-DJbht5QT.js";import"./element-CcAO_LfK.js";const d={id:"map",ref:"mapRef",class:"content"};const u=p(e({__name:"App",setup(e,{expose:a}){a();const r=o();function p(){const e=new s(r.value,{center:[-.113049,51.498568],zoom:14,baseLayer:new i("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),o=new c("vector").addTo(e),t=new m({mode:"Point"}).addTo(e).disable();t.on("drawend",(function(e){console.info(e.geometry),o.addGeometry(e.geometry)}));const n=["Point","LineString","Polygon","Circle","Ellipse","Rectangle","FreeHandLineString","FreeHandPolygon"].map((function(e){return{item:e,click:function(){t.setMode(e).enable()}}}));return new l.Toolbar({items:[{item:"Shape",children:n},{item:"Disable",click:function(){t.disable()}},{item:"Clear",click:function(){o.clear()}}]}).addTo(e),()=>{e.remove()}}t((()=>{const e=p();n((()=>{e()}))}));const d={mapRef:r,initMap:p};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}}),[["render",function(e,o,t,n,s,i){return a(),r("div",d,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/interaction/draw-tool/src/App.vue"]]);export{u as default};
