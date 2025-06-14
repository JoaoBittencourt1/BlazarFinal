<template>
  <div>
    {{ moleculeInformation.map((mol) => mol) }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Information from 'components/types/Information';
import type { Ref } from 'vue';
export default defineComponent({
  name: 'MoleculeRenderer',
  props: {
    molecule: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    let moleculeInformation: Ref<string[]>;
    moleculeInformation = props.molecule.Section[0].Section.map(
      (internalSection: { Information: [] }) => {
        return internalSection?.Information.map((information: Information) => {
          return information?.Value.StringWithMarkup.map(
            (stringWithMarkup: { String: string }) => {
              return stringWithMarkup?.String;
            }
          );
        });
      }
    );

    return {
      moleculeInformation,
    };
  },
});
</script>

<style scoped></style>
