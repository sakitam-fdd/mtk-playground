import{d as e,r as t,b as o,z as s,e as n,f as a}from"./vue-Dk88WT-Z.js";import{i as r,y as i,M as m,T as p}from"./maptalks.es-7YTiJo2Q.js";import{_ as c}from"./index-r5JEVMmp.js";import"./common-DJbht5QT.js";import"./element-CcAO_LfK.js";const u={id:"map",ref:"mapRef",class:"content"};const l=c(e({__name:"App",setup(e,{expose:n}){n();const a=t(),c={content:"",animationOnHide:!1};class u extends r.UIComponent{constructor(e,t){super(t),this._coordinate=e}buildOn(e){const t=document.createElement("div");return t.className="my-ui",t.innerText=this.options.content,t}getOffset(){const e=this.getSize();return new i(-e.width/2,-e.height/2)}getEvents(){return{zoomend:this._flash}}onRemove(){this._flashTimeout&&clearTimeout(this._flashTimeout)}_flash(){this.hide(),this._flashTimeout=setTimeout((()=>{this.show(this._coordinate)}),200)}}function l(){const e=new m(a.value,{center:[-.113049,51.503568],zoom:14,baseLayer:new p("base",{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",subdomains:["a","b","c","d"],attribution:"&copy; <a href='http://osm.org'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/'>CARTO</a>"})});return new u(e.getCenter(),{content:"Hello, MyUI"}).addTo(e).show(),()=>{e.remove()}}u.mergeOptions(c),o((()=>{const e=l();s((()=>{e()}))}));const h={mapRef:a,options:c,MyUI:u,initMap:l};return Object.defineProperty(h,"__isScriptSetup",{enumerable:!1,value:!0}),h}}),[["render",function(e,t,o,s,r,i){return n(),a("div",u,null,512)}],["__file","/home/runner/work/mtk-playground/mtk-playground/.playgrounds/basic/plugin-develop/ui/src/App.vue"]]);export{l as default};
