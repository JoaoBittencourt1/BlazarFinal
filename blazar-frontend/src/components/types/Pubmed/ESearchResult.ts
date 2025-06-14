export default interface ESearchResult {
  eSearchResult: {
    Count: number,
    RetMax: number,
    RetStart: number
    IdList: {
      Id: Array<string>
    },
    TranslationSet: {
      Translation?: {
        From: string,
        To: string,
      }
    },
    QueryTranslation: string,
    ErrorList?: {
      PhraseNotFound: string
    },
    WarningList? : {
      OutputMessage: string
    }
  }
}
