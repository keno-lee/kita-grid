import"./chunks/index.l0sNRNKZ.js";import{_ as B}from"./chunks/Grid.vue_vue_type_script_setup_true_lang.DsQiu0Bw.js";import{d as u,o as F,c,k as l,I as k,m as e,D,w as C,a as A,R as m}from"./chunks/framework.DeQ1eoAg.js";const _={class:"base-view"},f={style:{width:"100%",height:"600px",border:"2px solid var(--color-border)"}},x=u({__name:"CustomIndexView",setup(o){const p=(s=10,a="column-",h)=>Array.from({length:s}).map((d,i)=>({...h,field:`${a}${i}`,title:`Column ${i}`,width:200})),E=(s,a=200,h="row-")=>Array.from({length:a}).map((d,i)=>s.reduce((t,g,y)=>(t[g.field]=`Row ${i} - Col ${y}`,t),{parentId:null})),n=[{type:"index",width:50,fixed:"left",index:s=>`x-${s}`},...p(20)],r=E(n,5e3);return(s,a)=>(F(),c("div",_,[l("div",f,[k(e(B),{ref:"grid",columns:n,list:e(r),border:""},null,8,["list"])])]))}}),v={class:"base-view"},w={style:{width:"100%",height:"600px",border:"2px solid var(--color-border)"}},b=u({__name:"IndexView",setup(o){const p=(s=10,a="column-",h)=>Array.from({length:s}).map((d,i)=>({...h,field:`${a}${i}`,title:`Column ${i}`,width:200})),E=(s,a=200,h="row-")=>Array.from({length:a}).map((d,i)=>s.reduce((t,g,y)=>(t[g.field]=`Row ${i} - Col ${y}`,t),{id:`${h}${i}`,parentId:null})),n=[{type:"index",width:50,fixed:"left"},...p(20)],r=E(n,5e3);return(s,a)=>(F(),c("div",v,[l("div",w,[k(e(B),{ref:"grid",columns:n,list:e(r),border:""},null,8,["list"])])]))}}),$=l("h1",{id:"索引",tabindex:"-1"},[A("索引 "),l("a",{class:"header-anchor",href:"#索引","aria-label":'Permalink to "索引"'},"​")],-1),q=l("h2",{id:"常规索引",tabindex:"-1"},[A("常规索引 "),l("a",{class:"header-anchor",href:"#常规索引","aria-label":'Permalink to "常规索引"'},"​")],-1),I=m("",2),T=m("",1),P=JSON.parse('{"title":"索引","description":"","frontmatter":{},"headers":[],"relativePath":"examples/index-view/index.md","filePath":"examples/index-view/index.md"}'),L={name:"examples/index-view/index.md"},N=Object.assign(L,{setup(o){return(p,E)=>{const n=D("ClientOnly");return F(),c("div",null,[$,q,k(n,null,{default:C(()=>[k(b)]),_:1}),I,k(n,null,{default:C(()=>[k(x)]),_:1}),T])}}});export{P as __pageData,N as default};
