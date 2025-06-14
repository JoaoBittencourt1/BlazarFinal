import AbstractTextItem from "./AbstractTextItem"
import ArticleTitleObject from "./ArticleTitleObject"
import ElocationIDObject from "./ElocationIDObject"

export default interface Article {
  KeywordList: {
    '@Owner': string,
    Keyword: [{
      '@MajorTopicYN': string,
      '#': string
    }]
  },
  Article: {
    Journal: {
      ISSN: string,
      JournalIssue: {
        Volume: number,
        Issue: number,
        PubDate: {
          Year: number,
          Month: string,
          Day: number
        }
      },
      Title: string,
      ISOAbbreviation: string
    },
    ArticleTitle: string | {'#': [string]},
    Pagination: {
      StartPage: number,
      MedlinePgn: number
    },
    ELocationID?: string | [ElocationIDObject]
    ,
    Abstract: {
      AbstractText: string | AbstractTextItem,
      CopyrightInformation: string
    },
    AuthorList: {
      Author: [
        {
          LastName: string,
          ForeName: string,
          Initials: string,
          AffiliationInfo: {
            Affiliation: string
          }
        },
      ]
    },
    Language: string,
    PublicationTypeList: {
      PublicationType: [
        string,
        string
      ]
    },
    ArticleDate: {
      Year: number,
      Month: number,
      Day: number
    }
  }
}
