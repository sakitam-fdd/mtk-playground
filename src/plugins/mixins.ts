import type { App } from 'vue';
import Mixin from '@/mixins';

export function setupMixins(app: App) {
  app.mixin(Mixin);
}
