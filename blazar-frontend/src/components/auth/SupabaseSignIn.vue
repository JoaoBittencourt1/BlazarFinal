<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/supabase';
import { Notify } from 'quasar';
import { userAuthStore } from 'stores/userAuthStore';

export default defineComponent({
  name: 'SupabaseSignIn',
  setup: () => {
    const router = useRouter();
    const store = userAuthStore();
    const user = ref({});
    const loading = ref(false);
    const email = ref('');
    const password = ref('');

    async function handleLogin() {
      try {
        loading.value = true;

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });

        if (error) {
          throw error;
        }

        store.$patch({ user: data?.session?.user });

        const verifica = await fetch('http://localhost:1500/api/premium/verifica-pagamento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.value }),
        });
        const resultado = await verifica.json();

        if (!resultado.pagamentoConfirmado) {
          Notify.create({
            message: 'Seu pagamento ainda não foi confirmado.',
            type: 'warning',
          });
          await supabase.auth.signOut();
          await router.push({ name: 'SupabaseSignIn' });
          return;
        }

        await router.push({ name: 'Index' });
      } catch (error) {
        if (error instanceof Error) {
          Notify.create({
            message: `Error: ${error.message}`,
            type: 'negative',
          });
        }
      } finally {
        loading.value = false;
      }
    }

    return {
      user,
      email,
      password,
      loading,
      handleLogin,
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
        <q-form class="q-px-sm q-pt-xl" @submit="handleLogin">
          <q-card square class="shadow-24" style="width: 300px; height: 485px">
            <q-card-section class="text-center" style="height: 150px">
              <q-img
                class="center"
                :img-style="{
                  borderRadius: '80px',
                  width: '150px',
                  height: '150px',
                }"
                src="~assets/images/logo.jpg"
                round
              />
            </q-card-section>
            <q-card-section class="q-mt-lg">
              <q-input
                square
                clearable
                v-model="email"
                type="email"
                label="Email"
              >
                <template #prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
              <q-input
                square
                clearable
                v-model="password"
                type="password"
                label="Password"
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
                label="Sign In"
                :loading="loading"
                :disabled="loading"
              />
            </q-card-actions>
            <q-card-section class="text-center q-pa-sm">
              <p class="text-grey-6">
                Forgot your password? <br />
                Send a message to
                <a
                  href="mailto:admin@scitarc.com?subject=Password Change&body=Hello admin, please change my password!\n Thank you!"
                  >admin@scitarc.com</a
                >
              </p>
            </q-card-section>
          </q-card>
        </q-form>
      </div>
    </div>
  </q-layout>
</template>
