import type { App } from 'vue';

const componentList = [];

const Components = {
  install(app: App<any>) {
    componentList.forEach((Comp) => {
      app.component(Comp.name, Comp);
    });
  },
};

export default Components;
