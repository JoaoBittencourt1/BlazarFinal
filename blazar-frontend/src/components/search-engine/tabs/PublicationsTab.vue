<template>
  <div v-if="articleDataLoaded">
    <div v-if="isDataLoaded">
      <div>
        <Line :data="lineChartData" :options="lineChartOptions" />
      </div>
      <div>
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
    </div>
    <div v-if="!isNotFound">
    <publication-card v-for="(item, index) in publicationArticles" :key="index" :article="item.MedlineCitation" />
    </div> 
    <div v-else>
      <not-found-information></not-found-information>
    </div> 
  </div>
</template>

<script lang="ts">
import type { Ref } from 'vue';
import { defineComponent, ref } from 'vue';
import PublicationCard from 'components/search-engine/tabs/publications/PublicationCard.vue';
import { fromXML } from 'from-xml';
import ESearchResult from 'components/types/Pubmed/ESearchResult';
import EFetchResult from 'components/types/Pubmed/EFetchResult';
import Article from 'components/types/Pubmed/MedlineCitation';
import MedlineCitation from 'components/types/Pubmed/MedlineCitation';
import {Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,  PointElement,  LineElement,} from 'chart.js'
import { Bar, Line } from 'vue-chartjs'
import NotFoundInformation from './molecules/NotFoundInformation.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default defineComponent({
  name: 'PublicationsTab',
  props: {
    searchTerm: {
      type: Array<string>,
        required: true
      }
  },
  // eslint-disable-next-line vue/no-reserved-component-names
  components: { PublicationCard, Bar, Line, NotFoundInformation },
  /**
   * Passsos para a aPI
   * 1 - Construir a URL da chamada da API 1 (pubmed esearch) baseado nos termos de pesquisa
   * transformando o array de termos em uma string, ex: ['berberina', 'aspirina'] => 'berberina and aspirina'
   *
   * 2 - Consultar a API do pubmed esearch com os termos construídos no passo
   * anterior: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=berberina and aspirina
   *
   * 3 - Com o resultado da consulta da api do esearch (passo 2), constsruir a query string da API do pubmed efetch
   * ex: db=pubmed&id=${id} => db=pubmed&id=35794102,35660350,33073124,32001311,31926919,30391673
   *
   * 4 - Salvar o resultado da consulta da api 2 (efetch) em uma variável e exibir os valores no template
   *
   * 5 - Utilizar os valores salvos no passo anterior e salvar no dynamoDB na tabela 'publications' (ver exemplo na api do pubchem)
   *
   *
   * Exemplo de ID's retornados para berberina e aspirina na API 2 (efetch)
   * 35794102,35660350,33073124,32001311,31926919,30391673
   *
   * */
  setup (props) {
    const PUBMED_API_BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';
    let publicationsID : Array<string> = [];
    // let publicationArticles: Array<Article> = [];
    let publicationArticles = ref<Article[]>();
    let pubmedApiError = ref('');
    //const journalCount: { journalAbreviation: string; count: number }[] = [{journalAbreviation: "", count: 0}];
    const journalCount: Ref<{ journalAbreviation: string; count: number }[]> = ref([{ journalAbreviation: "", count: 0 }]);
    const barChartLabelArray: Array<string> = [];
    const barChartDataArray: Array<number> = [];
    const publicationYearsCount: {year: string, count: number}[] = [];
    const lineChartDataArray: Array<number> = [];
    const lineChartLabelArray: Array<string> = []
    const isDataLoaded = ref(false);
    const articleDataLoaded = ref(false);
    const isIdEmpty = ref(false);
    const isNotFound = ref(false);


    async function delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function processSearchTerms() {
      for (const term of props.searchTerm) {
        const termArray = [term];
        await callPubmedEsearchApi(termArray);
        if (!isIdEmpty.value) {
          await callPubmedEfetchApi();
          await delay(50);
        }
      }
      if (publicationArticles.value) {
        prepareArticlesToCharts(publicationArticles.value);
      } else isNotFound.value = true;
      articleDataLoaded.value = true;      
    }

    processSearchTerms();

    function buildQueryStringParams(searchTerm: Array<number|string>, glue: string): string {
      if (!Array.isArray(searchTerm)) return searchTerm;

      return searchTerm.join(glue);
    }

    function buildPubmedQueryString(params: Array<number|string>, paramName: string, paramsGlue:  string, URLPortion: string): string {
      const searchParamsString = buildQueryStringParams(params, paramsGlue);
      const searchParams: URLSearchParams = new URLSearchParams(paramName);
      searchParams.set(paramName, searchParamsString);
      searchParams.set('db', 'pubmed');
      return `${URLPortion}?db=pubmed&${searchParams.toString()}`;
    }

    async function callPubmedEsearchApi(term: Array<number|string>) {      
      const pubmedQueryString : string = buildPubmedQueryString(term, 'term', ' ', 'esearch.fcgi');
      const pubmedURL: URL = new URL(pubmedQueryString, PUBMED_API_BASE_URL);

      return fetch(pubmedURL)
        .then(response => response.text())
        .then(objectResponse => fromXML(objectResponse))
        .then(async (result) => {
          const pubmedResult = await result as ESearchResult;
          
          if(pubmedResult.eSearchResult.Count > 0) {
            publicationsID = pubmedResult.eSearchResult.IdList.Id;
            isIdEmpty.value = false;
          } 

          if (pubmedResult.eSearchResult.hasOwnProperty('ErrorList') && pubmedResult?.eSearchResult?.ErrorList?.PhraseNotFound) {
            isIdEmpty.value = true;
            return
          } 

          if (pubmedResult.eSearchResult.hasOwnProperty('ErrorList')) {
            console.log('deu erro na consulta do esearch');
            throw new Error(pubmedResult.eSearchResult.WarningList?.OutputMessage)
          }
        })
        .catch((errorMessage) => {
          pubmedApiError.value = errorMessage;
        })
        .finally(() => {
          return publicationsID;
        })
    }

    async function callPubmedEfetchApi(): Promise<void> {      
      const pubmedQueryString: string = buildPubmedQueryString(publicationsID, 'id', ',', 'efetch.fcgi');
      const pubmedURLID: URL = new URL(pubmedQueryString, PUBMED_API_BASE_URL);

      try {
        const response = await fetch(pubmedURLID);
        const objectResponse = await response.text();
        const result = await fromXML(objectResponse);
      
        if (result && result.PubmedArticleSet && result.PubmedArticleSet.PubmedArticle) {
          if (Array.isArray(result.PubmedArticleSet.PubmedArticle)) {
            publicationArticles.value = [
              ...(publicationArticles.value || []), 
              ...result.PubmedArticleSet.PubmedArticle
            ];          
          } else {
              const individualArticle = [result.PubmedArticleSet.PubmedArticle];
              publicationArticles.value = [
                ...(publicationArticles.value || []), 
                ...individualArticle
              ];  
          }
        } else {
          console.log('Unexpected structure:', result);
        }
      } catch (error) {
        console.log('Error fetching or processing data:', error);
      }
    }

    const fakeDataYears = ['2018','2018','2018','2020','2020','2021','2022','2022','2022','2022','2022','2022','2022','2023']

    fakeDataYears.forEach(year => {
      countArticleByYear(year);
    })

    function prepareArticlesToCharts(articleArray: Article[] | undefined) {
      if (articleArray) {        
        articleArray.forEach((article: any) => {
          if (article.MedlineCitation.Article.ArticleDate) {
            const articleYear = article.MedlineCitation.Article.ArticleDate.Year
           // countArticleByYear(articleYear);
          }
          countArticleByJournal(article);
        });

        publicationYearsCount.forEach((year: {year : string, count: number}) => {
          lineChartLabelArray.push(year.year);
          lineChartDataArray.push(year.count);
        })
        
        const top5Journals = journalCount.value.slice(0, 5);
      
        top5Journals.forEach(journal => {
          barChartDataArray.push(journal.count);
          barChartLabelArray.push(journal.journalAbreviation);
        })

        isDataLoaded.value = true;
      }
    }

    function countArticleByYear(articleYear: string) {

        const existingPublicationYear = publicationYearsCount.find((data: {year: string, count: number}) => data.year === articleYear);
        if (existingPublicationYear) {
          existingPublicationYear.count++;
        } else {
          publicationYearsCount.push({ year: articleYear, count: 1});
        }

        publicationYearsCount.sort((a: {year: string, count: number}, b: {year: string, count: number}) => parseInt(a.year) - parseInt(b.year));                
    }

    function countArticleByJournal(article: any) {
      const journalAbreviation = article.MedlineCitation.Article.Journal.ISOAbbreviation;

          const existingJournal = journalCount.value.find((journal) => journal.journalAbreviation === journalAbreviation);
          if (existingJournal) {
            existingJournal.count++;
          } else {
            const newJournal = {
              journalAbreviation: journalAbreviation,
              count: 1,
            };
            journalCount.value.push(newJournal);
          }

          journalCount.value.sort((a, b) => b.count - a.count);
    }

    const barChartData = {
      labels: barChartLabelArray,
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: barChartDataArray
        }
      ]
    }

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }

    const lineChartData = {
        labels: lineChartLabelArray,
        datasets: [
          {
            label: 'Data de Aplicação',
            backgroundColor: '#836FFF',
            data: lineChartDataArray
          }
        ]
      }
      const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false
      }

    return {
      pubmedApiError,
      publicationArticles,
      barChartData,
      barChartOptions,
      lineChartData,
      lineChartOptions,
      isDataLoaded,
      articleDataLoaded,
      isIdEmpty,
      isNotFound
    }
  }

})
</script>

<style scoped>

</style>
