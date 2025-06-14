<template>
  <q-card class='q-mt-md'>
    <q-card-section>
      <div class='q-mb-sm'>
         <span class='text-h6'>{{ articleTitle }}</span>
      </div>
      <div class='q-mb-sm'>
        <strong>DOI:</strong>
        {{ elocationID }}
      </div>
      <q-separator class="q-ma-sm" />
      <div class='q-mb-sm'>
        <strong class="text-h6">Resumo: </strong>
        <div v-html="abstractText" ></div>
      </div>
    </q-card-section>

    <q-card-section>
      <q-expansion-item
        class="rounded-borders"
        expand-separator
        label="Mais"
        caption="Mais informações da publicação"
      >
        <q-card>
          <q-card-section>
            <div class='q-mb-sm'>
              <strong>Autores: </strong>
              <div v-for="(item, index)  in article.Article.AuthorList.Author" :key="index">
                {{ item.LastName }}, {{ item.ForeName }}
              </div>
            </div>

            <div class='q-mb-sm'>
              <strong>Revista: </strong>
              {{ article.Article.Journal.Title }}
            </div>

            <div class='q-mb-sm'>
              <strong>Data de Publicação: </strong>
              {{ article.Article?.ArticleDate?.Day }}/{{ article.Article?.ArticleDate?.Month }}/{{ article.Article?.ArticleDate?.Year }}
            </div>

            <div class="q-mb-sm">
              <strong>Palavras-chave: </strong>
              {{ keyWords }}
            </div>

            <div class="q-mb-sm">
              <WordCloudComponent v-if="wordCloudText" :text="wordCloudText"></WordCloudComponent>
            </div>
          </q-card-section>
        </q-card>

      </q-expansion-item>
    </q-card-section>

  </q-card>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import Article from 'src/components/types/Pubmed/Article';
import WordCloudComponent from 'components/WordCloudComponent.vue';

export default defineComponent({
  name: 'PublicationCard',
  components: {WordCloudComponent},
  props: {
    article: {
      type:  Object as ()=> Article,
      required: true
    }
  },

  setup(props) {
    console.log('props.article', props.article);

    const articleTitle = computed(() => {
      if(typeof props.article.Article.ArticleTitle === 'string'){
        return props.article.Article.ArticleTitle;
      }

      if(Array.isArray (props.article.Article.ArticleTitle['#'])) {
        let articleTitle = '';
          props.article.Article.ArticleTitle['#'].forEach(text =>{
          articleTitle += text + ' ';
        })
        return articleTitle;
      }
      return 'Nao possui título';
    })

    const abstractText = computed(() => {
      if(typeof props.article.Article?.Abstract?.AbstractText === 'string') {
          return props.article.Article.Abstract.AbstractText;
      }

      if(Array.isArray (props.article.Article?.Abstract?.AbstractText)) {
        let abstractText = '';
           props.article.Article.Abstract.AbstractText.forEach(text => {
            abstractText += text['@Label'] + ': ' + text['#'] + '<br/>';
          })
          console.log('abstractText:',abstractText);

         return abstractText;
      }

      if(Array.isArray (props.article.Article?.Abstract?.AbstractText['#'])) {
        let abstractText = '';
           props.article.Article.Abstract.AbstractText['#'].forEach(text => {
            abstractText += text + '<br/>';
          })
          console.log('props.article.Article?.Abstract?.AbstractText["#""]:', abstractText);

         return abstractText;
      }

     return 'Não existe resumo disponível';
    })

    const elocationID = computed(() => {
      if(typeof props.article.Article.ELocationID === 'string'){
        console.log('props.article.Article.ELocationID: STRINGGG!!!', props.article.Article.ELocationID);

        return props.article.Article.ELocationID;
      }

      if(Array.isArray (props.article.Article.ELocationID)){
        let elocationID = '';
          props.article.Article.ELocationID.forEach(text => {
          elocationID += text['@EIdType'] + ' ' + text['#'] + ' ';
      })

      if (elocationID === undefined) return "elocationId undefined"

      console.log('elocationID:',elocationID);

      return elocationID;
    }

    return 'Não existe DOI';
    })

    const keyWords = computed(() => {
      if (props.article.KeywordList) {

        if (!Array.isArray(props.article.KeywordList.Keyword)) return props.article.KeywordList.Keyword['#'];

        const keywordsString = props.article.KeywordList.Keyword.map(keyword => keyword['#']).join(', ');
        return keywordsString;
      }
      return 'Não existe Palavra-chave'
    })

    const wordCloudText = computed(() => {
      return [articleTitle.value, abstractText.value, keyWords.value].join(' ');
    })

    return {
      articleTitle,
      abstractText,
      elocationID,
      keyWords,
      wordCloudText
    }
  },
});
</script>

<style scoped>

</style>
