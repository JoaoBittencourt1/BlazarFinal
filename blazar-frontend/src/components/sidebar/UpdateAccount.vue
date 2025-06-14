<template>
  <div class="floating-sidebar-container">
    <aside class="floating-sidebar" :class="{ 'fs-expanded': expanded }">
      <header class="fs-header">
        <figure class="logo">
          <BlazarLogo :full="expanded" />
        </figure>
        <button type="button" class="button-expand" @click="toggleVisibility">
          <span class="material-icons md-rounded" translate="no">navigate_next</span>
        </button>
      </header>

      <hr class="fs-divider" />

      <section class="fs-body">
        <NavigationSection
          :options="navigationPages"
          :class="{ 'nav-expanded': expanded }"
        />

        <PlanProCard :class="{ 'nav-hidden': !expanded }" />

        <NavigationSection
          :options="navigationConfigs"
          :class="{ 'nav-expanded': expanded }"
        />
      </section>

      <hr class="fs-divider" />

      <footer class="fs-footer">
        <button type="button" class="profile" @click="openProfile">
          <figure class="figure">
            <img class="avatar" :src="profileAvatar" alt="Foto de perfil de Username" />
            <div class="details">
              <h3 class="username">{{ profileName }}</h3>
              <p class="userplan">{{ userPlan }}</p>
            </div>
          </figure>
        </button>
      </footer>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/supabase';
import BlazarLogo from '../icons/BlazarLogoIcon.vue';
import NavigationSection from './NavigationSection.vue';
import PlanProCard from './PlanProCard.vue';

const router = useRouter();
const expanded = ref(false);
const profileAvatar = ref('/menu/avatar.svg');
const profileName = ref('Usuário');

// Navegação principal
const navigationPages = [
  {
    icon: 'home',
    describe: 'Início',
    action: () => router.push({ name: 'search' }),
  },
  {
    icon: 'person',
    describe: 'Dados do Usuário',
    action: () => emitTab('usuario'),
  },
  {
    icon: 'payments',
    describe: 'Dados de Pagamento',
    action: () => emitTab('pagamento'),
  },
  {
    icon: 'stars',
    describe: 'Plano Atual',
    action: () => emitTab('plano'),
  },
];

// Navegação inferior
const navigationConfigs = [
  {
    icon: 'settings',
    describe: 'Configurações',
    action: () => emitTab('configuracoes'),
  },
  {
    icon: 'logout',
    describe: 'Sair da conta',
    action: signOut,
  },
];

function emitTab(tab: string) {
  const event = new CustomEvent('tab-change', { detail: tab });
  window.dispatchEvent(event);
}

function openProfile() {
  router.push({ name: 'search' });
}

function toggleVisibility() {
  expanded.value = !expanded.value;
}

function clearStore() {
  router.push({ path: '/' });
}


function signOut() {
  supabase.auth.signOut().finally(clearStore);
}

function downloadImage(url: string) {
  supabase.storage
    .from('avatars')
    .download(url)
    .then((response) => {
      if (response.data) {
        profileAvatar.value = URL.createObjectURL(response.data);
      }
    });
}

const userPlan = ref('Sem plano'); 

function loadUseData() {
  supabase.auth.refreshSession().then((response) => {
    const metadata = response.data.user?.user_metadata;
    if (metadata) {
      downloadImage(metadata.avatar_url);
      profileName.value = metadata.fullname;

      const tipoPlano = metadata.tipoPlano || 'Não especificado'; // Assumindo que você tenha isso no user_metadata
      userPlan.value = tipoPlano === 'pf' ? 'Pessoa Física' : tipoPlano === 'pj' ? 'Pessoa Jurídica' : 'Sem plano';
    }
  });
}


loadUseData();
</script>

<style scoped lang="scss">
@import 'UpdateAccount.scss';
</style>
