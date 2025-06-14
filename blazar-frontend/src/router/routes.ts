import LoginPageVue from '../components/login/LoginPage.vue';
import BlazarLayoutVue from '../components/layouts/BlazarLayout.vue';
import PremiumPageVue from '../components/premium/premium.vue'; 
import Pagamento from "../components/Pagamento/Pagamento.vue";
import TeladeObrigado from "../components/TelaDeObrigado/TeladeObrigado.vue";
import Solicitacao from "../components/Solicitacao/Solicitacao.vue";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPageVue,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/premium', 
    name: 'premium',
    component: PremiumPageVue,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: '/escolher-plano',
    name: 'EscolherPlano',
    component: () => import('../components/selectPlan/selectPlan.vue'),
    meta: {
      requiresAuth: false,
    },
  },

  
  {
    path: "/pagamento/:userId",
    name: "Pagamento",
    component: Pagamento,
    props: true,
  },
  
  {
    path: "/obrigado",
    name: "TeladeObrigado",
    component: TeladeObrigado,
  },
  {
    path: "/solicitacao",
    name: "Solicitacao",
    component: Solicitacao,
  },
  {
    path: '/app',
    component: BlazarLayoutVue,
    children: [
      {
        path: '/search',
        name: 'search',
        component: () => import('layouts/blazar/SearchPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('layouts/blazar/DashboardPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/',
    children: [
      {
        path: '/account',
        name: 'Account',
        component: () => import('components/auth/SupabaseAccount.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/account/reset-password',
        name: 'ResetPassword',
        component: () => import('../components/reset-password/ResetPassPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/recovery-password',
    name: 'RecoveryPassword',
    component: () => import('../components/reset-password/RecoveryPassword.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/reset-pass-confirm',
    name: 'ResetPasswordConfirm',
    component: () => import('../components/reset-password/ResetPasswordConfirm.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

