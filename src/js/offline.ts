import offline from 'offline-plugin/runtime';

export default function () {
  if (!__DEV__) {
    offline.install({
      onInstalled: () => {
      },
      onUpdating: () => {
      },
      onUpdateReady: () => {
        offline.applyUpdate();
      }
    });
  }
};