<template>
  <div class="page-reset-password">
    <div class="container-reset">
      <img
        src="../../assets/images/login_reset/logo-login.svg"
        alt="Logo Blazar"
        class="imagem"
      />

      <div class="reset-container">
        <h1 class="reset-title">Redefinir senha</h1>

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
                :src="
                  showPassword ? '/images/eye-slash.svg' : '/images/eye.svg'
                "
                alt="Mostrar Senha"
              />
            </span>
          </div>
          <button
            class="reset-btn"
            type="submit"
            unelevated
            label="Reset"
            :loading="loading"
            :disabled="loading"
          >
            Redefinir Senha
          </button>
        </form>
        <button class="btn-back" @click="redirectToPage">Voltar</button>
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
  name: 'ResetPassword',
  setup: () => {
    const store = userAuthStore();

    const router = useRouter();
    const loading = ref(false);
    const password = ref('');
    const showPassword = ref(false);

    async function updatePass() {
      try {
        loading.value = true;
        const user = store.getUser;
        const updates = {
          id: user.id,
          updated_at: new Date(),
          password: password.value,
        };

        const { data, error } = await supabase.auth.updateUser(updates);
        if (error) {
          throw error;
        }

        Notify.create('Password updated with success!');
        store.$patch({
          user: user,
        });
        await router.push({ path: '/' });

        return data;
      } catch (error: any) {
        Notify.create({
          message: `Error: ${error.message}`,
          type: 'negative',
        });
      } finally {
        loading.value = false;
      }
    }

    function togglePasswordVisibility() {
      showPassword.value = !showPassword.value;
    }
    return {
      redirectToPage() {
        router.back();
      },
      updatePass,
      password,
      loading,
      showPassword,
      togglePasswordVisibility,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-reset-password {
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

.password-container {
  position: relative;
  width: 100%;
}

.show-password-icon {
  position: absolute;
  top: 45%;
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
