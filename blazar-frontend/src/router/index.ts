import { route } from 'quasar/wrappers';
import { ref } from 'vue';
import { supabase } from '../supabase';
import { userAuthStore } from 'src/stores/userAuthStore';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */
const session = ref();
export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  function getResetPasswordRoute() {
    return { name: 'ResetPassword' };
  }

  //implementing our auth middleware
  Router.beforeEach(async (to, _, next) => {
    await supabase.auth.getSession().then(({ data }) => {
      session.value = data.session;
    });

    supabase.auth.onAuthStateChange((_, _session) => {
      session.value = _session;
    });

    // if(!session.value?.user) {
    //   return { name: 'Login' };
    // }

    const store = userAuthStore();
    const recoveryModeFromURL =
      to.fullPath.indexOf('type=recovery') !== -1 ||
      to.fullPath.indexOf('type=invite') !== -1;

    if (to.meta.requiresAuth && !session.value) {
      return next({ name: 'Pagamento' });
    }

    if (
      (store.getPasswordModeActive || recoveryModeFromURL) &&
      to.name !== 'ResetPassword'
    ) {
      return getResetPasswordRoute();
    }

    return next();
  });
  return Router;
});
