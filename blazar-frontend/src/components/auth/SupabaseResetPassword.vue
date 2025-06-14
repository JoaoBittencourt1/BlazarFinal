<script lang="ts">
import { supabase } from 'src/supabase';
import { ref, defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userAuthStore } from 'stores/userAuthStore';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'SupabaseResetPassword',
  setup() {
    const store = userAuthStore();
    const router = useRouter();
    const loading = ref(false);
    const password = ref('');

    function setRecoveryPasswordMode(mode: boolean) {
      store.setRecoveryPasswordMode(mode);
    }

    onMounted(async () => {
      setRecoveryPasswordMode(true);

      const hash = window.location.hash;
      const isRecovery = hash.includes('type=recovery') && hash.includes('access_token');

      if (isRecovery) {
        const params = new URLSearchParams(hash.replace('#', ''));
        const accessToken = params.get('access_token');

        if (!accessToken) {
          Notify.create({
            message: 'Token de acesso não encontrado.',
            type: 'negative',
          });
          return;
        }

        // CORRIGIDO: apenas a string é passada
        const { data, error } = await supabase.auth.exchangeCodeForSession(accessToken);

        if (error) {
          Notify.create({
            message: 'Link inválido ou expirado.',
            type: 'negative',
          });
          return;
        }

        if (data?.user) {
          store.setUser(data.user);
        } else {
          Notify.create({
            message: 'Sessão inválida. Tente novamente.',
            type: 'negative',
          });
        }
      }
    });

    async function updateProfile() {
      try {
        loading.value = true;
        const user = store.getUser;

        if (!user?.id) {
          throw new Error('Usuário não autenticado. Acesse novamente o link de redefinição.');
        }

        const { data, error } = await supabase.auth.updateUser({
          password: password.value,
        });

        if (error) throw error;

        // ADIÇÃO: Atualiza senha no MongoDB também
        const encodedEmail = encodeURIComponent(user.email);
        await fetch(`http://localhost:1500/api/premium/email/${encodedEmail}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ senha: password.value }),
        });

        setRecoveryPasswordMode(false);
        Notify.create('Senha atualizada com sucesso!');
        store.setUser(data.user);
        await router.push({ name: 'Index' });

        return data;
      } catch (error: any) {
        Notify.create({
          message: `Erro: ${error.message}`,
          type: 'negative',
        });
      } finally {
        loading.value = false;
      }
    }

    return {
      updateProfile,
      password,
      loading,
    };
  },
});
</script>

<template>
  <q-layout
    class="window-height window-width row justify-center items-center"
    style="background: linear-gradient(#41b1e4, #53b799)"
  >
    <div class="column q-pa-lg">
      <div class="row">
        <q-form class="q-px-sm q-pt-xl" @submit="updateProfile">
          <q-card square class="shadow-24" style="width: 300px; height: 500px">
            <q-card-section>
              <div class="text-h3 text-center">SciTARC</div>
            </q-card-section>
            <q-card-section>
              <div class="text-h6 text-center">Digite sua nova senha</div>
            </q-card-section>
            <q-card-section class="text-center" style="height: 150px">
              <q-img
                class="center"
                :img-style="{ borderRadius: '80px', width: '150px', height: '150px' }"
                src="~assets/images/logo.jpg"
                round
              />
            </q-card-section>
            <q-card-section class="q-mt-lg">
              <q-input
                square
                clearable
                v-model="password"
                type="password"
                label="Nova Senha"
              >
                <template #prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-actions class="q-px-lg">
              <q-btn
                type="submit"
                unelevated
                size="lg"
                color="primary"
                class="full-width text-white"
                label="Atualizar"
                :loading="loading"
                :disabled="loading"
              />
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-layout>
</template>
