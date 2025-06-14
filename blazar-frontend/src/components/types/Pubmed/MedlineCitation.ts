import Article from 'components/types/Pubmed/Article';
export default interface MedlineCitation {
  MedlineCitation: {
    PMID: number,
      DateCompleted: {
      Year: number,
        Month: number,
        Day: number
    },
    DateRevised: {
      Year: number,
        Month: number,
        Day: number
    },
    Article: Article,
    MedlineJournalInfo: {
      Country: string,
        MedlineTA: string,
        NlmUniqueID: number,
        ISSNLinking: string
    },
    ChemicalList: {
      Chemical: [
        {
          RegistryNumber: string,
          NameOfSubstance: string
        },
      ]
    },
    CitationSubset: string,
      MeshHeadingList: {
      MeshHeading: [
        {
          DescriptorName: string
        },
        {
          DescriptorName: string,
          QualifierName: [
            string,
            string,
            string
          ]
        },
      ]
    },
    CoiStatement: string
  }
  // PubmedData: {
  //   History: {
  //     PubMedPubDate: [
  //       {
  //         Year: number,
  //         Month: number,
  //         Day: number,
  //         Hour: number,
  //         Minute: number
  //       }
  //     ]
  //   },
  //   PublicationStatus: string,
  //     ArticleIdList: {
  //     ArticleId: [
  //       string
  //     ]
  //   },
  //   ReferenceList: {
  //     Reference: [
  //       {
  //         Citation: string,
  //         ArticleIdList: {
  //           ArticleId: [
  //             string
  //           ]
  //         }
  //       },
  //
  //     ]
  //   }
  // }
}
