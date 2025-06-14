<template>
  <GridExpandedLayout grid-style="publications">
    <template #header>
      <HeaderExpandedLayout
        category="Publicações"
        linkt-to="#publications-link-to"
        title="Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, asperiores dolor at eum facere autem non sequi illum rem reiciendis quasi pariatur."
        :export-was-clicked="exportToPdf"
        :save-was-clicked="saveSearch"
      />
    </template>

    <template #info1>
      <CardExpandedLayout fit-height>
        <TitlePatial>Revista</TitlePatial>
        <p>Nature</p>
      </CardExpandedLayout>
    </template>

    <template #info2>
      <CardExpandedLayout fit-height>
        <TitlePatial>Edição</TitlePatial>
        <p>256 ano 2025</p>
      </CardExpandedLayout>
    </template>

    <template #info3>
      <CardExpandedLayout fit-height>
        <TitlePatial>Publicação</TitlePatial>
        <p>01/01/2020</p>
      </CardExpandedLayout>
    </template>

    <template #info4>
      <CardExpandedLayout fit-height>
        <TitlePatial>IDs</TitlePatial>
        <ListPartial
          disc
          :items="[
            {
              prefix: 'ID:',
              suffix: 'teste.app.quasar',
              url: '#teste.app.quasar',
            },
            {
              prefix: 'ID2:',
              suffix: 'teste.app.app.teste.no.link',
            },
          ]"
        />
      </CardExpandedLayout>
    </template>

    <template #main>
      <CardExpandedLayout>
        <TitlePatial>Resumo</TitlePatial>

        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur cum
          quos assumenda eligendi, error consequatur sunt minus nostrum deserunt
          porro et iure amet voluptatem voluptatum nobis sapiente consectetur!
          Cum, tempora! Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Pariatur cum quos assumenda eligendi, error consequatur sunt
          minus nostrum deserunt porro et iure amet voluptatem voluptatum nobis
          sapiente consectetur! Cum, tempora! Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Pariatur cum quos assumenda eligendi,
          error consequatur sunt minus nostrum deserunt porro et iure amet
          voluptatem voluptatum nobis sapiente consectetur! Cum, tempora! Lorem,
          ipsum dolor sit amet consectetur adipisicing elit.
        </p>

        <br />

        <p class="keywords">
          <strong>Palavras-chave:</strong>

          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
            sunt maxime mollitia, fugit aliquid accusantium quibusdam ducimus
            eum aliquam, natus similique libero earum magnam voluptatem? Aut
            magnam ad architecto cum?
          </span>
        </p>

        <br />

        <TitlePatial>Outro</TitlePatial>

        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur cum
          quos assumenda eligendi, error consequatur sunt minus nostrum deserunt
          porro et iure amet voluptatem voluptatum nobis sapiente consectetur!
          Cum, tempora! Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Pariatur cum quos assumenda eligendi, error consequatur sunt
          minus nostrum deserunt porro et iure amet voluptatem voluptatum nobis
          sapiente consectetur! Cum, tempora!
        </p>

        <br />

        <ReferenceLinkPartial url="http://localhost:8080/#/search" />
      </CardExpandedLayout>
    </template>

    <template #sidebar>
      <CardExpandedLayout limit-height>
        <TitlePatial>Autores</TitlePatial>

        <VerticalScrollPartial>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis ad
            possimus, magnam voluptatibus enim dolores. Qui eius ipsum velit
            voluptatibus dolor.
          </p>
        </VerticalScrollPartial>
      </CardExpandedLayout>

      <CardExpandedLayout limit-height>
        <TitlePatial>Afiliações</TitlePatial>
        <VerticalScrollPartial>
          <ListPartial
            numeric
            :items="[
              {
                prefix:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laudantium dolores ipsum quod dignissimos temporibus',
              },
              {
                prefix:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laudantium dolores ipsum quod dignissimos temporibus, in eaque dolore repellendus deserunt tenetur nemo minima a quae exercitationem ullam ut necessitatibus maxime!',
              },
              {
                prefix:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laudantium dolores ipsum quod dignissimos temporibus, in eaque dolore repellendus deserunt tenetur nemo minima a quae exercitationem ullam ut necessitatibus maxime!',
              },
              {
                prefix:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laudantium dolores ipsum quod dignissimos temporibus, in eaque dolore repellendus deserunt tenetur nemo minima a quae exercitationem ullam ut necessitatibus maxime!',
              },
              {
                prefix:
                  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum laudantium dolores ipsum quod dignissimos temporibus, in eaque dolore repellendus deserunt tenetur nemo minima a quae exercitationem ullam ut necessitatibus maxime!',
              },
            ]"
          />
        </VerticalScrollPartial>
      </CardExpandedLayout>
    </template>
  </GridExpandedLayout>
</template>

<script lang="ts">
import GridExpandedLayout from '../layout/GridExpandedLayout.vue';
import HeaderExpandedLayout from '../layout/HeaderExpandedLayout.vue';
import CardExpandedLayout from '../layout/CardExpandedLayout.vue';
import TitlePatial from '../partials/TitlePartial.vue';
import ListPartial from '../partials/ListPartial.vue';
import VerticalScrollPartial from '../partials/VerticalScrollPartial.vue';
import ReferenceLinkPartial from '../partials/ReferenceLinkPartial.vue';

function exportToPdf(event: MouseEvent): void {
  console.info('Expotar para PDF');
}

function saveSearch(event: MouseEvent): void {
  console.info('Salvar busca');
}

export default {
  components: {
    GridExpandedLayout,
    HeaderExpandedLayout,
    CardExpandedLayout,
    TitlePatial,
    ListPartial,
    VerticalScrollPartial,
    ReferenceLinkPartial,
  },
  methods: {
    exportToPdf,
    saveSearch,
  },
};
</script>

<style lang="scss" scoped>
.keywords {
  display: flex;
  align-content: flex-start;
  gap: 0.5rem;

  strong {
    white-space: nowrap;
  }
}
</style>
