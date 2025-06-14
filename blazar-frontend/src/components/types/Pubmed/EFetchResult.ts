import Article from 'components/types/Pubmed/MedlineCitation';
export default interface EFetchResul {
    PubmedArticleSet: {
        PubmedArticle: [
          Article: Article
        ]
      }
}
