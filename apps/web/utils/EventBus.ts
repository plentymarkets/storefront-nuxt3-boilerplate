import mitt from 'mitt';

export default mitt<any>();
// import { useEventBus } from '@vueuse/core';

// export default useEventBus('TestKeyEvent');
// import { reactive } from 'vue';

// export const GlobalEventEmitter = reactive({
//   events: new Map<string, Function[]>(),

//   emit(event: string, payload: any) {
//     if (this.events.has(event)) {
//       this.events.get(event)?.forEach((callback) => callback(payload));
//     }
//   },

//   on(event: string, callback: Function) {
//     if (!this.events.has(event)) {
//       this.events.set(event, []);
//     }
//     this.events.get(event)?.push(callback);
//   },

//   off(event: string, callback: Function) {
//     if (this.events.has(event)) {
//       const listeners = this.events.get(event);
//       const index = listeners?.indexOf(callback);

//       if (index !== undefined && index !== -1) {
//         listeners?.splice(index, 1);
//       }
//     }
//   },
// });
