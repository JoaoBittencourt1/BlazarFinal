<template>
  <div class="page-recovery">
    <div class="container-recovery">
      <img
        src="../../assets/images/login_reset/logo-login.svg"
        alt="Logo Blazar"
        class="imagem"
      />

      <div class="reset-container">
        <h1 class="reset-title">Esqueci minha senha</h1>
        <p>
          Insira seu endereço de e-mail abaixo para redefinir sua senha.
          Enviaremos um link para redefinir sua senha para o e-mail fornecido.
        </p>

        <form @submit.prevent="handlePasswordRecovery">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Digite seu email"
          />
          <button
            class="reset-btn"
            type="submit"
            unelevated
            label="Recovery"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? 'Enviando...' : 'Redefinir Senha' }}
          </button>
        </form>
        <button class="btn-back" @click="redirectHome()">Voltar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/supabase';
import { Notify } from 'quasar';
import { userAuthStore } from '../../stores/userAuthStore';

export default defineComponent({
  name: 'RecoveryPassword',

  setup: () => {
    const router = useRouter();
    const store = userAuthStore();
    setRecoveryPasswordMode(true);
    const loading = ref(false);
    const email = ref('');

    function setRecoveryPasswordMode(mode: boolean) {
      store.recoverPassword = mode;
    }

    async function handlePasswordRecovery() {
      try {
        loading.value = true;

        const { error } = await supabase.auth.resetPasswordForEmail(
          email.value
        );

        if (error) {
          throw error;
        }

        setRecoveryPasswordMode(false);
        Notify.create('E-mail de recuperação enviado com sucesso.');
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
      async redirectHome() {
        setRecoveryPasswordMode(false);
        await router.push({ path: '/' });
      },
      handlePasswordRecovery,
      loading,
      email,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-recovery {
  background: var(--grad-deg-purple);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
}

.container-recovery {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.image-container {
  margin-bottom: 20px;
}

.imagem {
  width: 11.31913rem;
  height: 4.26425rem;
}

.reset-container {
  background-color: none;
  border-radius: 5px;
  padding: 20px;
  display: inline-block;
  margin-top: 20px;
  width: 24.7rem;
}

.reset-container > p {
  color: #d0d0d0;
  text-align: center;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.25rem;
}

.reset-title {
  margin-bottom: 2rem;
  color: #fff;
  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25rem;
}

.reset-text {
  margin-bottom: 2rem;
  color: #d0d0d0;

  text-align: center;
  font-feature-settings: 'clig' off, 'liga' off;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}

label {
  text-align: left;
  width: 100%;
  padding-bottom: 16px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  color: #ffffff;
}

input {
  width: 100%;
  height: 56px;
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid #26bbfb;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
  background: transparent;
  outline: #26bbfb;
  background-color: transparent;
}

input:focus {
  outline: none;
  background-color: transparent;
}

input::placeholder {
  color: var(--gray-neutral);
}

.reset-btn {
  width: 100%;
  margin-top: 24px;
  padding: 18px;
  background-color: #007bff;
  color: #12171e;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.links {
  margin-top: 20px;
  text-align: center;
}

a {
  text-decoration: none;
  color: #007bff;
  display: block;
  padding: 10px 0;
}

a:last-child {
  border: #26bbfb;
}

a:hover {
  text-decoration: underline;
}

.links {
  display: flex;
  flex-direction: column;
}

.btn-back {
  width: 100%;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 0.5rem;
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  padding: 18px;
  margin-top: 1.5rem;
}
</style>
