import{d as e,r as t,b as n,z as o,e as r,f as a,h as s,F as i}from"./vue-Dk88WT-Z.js";import{M as c,T as u,V as m,a as l}from"./maptalks.es-7YTiJo2Q.js";import{P as p}from"./tweakpane-BMzNnAXA.js";import{_ as d}from"./index-r5JEVMmp.js";import"./common-DJbht5QT.js";import"./element-CcAO_LfK.js";const f={id:"map",ref:"mapRef",class:"content"},b=["innerHTML"];const h=d(e({__name:"App",setup(e,{expose:r}){r();const a=t(),s=t("");function i(){const e=new c(a.value,{center:[-.113049,51.498568],zoom:14,baseLayer:new u("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})}),t=new m("vector").addTo(e),n=new l(e.getCenter(),{symbol:[{markerType:"square",markerFill:"rgba(216,115,149,0.8)",markerWidth:120,markerHeight:120},{textName:"Click\non Me",textSize:18}]}).addTo(t);function o(){n.on("mousedown mouseup click dblclick contextmenu touchstart touchend",d)}function r(){n.off("mousedown mouseup click dblclick contextmenu touchstart touchend",d)}o();const i=[];function d(e){i.push(e);let t="";for(let n=i.length-1;n>=0;n--)t+=i[n].type+" on "+i[n].coordinate.toArray().map((function(e){return e.toFixed(5)})).join()+"<br>";return s.value="<div>"+t+"</div>",!1}const f=new p;return f.addButton({title:"Listen"}).on("click",(()=>{o()})),f.addButton({title:"Unlisten"}).on("click",(()=>{r()})),()=>{f.dispose(),r(),e.remove()}}n((()=>{const e=i();o((()=>{e()}))}));const d={mapRef:a,info:s,initMap:i};return Object.defineProperty(d,"__isScriptSetup",{enumerable:!1,value:!0}),d}}),[["render",function(e,t,n,o,c,u){return r(),a(i,null,[s("div",f,null,512),s("div",{class:"info",innerHTML:o.info},null,8,b)],64)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/geometry/events/src/App.vue"]]);export{h as default};
