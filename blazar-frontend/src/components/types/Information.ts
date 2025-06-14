// information?.Value?.StringWithMarkup informationValue
export default interface Information {
  Value: {
    StringWithMarkup: [
      {
        String: string;
      }
    ];
    ExternalTableName?: string;
  };
}
