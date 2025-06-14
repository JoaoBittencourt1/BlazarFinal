<template>
  <div class="delete-account-wrapper">
    <button class="delete-button" @click="abrirModal">Excluir minha conta</button>

    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Tem certeza que deseja excluir sua conta?</h2>
        <p>Essa ação é permanente. Digite sua senha para confirmar.</p>

        <input
          type="password"
          placeholder="Digite sua senha"
          v-model="senha"
        />

        <div class="modal-actions">
          <button @click="confirmarExclusao">Confirmar</button>
          <button @click="fecharModal">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from 'src/supabase';
import axios from 'axios';
import { Notify } from 'quasar';

const mostrarModal = ref(false);
const senha = ref('');
const router = useRouter();

function abrirModal() {
  mostrarModal.value = true;
}

function fecharModal() {
  mostrarModal.value = false;
  senha.value = '';
}

async function confirmarExclusao() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !senha.value) {
    Notify.create({ type: 'warning', message: 'Senha obrigatória' });
    return;
  }

  // 1. Validar senha
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: senha.value
  });

  if (loginError) {
    Notify.create({ type: 'negative', message: 'Senha incorreta' });
    return;
  }

  try {
    // 2. Cancelar assinatura no backend (Stripe + MongoDB)
    await axios.delete(`http://localhost:1500/api/premium/email/${encodeURIComponent(user.email)}`);

    // 3. Deletar do Supabase
    await supabase.auth.admin.deleteUser(user.id);

    Notify.create({ type: 'positive', message: 'Conta excluída com sucesso' });
    await supabase.auth.signOut();
    router.push({ name: 'SupabaseSignIn' });
  } catch (err) {
    Notify.create({ type: 'negative', message: 'Erro ao excluir conta' });
  } finally {
    fecharModal();
  }
}
</script>

<style scoped>
.delete-button {
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  text-align: left;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-content h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal-content input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.modal-actions button:first-child {
  background-color: #e74c3c;
  color: white;
}

.modal-actions button:last-child {
  background-color: #ccc;
  color: black;
}
</style>
