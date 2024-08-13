import { createHtmlPlugin } from 'vite-plugin-html';
import dayjs from 'dayjs';

export function HtmlPlugin(viteEnv: Record<string, any>, isBuild: boolean) {
  const { VITE_APP_TITLE } = viteEnv;
  return createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_APP_TITLE,
        buildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    },
  });
}
