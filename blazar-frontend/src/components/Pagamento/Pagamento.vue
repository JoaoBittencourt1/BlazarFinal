<template>
  <div class="pagina-pagamento">
    <div class="fatura">
      <!-- Card 1 -->
      <div class="card">
        <form @submit.prevent="onSubmit">
          <div class="fatura-header">
            <span class="title">Fatura #313233</span>
            <span>(26/09/2024)</span>
          </div>
          <hr />
          <div class="fatura-row">
            <span class="title">Descrição</span>
            <span class="value">Valor</span>
          </div>
          <hr />
          <div class="fatura-row">
            <span class="title">Plano Gold Anual</span>
            <span class="value">{{ valorFormatado }}</span>
          </div>
          <hr />
          <div class="fatura-total-row">
            <span class="title">Total a pagar</span>
            <span class="value">{{ valorFormatado }}</span>
          </div>
        </form>
      </div>

      <!-- Card 2 -->
      <div class="card2">
        <form @submit.prevent="onSubmit">
          <div class="title-payment">Dados de Pagamento</div>
          <input type="text" placeholder="Nome Completo" v-model="cardOwnerName" required />
          <input type="text" placeholder="CPF - EX: 071.XXX.XXX-XX" v-model="cpf" required />

          <div id="card-number-element" class="stripe-input"></div>

          <div id="cvcValidade">
            <div id="card-expiry-element" class="stripe-input"></div>
            <div id="card-cvc-element" class="stripe-input"></div>
          </div>
          <div class="botao-wrapper">
            <input :disabled="isSubmitting" class="botao-concluir" type="submit" value="Salvar Dados de Pagamento" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import "./Pagamento.scss";
import { ref, onMounted } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

export default {
  name: "PagamentoVue",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userId = route.params.userId;
    const plano = route.query.plano || "pj";

    const valorPlano = plano === "pf" ? 200 : 100;
    const valorFormatado = plano === "pf" ? "R$ 2,00" : "R$ 1,00";

    const stripePromise = loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY);
    const cardNumberElement = ref(null);
    const cardExpiryElement = ref(null);
    const cardCvcElement = ref(null);
    const cardOwnerName = ref("");
    const cpf = ref("");
    const clientSecret = ref("");
    const isSubmitting = ref(false);

    onMounted(async () => {
      try {
        // Carregar as informações do plano
        let tipoPlano = plano;
        if (!plano) {
          const res = await axios.get(`http://localhost:1500/api/premium/${userId}`);
          tipoPlano = res.data.tipoPlano || "pj"; // fallback para pj se não vier nada
        }

        const valor = tipoPlano === "pf" ? 200 : 100;
        valorFormatado.value = tipoPlano === "pf" ? "R$ 2,00" : "R$ 1,00";

        // Obter o clientSecret para a transação
        const response = await axios.post("http://localhost:1500/create-payment-intent", {
          plano: tipoPlano,
        });

        clientSecret.value = response.data.clientSecret;

        if (!clientSecret.value) {
          alert("Erro ao configurar o pagamento.");
          return;
        }

        const stripe = await stripePromise;
        const elements = stripe.elements();

        cardNumberElement.value = elements.create("cardNumber", {
          style: { base: { fontSize: "16px", color: "#32325d" } },
        });
        cardNumberElement.value.mount("#card-number-element");

        cardExpiryElement.value = elements.create("cardExpiry", {
          style: { base: { fontSize: "16px", color: "#32325d" } },
        });
        cardExpiryElement.value.mount("#card-expiry-element");

        cardCvcElement.value = elements.create("cardCvc", {
          style: { base: { fontSize: "16px", color: "#32325d" } },
        });
        cardCvcElement.value.mount("#card-cvc-element");

      } catch (error) {
        console.error("Erro ao configurar Stripe:", error);
        alert("Erro ao configurar os campos de pagamento.");
      }
    });

    const onSubmit = async () => {
      if (isSubmitting.value || !clientSecret.value) return;
      isSubmitting.value = true;

      const stripe = await stripePromise;

      try {
        // Confirmar o pagamento
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret.value, {
          payment_method: {
            card: cardNumberElement.value,
            billing_details: { name: cardOwnerName.value },
          },
        });

        if (error) {
          alert("Erro ao processar o pagamento: " + error.message);
          return;
        }

        if (!paymentIntent || paymentIntent.status !== "succeeded") {
          alert("Pagamento não foi concluído com sucesso.");
          return;
        }

        // Enviar os dados de pagamento atualizados para o backend
        const pagamentoData = {
          paymentIntentId: paymentIntent.id,
          paymentStatus: paymentIntent.status,
          cardOwnerName: cardOwnerName.value,
          cpfTitular: cpf.value,
          amount: valorFormatado,
          paymentDate: new Date().toISOString(),
          cardLast4: paymentIntent.payment_method_details.card.last4, // Captura os últimos 4 dígitos do cartão
          cardExpiry: paymentIntent.payment_method_details.card.exp_month + '/' + paymentIntent.payment_method_details.card.exp_year, // Validade do cartão
        };

        // Atualizar os dados no servidor
        const response = await axios.patch(
          `http://localhost:1500/api/premium/${userId}/confirmar-pagamento`,
          pagamentoData
        );

        if (response.status === 200) {
          router.push({ name: "TeladeObrigado" });
        } else {
          alert("Erro ao confirmar pagamento no servidor.");
        }
      } catch (e) {
        console.error("Erro inesperado:", e);
        alert("Erro inesperado ao processar pagamento. Verifique os dados e tente novamente.");
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      onSubmit,
      cardOwnerName,
      cpf,
      isSubmitting,
      valorFormatado,
    };
  },
};
</script>
