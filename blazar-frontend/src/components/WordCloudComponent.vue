<template>
  <div v-if="wordCloudData" class="word-cloud-component">
    <vue-word-cloud
      class="word-cloud-chart"
      :words="wordCloudData"
      :color="filterColor"
      font-family="Roboto"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import VueWordCloud from 'vuewordcloud';

export default defineComponent({
  name: 'WordCloudComponent',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  components: { VueWordCloud },
  data(props) {
    const text =
      'Mussum Ipsum, cacilds vidis litro abertis. Interagi no mé, cursus Mussum quis, Mussum  vehicula ac nisi.Si num tem Mussum leite então Mussum bota uma pinga aí cumpadi!Suco de cevadiss deixa as pessoas mais interessantis.Cevadis im ampola pa arma uma pindureta.';
    let wordCloudData = ref([]);

    if (props.text) {
      wordCloudData.value = this.prepareTextToWordCloud(props.text);
    }

    return {
      wordCloudData,
    };
  },
  methods: {
    countOcurrences(str, word) {
      let a = str.split(' ');
      let count = 0;
      for (let i = 0; i < a.length; i++) {
        if (word == a[i]) count++;
      }
      return count;
    },
    prepareTextToWordCloud(text) {
      let cloudWordArray = [{}];
      let checkedWords = [
        'the',
        'a',
        'to',
        'of',
        'is',
        'and',
        'for',
        'in',
        'no',
        'must',
        'with',
        'at',
        'than',
        'or',
        'No',
        'by',
        'Not',
        'not',
        'within',
        'At',
      ];
      let arrayText = text.split(/\s+/);

      arrayText.forEach((word) => {
        const filteredWord = word.replace(/[.,!?;:()"'-]/g, '');
        if (!checkedWords.includes(filteredWord)) {
          const cloudWordObject = {
            word: filteredWord,
            wordCount: this.countOcurrences(text, filteredWord),
          };
          checkedWords.push(filteredWord);
          cloudWordArray.push(cloudWordObject);
        }
      });

      cloudWordArray.sort((a, b) => b.wordCount - a.wordCount);

      const top15Words = cloudWordArray.slice(0, 15);

      const wordCloudData = top15Words.map((item) => [
        item.word,
        item.wordCount,
      ]);

      return wordCloudData;
    },
    filterColor([, weight]) {
      if (weight > 50) return '#FF0000';
      if (weight > 40) return '#00FF7F';
      if (weight > 30) return '#00BFFF';
      if (weight > 20) return '#836FFF';
      if (weight > 10) return '#FFD700';
      return 'RoyalBlue';
    }
  },
});
</script>

<style lang="scss" scoped>
.word-cloud-component {
  display: flex;
  align-items: center;
  justify-content: center;

  .word-cloud-chart {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    width: 340px;
  }
}
</style>
