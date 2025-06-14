<template>
  <div class="page-reset-password-confirm">
    <div class="container-reset">
      <img
        src="../../assets/images/login_reset/logo-login.svg"
        alt="Logo Blazar"
        class="imagem"
      />
      <div class="reset-container">
        <h1 class="reset-title">Recuperação de senha</h1>
        <form @submit.prevent="updatePass">
          <label for="password">Nova senha</label>
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

          <label for="confirm-password">Confirme a nova senha</label>
          <div class="password-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm-password"
              v-model="confirmPassword"
              placeholder="Confirme a nova senha"
            />
            <span @click="toggleConfirmPasswordVisibility" class="show-password-icon">
              <img
                :src="showConfirmPassword ? '/images/eye-slash.svg' : '/images/eye.svg'"
                alt="Mostrar Senha"
              />
            </span>
          </div>

          <button
            class="reset-btn"
            type="submit"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? 'Redefinindo...' : 'Redefinir Senha' }}
          </button>
        </form>
        <button class="btn-back" @click="redirectToPage">Voltar</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/supabase';
import { Notify } from 'quasar';
import { userAuthStore } from 'stores/userAuthStore';

export default defineComponent({
  name: 'ResetPasswordConfirm',
  setup() {
    const store = userAuthStore();
    const router = useRouter();
    const loading = ref(false);
    const password = ref('');
    const confirmPassword = ref('');
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);

    function togglePasswordVisibility() {
      showPassword.value = !showPassword.value;
    }

    function toggleConfirmPasswordVisibility() {
      showConfirmPassword.value = !showConfirmPassword.value;
    }

    function validatePassword(pass: string) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{10,}$/;
      return regex.test(pass);
    }

   onMounted(async () => {
  await new Promise((r) => setTimeout(r, 150));
  const hash = window.location.hash;
  console.log('Hash completo:', hash);

  const isRecovery = hash.includes('type=recovery') && hash.includes('access_token');
  if (!isRecovery) {
    console.warn('Hash não contém tipo recovery + access_token');
    return;
  }

  const params = new URLSearchParams(hash.slice(1));
  const accessToken = params.get('access_token');
  console.log('Token extraído:', accessToken);

  const { data, error } = await supabase.auth.exchangeCodeForSession(accessToken!);
  console.log('Resposta exchangeCodeForSession:', { data, error });

  if (error) {
    Notify.create({ message: 'Link inválido ou expirado.', type: 'negative' });
    return;
  }

  if (data?.user) {
    store.setUser(data.user);
    console.log('Usuário autenticado:', data.user);
  } else {
    Notify.create({ message: 'Sessão inválida. Tente novamente.', type: 'negative' });
  }
});


    async function updatePass() {
      if (!validatePassword(password.value)) {
        Notify.create({
          message: 'A senha deve ter no mínimo 10 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.',
          type: 'negative',
        });
        return;
      }

      if (password.value !== confirmPassword.value) {
        Notify.create({
          message: 'As senhas não coincidem.',
          type: 'negative',
        });
        return;
      }

      try {
        loading.value = true;
        const user = store.getUser;
        if (!user?.id) {
          throw new Error('Usuário não autenticado. Acesse novamente o link de redefinição.');
        }

        const { data, error } = await supabase.auth.updateUser({
          password: password.value,
        });

        if (error) {
          throw error;
        }

        store.$patch({ user: data?.user });

        Notify.create({
          message: 'Seus dados foram atualizados com sucesso.',
          type: 'positive',
        });

        await router.push({ path: '/search' });
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
      redirectToPage() {
        router.push('/');
      },
      updatePass,
      password,
      confirmPassword,
      loading,
      showPassword,
      showConfirmPassword,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-reset-password-confirm {
  font-family: 'Inter', sans-serif;
  background: var(--grad-deg-purple) no-repeat;
}

.container-reset {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
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
  width: 24.6875rem;
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
  outline: none;
}

input:focus {
  outline: none;
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
  cursor: pointer;
}

.show-password-icon img {
  width: 20px;
  height: 20px;
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
