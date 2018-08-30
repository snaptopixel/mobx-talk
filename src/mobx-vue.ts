import Vue, { VueConstructor } from 'vue';
import { Reaction, runInAction, isObservableArray, isObservable, autorun, toJS } from 'mobx';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    state?: any;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    state?: any;
  }
}

export default {
  install($Vue: VueConstructor) {
    // Monkey-patch Array.isArray to return true for MobX arrays
    const nativeIsArray = Array.isArray;
    (Array as any).isArray = function isArray(obj: any) {
      const result = nativeIsArray(obj) || isObservableArray(obj);
      return result;
    };
    // Mixin will check Vue instances for MobX data and watch automatically
    $Vue.mixin({
      // Clean up after ourselves
      destroyed(this: any) {
        if (this.__reactionDisposer__) {
          this.__reactionDisposer__();
        }
      },
      // Wrap data() with a new function that plucks out MobX observables
      // and defines them on the instance, so Vue leaves them alone
      beforeCreate(this: any) {
        const {data} = this.$options;

        if (data) {
          this.$options.data = function(...args: any[]) {
            const d = data.apply(this, args);
            for (const prop of Object.keys(d)) {
              if (isObservable(d[prop])) {
                this.__mobxData__ = this.__mobxData || {};
                this.__mobxData__[prop] = this[prop] = d[prop];
                delete d[prop];
              }
            }
            return d;
          };
        }
      },
      // Set up mobx action
      created(this: any) {
        // Grab the existing options we care about
        const {render, props, name} = this.$options;
        let hasMobX = typeof this.__mobxData__ !== 'undefined';
        if (props) {
          for (const prop of Object.keys(props)) {
            if (isObservable(this[prop])) {
              hasMobX = true;
              break;
            }
          }
        }
        // If no mobx data, exit early
        if (hasMobX) {
          // Watches mobx state for changes and tells Vue to update
          const componentName = name || 'dunno'
          const reaction = new Reaction(`${componentName}.render()`, () => {
            this.$forceUpdate();
          });
          // Allows for cleaning up upon destroy
          this.__reactionDisposer__ = reaction.getDisposer();
          // Wrap existing render function and track any mobx dependencies while rendering
          this.$options.render = (...args: any[]) => {
            let result;
            reaction.track(() => {
              result = render.apply(this, args);
            });
            return result;
          };
        }

        if (this.__mobxData__) {
          // Automatically watch any props with names that match our MobX state
          if (props) {
            for (const prop of Object.keys(props)) {
              for (const model of Object.keys(this.__mobxData__)) {
                if (prop in this[model]) {
                  this.$watch(prop, (value: any) => {
                    runInAction(`@prop ${prop}`, () => {
                      this[model][prop] = value;
                    });
                  });
                }
              }
            }
          }
        }
      },
    });
  },
};
