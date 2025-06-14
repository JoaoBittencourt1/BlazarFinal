<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Blazar </q-toolbar-title>
        <router-link to="/account">
          <q-avatar size="45px" v-if="src">
            <q-img :src="src" />
          </q-avatar>
          <q-avatar size="45" v-else color="blue">
            <q-icon name="person" color="white"></q-icon>
          </q-avatar>
          <q-tooltip>Manage your account</q-tooltip>
        </router-link>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import { supabase } from 'src/supabase';
import { userAuthStore } from 'stores/userAuthStore';

const linksList = [
  {
    title: 'Home',
    caption: 'Algum texto auxiliar aqui',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Pesquisar',
    caption: 'Encontre aqui outra coisa',
    icon: 'search',
    link: '/search',
  },
];
export default defineComponent({
  name: 'MainLayout',
  components: { EssentialLink },
  setup() {
    const leftDrawerOpen = ref(false);
    const src = ref('');
    const store = userAuthStore();

    const downloadImage = async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path);
        if (!error) {
          src.value = URL.createObjectURL(data);
        }
      } catch (error: any) {
        console.error('Error downloading image: ', error.message);
      }
    };
    watch(store.getUser, () => {
      downloadImage(store.getUser.user_metadata?.avatar_url || '');
    });
    async function getUserAvatar() {
      const {
        data: { user },
      } = await supabase.auth.refreshSession();
      let userAvatar = '';
      if (user) {
        userAvatar = user.user_metadata.avatar_url;
      }
      await downloadImage(userAvatar);
    }

    getUserAvatar();
    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      src,
    };
  },
});
</script>
