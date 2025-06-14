<template>
  <div class="container-login">
    <div class="image-container">
      <img
        src="../../assets/images/login_reset/logo-login.svg"
        alt="logo Blazar"
        class="imagem"
      />
    </div>
    <div class="login-container">
      <img
        src="/images/botao-google.png"
        alt="Entrar com Google"
        @click="loginComGoogle"
        style="
          cursor: pointer;
          width: 350px;
          height: 50px;
          object-fit: contain;
          display: block;
          margin: 0 auto 20px;
        "
      />
      <form @submit.prevent="handleLogin">
        <label for="email">Email</label>
        <input type="text" id="email" v-model="email" placeholder="Seu email" />

        <label for="senha">Senha</label>
        <div class="password-container">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="senha"
            v-model="password"
            placeholder="Sua senha"
          />
          <span @click="togglePasswordVisibility" class="show-password-icon">
            <img
              :src="showPassword ? '/images/eye-slash.svg' : '/images/eye.svg'"
              alt="Mostrar Senha"
            />
          </span>
        </div>

        <button
          class="login-btn"
          type="submit"
          unelevated
          label="Login"
          :loading="loading"
          :disabled="loading"
        >
          Entrar
        </button>
      </form>
      <div class="links">
        <button
          class="btn-reset-pass"
          type="submit"
          unelevated
          label="Reset"
          :loading="loading"
          :disabled="loading"
          @click="redirectToPage('recovery-password')"
        >
          Esqueci minha senha
        </button>
        <button class="btn-premium" @click="redirectToPage('escolher-plano')">
          Contrate o Plano Premium
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/supabase';
import { Notify } from 'quasar';
import { userAuthStore } from 'stores/userAuthStore';

export default defineComponent({
  name: 'LoginPage',
  setup: () => {
    const router = useRouter();
    const store = userAuthStore();
    const user = ref({});
    const loading = ref(false);
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);

    async function handleLogin() {
  try {
    loading.value = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value.trim(),
    });

    if (error) throw error;

    store.$patch({ user: data?.session?.user });

    const res = await fetch(`http://localhost:1500/api/premium/email/${encodeURIComponent(email.value.trim())}`);
    const json = await res.json();

    if (!json.success) {
      await router.push({ path: "/escolher-plano" });
      return;
    }

    if (!json.pagamentoConfirmado) {
      await router.push({
        path: `/pagamento/${json.id}`,
        query: { plano: json.tipoPlano || "pj" }
      });
    } else {
      await router.push({ name: "search" });
    }

  } catch (error) {
    if (error instanceof Error) {
      Notify.create({
        message: `Erro ao logar: ${error.message}`,
        type: 'negative',
      });
    }
  } finally {
    loading.value = false;
  }
}


    function togglePasswordVisibility() {
      showPassword.value = !showPassword.value;
    }

    return {
      async redirectToPage(page: string) {
        await router.push({ path: '/' + page });
      },
      user,
      email,
      password,
      loading,
      handleLogin,
      showPassword,
      togglePasswordVisibility,
    };
  },
});
</script>

<style lang="scss" scoped>
.container-login {
  font-family: 'Inter', sans-serif;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #581db6;
  height: 100vh;
  margin: 0;
  background: var(--grad-deg-purple);
}

.image-container {
  margin-bottom: 20px;
}

.imagem {
  width: 15rem;
  height: 5.7rem;
}

.login-container {
  background-color: none;
  border-radius: 5px;
  display: inline-block;
  margin-top: 20px;
  width: 24.6875rem;
}

h1 {
  margin: 0;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

label {
  text-align: left;
  width: 100%;
  padding-bottom: 16px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  color: #ffffff;
  margin-top: 6px;
}

input {
  width: 100%;
  padding: 10px 30px 10px 10px;
  border: 1px solid #26bbfb;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
  background: transparent;
  outline: #26bbfb;
  background-color: transparent;
}

input::placeholder {
  color: var(--gray-neutral);
}

.password-container {
  position: relative;
  width: 100%;
}

.show-password-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  z-index: 1;
  cursor: pointer;
}

.show-password-icon img {
  width: 20px;
  height: 20px;
}

.login-btn {
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
  display: flex;
  flex-direction: column;
  text-align: center;
}

.btn-reset-pass,
.btn-premium {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  padding: 18px;
  margin: 6px;
  cursor: pointer;
}

.btn-premium {
  border-radius: 8px;
  border: 1px solid #26bbfb;
}

.btn-reset-pass:hover {
  transform: scale(1.05);
}

.btn-premium:hover {
  transform: scale(1.05);
}

.login-btn:hover {
  transform: scale(1.05);
}
</style>
