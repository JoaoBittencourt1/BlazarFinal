<template>
  <div class="q-pa-md">
    <q-input v-model="termo" label="Pesquisar molécula" @keyup.enter="buscar" />
    <div v-if="modeloCarregado" id="mol-viewer" class="q-mt-md" style="width: 100%; height: 500px;" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const termo = ref('')
const modeloCarregado = ref(false)

const buscar = async () => {
  const res = await fetch(`/api/molecule?q=${encodeURIComponent(termo.value)}`)
  const data = await res.json()
  if (data.erro) return alert(data.erro)

  const viewer = $3Dmol.createViewer('mol-viewer', {
    defaultcolors: $3Dmol.elementColors.CPK,
    backgroundColor: 'white'
  })

  const sdf = await fetch(data.arquivo_sdf).then(r => r.text())
  viewer.addModel(sdf, 'sdf')
  viewer.setStyle({}, { stick: {}, sphere: { scale: 0.3 } })
  viewer.zoomTo()
  viewer.render()
  viewer.animate({ loop: 'backAndForth' })

  modeloCarregado.value = true
}
</script>

<style scoped>
#mol-viewer {
  border: 1px solid #ccc;
  border-radius: 8px;
}
</style>
