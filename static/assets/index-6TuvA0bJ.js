import{d as e,r as l,b as a,z as t,e as s,f as n,a6 as i,h as o,N as r,an as p,j as c,q as d,k as u,E as m,Q as f,a4 as _,F as x}from"./vue-Dk88WT-Z.js";import{u as v}from"./useTheme-DXUkk0x4.js";import{H as h}from"./index-BwZNOXtK.js";import{b as w,c as y,p as g,d as b}from"./element-CcAO_LfK.js";import{u as j,T as k,g as T}from"./graphql-CzFbJj_E.js";import{_ as C,u as z}from"./index-r5JEVMmp.js";/* empty css               */import"./common-DJbht5QT.js";const S={class:"fixed bottom-8 right-8 z-[99]"};const $=C(e({__name:"index",setup(e,{expose:s}){s();const n=l(!1),i=()=>{n.value=window.pageYOffset>300};a((()=>{window.addEventListener("scroll",i)})),t((()=>{window.removeEventListener("scroll",i)}));const o={isVisible:n,scrollToTop:()=>{window.scrollTo({top:0,behavior:"smooth"})},toggleVisibility:i};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}}),[["render",function(e,l,a,t,p,c){return s(),n("div",S,[t.isVisible?(s(),n("div",{key:0,"aria-label":"scroll to top",class:"scroll-top",onClick:t.scrollToTop,onKeydown:i(t.scrollToTop,["enter"])},l[0]||(l[0]=[o("span",{class:"mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white"},null,-1)]),32)):r("",!0)])}],["__scopeId","data-v-9254d0b6"],["__file","/home/runner/work/mtk-playground/mtk-playground/src/components/ScrollTop/index.vue"]]),L="_menu-item_15nej_1",q="_active-menu_15nej_10",E="_playground-list_15nej_13",P="_title_15nej_17",I="_title-inner_15nej_21",V="_playground-list-item_15nej_33",K="_mask_15nej_39",N="_header_15nej_50",O="_content_15nej_60",B="_footer-title_15nej_64",D="_dark_15nej_71",F="__all",H=e({name:"PlaygroundList",props:{title:{type:String,default:""},icon:{type:String,default:""}},setup(e){const{isDark:l}=v(),a=p(),{t:t}=z(),[s,n]=j([]),[i,o]=j({name:"",children:[]}),[r,C]=j({name:""}),S=e=>{const l=document.getElementById(e);if(l){const e=l.offsetTop-80;window.scrollTo({top:e,behavior:"smooth"})}},H=()=>{a.push({name:"Playground",query:{}})},J=()=>{},M=c((()=>{const e=s.value.map((e=>{const l=e.children.map((e=>({name:e.name})));return l.unshift({name:F}),{name:e.name,children:l}}));return e.unshift({name:F,children:[]}),e})),Q=(e,l,t)=>{a.push({name:"Playground",query:{category:t.path,subclass:l.path,name:e.path}})};return d((async()=>{await(async()=>{const e=await T();n(e)})()})),u((()=>{s.value,M.value})),()=>m(x,null,[m(h,null,null),m("section",{class:"flex justify-center relative overflow-hidden pb-16 "},[m("div",{class:"w-full max-w-[1500px] px-4 bg-white dark:bg-gray-dark"},[m("div",{class:"min-h-[50px] w-full items-center justify-between mt-15px mb-15px"},[m("div",{class:"flex flex-wrap w-full items-center justify-between"},[m("div",{class:"flex flex-wrap h-full w-full flex-1 items-center space-x-3 gap-10px"},[M.value.map((e=>m("div",{key:e.name,class:[L,"font-size-16px","whitespace-nowrap",{[q]:e.name===i.value.name}],onClick:()=>{(e=>{o(e),S(e.name)})(e)}},[t(`playgrounds.${e.name}.title`)])))]),m("div",{class:"flex items-center"},[m(w,{type:"primary",onClick:H},{default:()=>[m(y,null,{default:()=>[m(g,null,null)]}),t("app.actions.create_template")]})])]),m("div",{class:"flex flex-wrap h-full w-full flex-1 items-center space-x-3 gap-10px mt-15px mb-15px"},[i.value.children.map((e=>m("div",{key:e.value,class:[L,"whitespace-nowrap",{[q]:e.name===r.value.name}],onClick:()=>{(e=>{C(e),S(e.name)})(e)}},[e.name===F?t("playgrounds.__all.title"):t(`playgrounds.${e.name.split("_").join(".")}.title`)])))])]),m("div",{class:"min-h-[calc(100vh-420px)] w-full max-w-[1500px]"},[m("div",{class:["h-full w-full gap-8 p-4"]},[s.value.map((e=>m("div",{id:e.name},[e.children.map((s=>m("div",{id:s.name,class:["grid h-full w-full gap-8 p-4",E]},[m("h2",{class:["col-span-full text-xl font-bold mb-4 text-black dark:text-white",P]},[m("div",{class:I},[t(`playgrounds.${s.name.split("_").join(".")}.title`)])]),s.children.map((n=>m("div",{id:n.name,class:[V,l.value?D:""]},[m("div",{class:["relative flex-1 overflow-hidden rounded-md p-[12px]",N],onClick:()=>Q(n,s,e)},[m("div",{class:O},[m("div",{class:"h-full w-full"},[f(m("img",{class:"rounded-md pre-image h-full w-full",alt:"Loaded Image"},null),[[_("lazy"),`${k}${n.name}.webp`]])])]),m("div",{class:["absolute left-0 top-0 h-full w-full p-[12px]",K]},[m("div",{class:"flex items-center justify-center rounded-md transition-all hover:bg-[#ffffff1f] button-icon absolute right-3 top-3",onClick:J},null),m("div",{class:"flex h-full w-full items-center justify-center"},[m("span",{class:"font-600 text-size-18px text-black text-shadow-[1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff,_1px_1px_0_#fff] dark:text-white dark:text-shadow-[1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]"},[t(`playgrounds.${n.name.split("_").join(".")}`)])])])]),m("div",{class:"flex h-[40px] items-center justify-between px-[12px]"},[m("div",{class:[B,"text-overflow"]},[t(`playgrounds.${n.name.split("_").join(".")}`)]),m("div",{class:"flex items-center gap-6px"},[m(b,{content:t("app.actions.openNew")},{default:()=>[m("div",{class:"icon__settings !h-[26px] !w-[26px] text-black dark:text-white hover:color-primary hover:scale-110 cursor-pointer",onClick:()=>(e=>{a.push({name:e.name})})(n)},[m("div",{class:"flex items-center justify-center rounded-md transition-all"},[m("span",{class:"iconify i-material-symbols:open-in-new m-1",style:{fontSize:"18px"}},null)])])]}),m(b,{content:t("app.actions.sfc")},{default:()=>[m("div",{class:"icon__settings !h-[26px] !w-[26px] text-black dark:text-white cursor-pointer hover:color-primary hover:scale-110",onClick:()=>Q(n,s,e)},[m("div",{class:"flex items-center justify-center rounded-md transition-all"},[m("span",{class:"iconify i-material-symbols:deployed-code m-1",style:{fontSize:"18px"}},null)])])]})])])])))])))])))])])])]),m($,null,null)])}});export{H as default};
