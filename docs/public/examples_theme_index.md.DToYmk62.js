import{_ as s,c as i,o as a,R as n}from"./chunks/framework.DeQ1eoAg.js";const y=JSON.parse('{"title":"主题","description":"","frontmatter":{},"headers":[],"relativePath":"examples/theme/index.md","filePath":"examples/theme/index.md"}'),l={name:"examples/theme/index.md"},p=n(`<h1 id="主题" tabindex="-1">主题 <a class="header-anchor" href="#主题" aria-label="Permalink to &quot;主题&quot;">​</a></h1><h2 id="白天模式" tabindex="-1">白天模式 <a class="header-anchor" href="#白天模式" aria-label="Permalink to &quot;白天模式&quot;">​</a></h2><div class="language-scss vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scss</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格元素层级</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-index-normal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格边框颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-border-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #ebeef5;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格边框</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid var(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-border-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格字体颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-text-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #606266;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表头字体颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-header-text-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #909399;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格行hover高亮背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-row-hover-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #f5f7fa;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格行斑马纹高亮背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-row-stripe-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #fafafa;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 行选中背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-current-row-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #fff7e6;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 列选中背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-current-column-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #fff7e6;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表头背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-header-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #ffffff;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格固定列阴影</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-fixed-box-shadow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 0px 0px 12px rgba(0, 0, 0, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.12</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格背景颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #ffffff;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格行背景颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-tr-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #ffffff;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格展开列背景颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-expanded-cell-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #ffffff;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 左固定列边框样式</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-fixed-left-column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: inset 10px 0 10px -10px rgba(0, 0, 0, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 右固定列边框样式</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-fixed-right-column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: inset -10px 0 10px -10px rgba(0, 0, 0, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 索引列层级</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: var(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-index-normal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 区域选中边框样式</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-select-border-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #409eff;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 区域选中背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-select-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #ecf5ff;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 滚动条滑块颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-scrollbar-thumb-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: rgba(182, 185, 192, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 滚动条滑块hover颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-scrollbar-thumb-color-hover</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: rgba(182, 185, 192, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 树状连线颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-tree-line-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #303133;</span></span></code></pre></div><h2 id="暗夜模式" tabindex="-1">暗夜模式 <a class="header-anchor" href="#暗夜模式" aria-label="Permalink to &quot;暗夜模式&quot;">​</a></h2><div class="language-scss vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">scss</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格边框颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-border-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #363637;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格边框</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-border</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 1px solid var(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-border-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格字体颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-text-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #cfd3dc;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表头字体颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-header-text-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #a3a6ad;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格行hover高亮背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-row-hover-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #262727;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格行斑马纹高亮背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-row-stripe-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #1d1d1d;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 行选中背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-current-row-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #2b2211;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 行选中背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-current-column-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #2b2211;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表头背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-header-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #141414;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格固定列阴影</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-fixed-box-shadow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: 0px 0px 12px rgba(0, 0, 0, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.72</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格背景颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #141414;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格行背景颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-tr-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #141414;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 表格展开列背景颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-expanded-cell-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #141414;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 左固定列边框样式</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-fixed-left-column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: inset 10px 0 10px -10px rgba(0, 0, 0, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 右固定列边框样式</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-fixed-right-column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: inset -10px 0 10px -10px rgba(0, 0, 0, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.15</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 索引列层级</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-index</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: var(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-index-normal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 区域选中边框样式</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-select-border-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #409eff;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 区域选中背景</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-select-bg-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #18222c;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 滚动条滑块颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-scrollbar-thumb-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: rgba(163, 166, 173, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 滚动条滑块hover颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-scrollbar-thumb-color-hover</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: rgba(163, 166, 173, 0</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">.5</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 树状连线颜色</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">--kita-grid-tree-line-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: #4c4d4f;</span></span></code></pre></div>`,5),h=[p];function k(t,e,r,d,E,g){return a(),i("div",null,h)}const o=s(l,[["render",k]]);export{y as __pageData,o as default};
