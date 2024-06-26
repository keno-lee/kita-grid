import { type PluginOption } from 'vite';
import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import vueJsx from '@vitejs/plugin-vue-jsx';

function themeCustomCss(): PluginOption {
  return {
    name: 'theme-custom-css',
    enforce: 'pre',
    resolveId(source, importer, options) {
      if (source.endsWith('vp-doc.css')) {
        return fileURLToPath(new URL('./theme/vp-doc-custom.css', import.meta.url));
      }
    },
  };
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'kita-grid',
  description: 'kita-grid',

  head: [['link', { rel: 'icon', href: '/kita-grid/favicon.ico' }]],

  base: '/kita-grid/',

  assetsDir: '/public',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide/start/' },
      { text: 'Examples', link: '/examples/base/' },
      { text: 'API', link: '/api/' },
      // { text: 'Playground', link: '/playground/' },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/keno-lee/kita-grid',
      },
    ],

    sidebar: {
      '/guide/': [
        { text: '开始使用', link: '/guide/start/' },
        { text: '主题', link: '/guide/theme/' },
      ],
      '/examples/': [
        { text: '基础功能', link: '/examples/base/' },

        {
          text: '行设置',
          collapsed: false,
          items: [
            { text: '高亮 highlight', link: '/examples/highlight/' },

            { text: '展开 expand', link: '/examples/expand/' },
            { text: '分组 group', link: '/examples/group/' },
            { text: '树形 tree', link: '/examples/tree/' },
          ],
        },

        {
          text: '列设置',
          collapsed: false,
          items: [
            { text: '列固定', link: '/examples/fixed/' },
            { text: '复选框', link: '/examples/checkbox/' },
            { text: '列宽拖拽', link: '/examples/column/' },
            { text: '自定义索引', link: '/examples/index-view/' },
            { text: '自定义列渲染', link: '/examples/custom/' },
          ],
        },
        {
          text: 'Advance',
          collapsed: false,
          items: [
            { text: '合并单元格', link: '/examples/merge/' },
            { text: '高性能', link: '/examples/performance/' },
            { text: '自定义类/样式', link: '/examples/custom-class-style/' },
            { text: '事件处理', link: '/examples/events/' },
            { text: 'template', link: '/examples/table/' },
            { text: '区域选中', link: '/examples/selection/' },
            { text: 'spreadsheet(实验室)', link: '/examples/spreadsheet/' },
          ],
        },
        // { text: 'tfoot(实验室)', link: '/examples/tfoot/' },
      ],
    },
  },

  markdown: {
    container: {
      detailsLabel: '源码',
    },
    config(md) {
      md.core.ruler.before('block', 'kita-grid-example-snippet-pre', (state) => {
        const regex = /<!<< (.+)/;
        let result = regex.exec(state.src);
        while (result) {
          const [, match] = result;
          state.src = state.src.replace(
            regex,
            `
<!!<< ${match}
::: details
  <<< ${match}
:::
        `,
          );
          result = regex.exec(state.src);
        }
      });

      md.block.ruler.before('table', 'kita-grid-example-snippet', (state, startLine, endLine) => {
        const regex = /<!!<< (.+)/;
        let start = state.bMarks[startLine] + state.tShift[startLine];
        let max = state.eMarks[startLine];
        const result = regex.exec(state.src.slice(start, max));
        if (!result) {
          return false;
        }
        const [, sourceFile] = result;

        const ViewName = sourceFile.replace('.vue', '').replace(/\.*?\//g, '');
        let scriptToken = state.tokens.find((token) => /<script( setup)?>/.test(token.content))!;
        if (!scriptToken) {
          scriptToken = state.push('html_block', '', 0);
          scriptToken.content = '<script setup>\n</script>\n';
          scriptToken.block = true;
        }
        scriptToken.content = scriptToken.content.replace(
          /<script(.*)>\n/,
          `<script$1>\nimport ${ViewName} from  '${sourceFile}' \n`,
        );

        const token = state.push('html_inline', '', 0);
        token.content = `<ClientOnly><${ViewName}/></ClientOnly>`;
        token.block = false;
        token.map = [startLine, startLine + 1];

        state.line++;
        return true;
      });
    },
  },
  vite: {
    // configFile: path.resolve(__dirname, '../../scripts/dev.ts'),
    plugins: [vueJsx(), themeCustomCss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../', import.meta.url)),
        'kita-grid': fileURLToPath(new URL('../../src/', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
    },
    ssr: {
      noExternal: ['@vue/repl'],
    },
    // build: {
    //   rollupOptions: {
    //     output: {
    //       manualChunks: {
    //         'kita-grid': ['kita-grid'],
    //       },
    //       chunkFileNames(chunkInfo) {
    //         if (chunkInfo.name === 'kita-grid') {
    //           return 'public/[name].js';
    //         }
    //         return 'public/[name].[hash].js'
    //       },
    //       minifyInternalExports: false,
    //     }
    // },
    // }
  },
});
