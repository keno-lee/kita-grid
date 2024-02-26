import"./chunks/index.l0sNRNKZ.js";import{_ as o,C as i}from"./chunks/Grid.vue_vue_type_script_setup_true_lang.DsQiu0Bw.js";import{d as B,o as r,c as d,k,I as n,m as e,D,w as C,a as w,R as x}from"./chunks/framework.DeQ1eoAg.js";const f={class:"base-view"},$={style:{width:"100%",height:"600px",border:"2px solid var(--color-border)"}},T=B({__name:"MergeView",setup(g){const p=(t=10,E="column-",y)=>Array.from({length:t}).map((u,l)=>({...y,field:`${E}${l}`,title:`Column ${l}`,width:200})),h=(t,E=200,y="row-")=>Array.from({length:E}).map((u,l)=>t.reduce((c,A,m)=>(c[A.field]=`Row ${l} - Col ${m}`,c),{id:`${y}${l}`,parentId:null})),a=p(100),s=h(a,5e3),F=[{rowIndex:1,colIndex:0,rowspan:2,colspan:2},{rowIndex:0,colIndex:3,rowspan:3,colspan:3},{rowIndex:3,colIndex:6,rowspan:3,colspan:2},{rowIndex:5,colIndex:97,rowspan:2,colspan:3},{rowIndex:13,colIndex:1,rowspan:6,colspan:1},{rowIndex:0,colIndex:2,rowspan:5,colspan:1}];return(t,E)=>(r(),d("div",f,[k("div",$,[n(e(o),{columns:e(a),list:e(s),merges:F,border:""},null,8,["columns","list"])])]))}}),_={class:"base-view"},I={style:{width:"100%",height:"600px",border:"2px solid var(--color-border)"}},v=B({__name:"MergeHeaderView",setup(g){const p=[{field:"key1",title:"key1",type:i.Text,width:200},{field:"key2",title:"key2",type:i.Text,width:200,children:[{field:"key2-1",title:"key2-1",type:i.Text,width:200,fixed:"left",children:[{field:"key2-1-1",title:"key2-1-1",type:i.Text,width:200,children:[{field:"key2-1-1-1",title:"key2-1-1-1",type:i.Text,width:200},{field:"key2-1-1-2",title:"key2-1-1-2",type:i.Text,width:200}]},{field:"key2-1-2",title:"key2-1-2",type:i.Text,width:200}]},{field:"key2-2",title:"title12",type:i.Text,width:200}]},{field:"key3",title:"title12",type:i.Text,width:200,children:[{field:"key3-1",title:"title12",type:i.Text,width:200}]},{field:"key4",title:"title12",type:i.Text,width:200,children:[{field:"key4-1",title:"title12",type:i.Text,width:200}]},{field:"key5",title:"title12",type:i.Text,width:200,children:[{field:"key5-1",title:"title12",type:i.Text,width:200}]},{field:"key6",title:"title12",type:i.Text,width:200,children:[{field:"key6-1",title:"title12",type:i.Text,width:200}]},{field:"key7",title:"title12",type:i.Text,width:200,children:[{field:"key7-1",title:"title12",type:i.Text,width:200}]},{field:"key8",title:"title12",type:i.Text,width:200,children:[{field:"key8-1",title:"title12",type:i.Text,width:200}]},{field:"key9",title:"title12",type:i.Text,width:200,children:[{field:"key9-1",title:"title12",type:i.Text,width:200}]},{field:"key10",title:"title12",type:i.Text,width:200,children:[{field:"key10-1",title:"title12",type:i.Text,width:200}]},{field:"key11",title:"title12",type:i.Text,width:200,children:[{field:"key11-1",title:"title12",type:i.Text,width:200},{field:"key12-1",title:"title12",type:i.Text,width:200}]}],h=[];for(let s=0;s<5e3;s++)h.push({id:s.toString(),key0:`row${s}-key0`,key1:`row${s}-key1`,"key2-1-1-1":`row${s}-key2-1-1-1`,"key2-1-1-2":`row${s}-key2-1-1-2`,key3:`row${s}-key3`,key4:`row${s}-key4`,key5:`row${s}-key5`,key6:`row${s}-key6`,key7:`row${s}-key7`,key8:`row${s}-key8`,key9:`row${s}-key9`,key10:`row${s}-key10`,key11:`row${s}-key11`,key12:`row${s}-key12`,key13:`row${s}-key13`,key14:`row${s}-key14 渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架`,key15:`row${s}-key15`,key16:`row${s}-key16`,key17:`row${s}-key17`,key18:`row${s}-key18`,key19:`row${s}-key19`,key20:`row${s}-key20`,key21:`row${s}-key21`,key22:`row${s}-key22`,key23:`row${s}-key23`,key24:`row${s}-key24`,key25:`row${s}-key25`,key26:`row${s}-key26`,key27:`row${s}-key27`,key28:`row${s}-key28`,key29:`row${s}-key29`,key30:`row${s}-key30`,key31:`row${s}-key31`,key32:`row${s}-key32`,key33:`row${s}-key33`,key34:`row${s}-key34`,key35:`row${s}-key35`,key36:`row${s}-key36`,key37:`row${s}-key37`,key38:`row${s}-key38`,key39:`row${s}-key39`,key40:`row${s}-key40`,key50:`row${s}-key50 渲染判断的骨架渲染判断的骨架渲染判断的骨架渲染判断的骨架`});const a=[{rowIndex:1,colIndex:1,rowspan:2,colspan:2},{rowIndex:0,colIndex:3,rowspan:3,colspan:3},{rowIndex:3,colIndex:6,rowspan:3,colspan:2},{rowIndex:5,colIndex:97,rowspan:2,colspan:3},{rowIndex:13,colIndex:2,rowspan:6,colspan:1}];return(s,F)=>(r(),d("div",_,[k("div",I,[n(e(o),{columns:p,list:h,merges:a,border:""})])]))}}),b=k("h1",{id:"合并单元格",tabindex:"-1"},[w("合并单元格 "),k("a",{class:"header-anchor",href:"#合并单元格","aria-label":'Permalink to "合并单元格"'},"​")],-1),q=k("h2",{id:"头合并",tabindex:"-1"},[w("头合并 "),k("a",{class:"header-anchor",href:"#头合并","aria-label":'Permalink to "头合并"'},"​")],-1),S=x("",2),V=x("",1),O=JSON.parse('{"title":"合并单元格","description":"","frontmatter":{},"headers":[],"relativePath":"examples/merge/index.md","filePath":"examples/merge/index.md"}'),P={name:"examples/merge/index.md"},R=Object.assign(P,{setup(g){return(p,h)=>{const a=D("ClientOnly");return r(),d("div",null,[b,q,n(a,null,{default:C(()=>[n(v)]),_:1}),S,n(a,null,{default:C(()=>[n(T)]),_:1}),V])}}});export{O as __pageData,R as default};
