<template>
  <div class="floating-sidebar-container">
    <aside
      class="floating-sidebar"
      :class="{
        'fs-expanded': expanded,
      }"
    >
      <header class="fs-header">
        <figure class="logo">
          <BlazarLogo :full="expanded" />
        </figure>

        <button type="button" class="button-expand" @click="toggleVisibility">
          <span class="material-icons md-rounded" translate="no"
            >navigate_next</span
          >
        </button>
      </header>

      <hr class="fs-divider" />

      <section class="fs-body">
        <NavigationSection
          :options="navigationPages"
          :class="{
            'nav-expanded': expanded,
          }"
        />

        <PlanProCard
          :class="{
            'nav-hidden': !expanded,
          }"
        />

        <NavigationSection
          :options="navigationConfigs"
          :class="{
            'nav-expanded': expanded,
          }"
        />
      </section>

      <hr class="fs-divider" />

      <footer class="fs-footer">
        <button type="button" class="profile" @click="openProfile">
          <figure class="figure">
            <img
              class="avatar"
              :src="profileAvatar"
              alt="Foto de perfil de Username"
            />

            <div class="details">
              <h3 class="username">{{ profileName }}</h3>
              <p class="userplan">Trial</p>
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
const expanded = ref<boolean>(false);
const profileAvatar = ref<string>('/menu/avatar.svg');
const profileName = ref<string>('Anonymous');

const navigationPages = [
  {
    icon: 'search',
    describe: 'Pesquisar',
    routeName: 'search',
    action: navigateTo('search'),
  },
  {
    icon: 'grid_view',
    describe: 'Dashboard',
    routeName: 'dashboard',
    action: navigateTo('dashboard'),
  },
  {
    icon: 'youtube_searched_for',
    describe: 'Histórico',
    routeName: '',
    action: () => {},
  },
  {
    icon: 'bookmarks',
    describe: 'Salvos',
    routeName: '',
    action: () => {},
  },
];

const navigationConfigs = [
  {
    icon: 'settings',
    describe: 'Configurações',
    routeName: 'Account',
    action: navigateTo('Account'),
  },
  {
    icon: 'logout',
    describe: 'Sair da conta',
    routeName: '',
    action: signOut,
  },
];

function navigateTo(name: string) {
  return () => {
    router.push({ name });
  };
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

function loadUseData() {
  supabase.auth.refreshSession().then((response) => {
    const metadata = response.data.user?.user_metadata;
    if (metadata) {
      downloadImage(metadata.avatar_url);
      profileName.value = metadata.fullname;
    }
  });
}

loadUseData();
</script>

<style lang="scss" scoped>
@import 'FloatingSidebarStyle.scss';
</style>
