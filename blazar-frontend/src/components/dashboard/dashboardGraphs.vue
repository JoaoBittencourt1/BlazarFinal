<template>
  <div class="graphs">
    <div id="header">
      <div id="header-info-graphs">
        <h1 class="dashboard-title">Dashboard</h1>
        <h4 class="graphs-title">{{ titulo }}</h4>
      </div>

      <div class="header-btts">
        <button class="graphs-btn-top">Personalizar</button>
        <button class="graphs-btn-top" @click="exportToPDF">
          Exportar para PDF
        </button>
        <button class="graphs-btn-top">Salvar Dashboard</button>
      </div>
    </div>
    <hr class="bar" />

    <div class="graph-container">
      <dashboard-card
        class="graph-card"
        v-for="(graph, index) in graphs"
        :key="index"
        :title="graph.title"
      >
      </dashboard-card>

      <div class="btn-add-container">
        <button class="btn-add-graph" @click="abrirModal">
          Adicionar Gráfico
        </button>
      </div>

      <div class="modal-graph" v-if="mostrarModal">
        <div class="modal-content">
          <h2 class="graph-card-title">Adicionar Título do Gráfico</h2>
          <input
            class="graph-title-input"
            v-model="novoTitulo"
            placeholder="Título do Novo Gráfico"
          />
          <div class="modal-btns">
            <button @click="adicionarGraph" class="btn-modal btn-modal-add">
              Criar Gráfico
            </button>
            <button @click="fecharModal" class="btn-modal">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DashboardCard from './dashboardGraphsCard.vue';

export default {
  name: 'DashboardGraphs',
  components: {
    DashboardCard,
  },
  props: {
    novoDashboard: {
      type: Object,
      default() {},
    },
  },

  data() {
    return {
      graphs: [],
      novoTitulo: '',
      mostrarModal: false,
    };
  },

  methods: {
    exportToPDF() {
      const pdf = new jsPDF();
      const graphContainer = this.$el.querySelector('.graph-container');

      html2canvas(graphContainer).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');

        pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
        pdf.save('dashboard.pdf');
      });
    },

    abrirModal() {
      this.mostrarModal = true;
    },

    fecharModal() {
      this.mostrarModal = false;
      this.novoTitulo = '';
    },
    adicionarGraph() {
      if (this.novoTitulo.trim() !== '') {
        this.graphs.push({
          title: this.novoTitulo,
        });
        this.novoTitulo = '';
        this.mostrarModal = false;
      }
    },
  },
};
</script>
<style lang="css" scoped>
@import './DashboardGraphs.css';
</style>
