import Vue, { VNode } from 'vue';

type EmptyObject = Record<string, never>;
declare module '*.vue' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<EmptyObject, EmptyObject, any>;
  export default component;
}

declare module '*.tsx' {
  import { DefineComponent } from 'vue';

  const component: DefineComponent<EmptyObject, EmptyObject, any>;
  export default component;
}

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface ElementAttributesProperty {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
    interface IntrinsicAttributes {
      [elem: string]: any;
    }
  }
}
