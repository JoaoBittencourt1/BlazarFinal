<script setup>
import { onMounted, ref } from 'vue';
import Auth from 'layouts/LoginLayout.vue';
import { supabase } from './supabase';
import { useRouter } from 'vue-router';

const session = ref(null);
const loading = ref(true);
const router = useRouter();

onMounted(() => {
  const hash = window.location.hash;
  if (hash.includes('access_token') && hash.includes('type=recovery')) {
    router.replace('/reset-pass-confirm');
  }

  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
    loading.value = false;
  });

  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
    loading.value = false;
  });
});
</script>

<template>
  <div v-if="loading">
    Carregando...
  </div>
  <router-view v-else-if="session" :session="session" />
  <Auth v-else />
</template>
