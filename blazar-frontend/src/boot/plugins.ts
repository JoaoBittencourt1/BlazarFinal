import { boot } from 'quasar/wrappers';
import { Quasar, Notify } from 'quasar';

Notify.setDefaults({
  type: 'positive',
  position: 'top',
  progress: true,
});
export default boot(({ app }) => {
  app.use(Quasar, {
    plugins: {
      Notify,
    },
  });
});
