import algoliasearch from "algoliasearch/index";

export const algoliaClient = algoliasearch(
  process.env.APPLICATION_ID,
  process.env.ADMIN_API_KEY
);

export const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => (!params.query && params.filters.length == 0))) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};


export const client = algoliasearch(
  process.env.APPLICATION_ID,
  process.env.ADMIN_API_KEY_BROWSER
)
  // searchClient.listIndices().then((res) => console.log(res, "listIndices")); returns all indexes
export const algoliaIndex = algoliaClient.initIndex(process.env.ALGOLIA_INDEX);
export const algoliaIndexForBrowser = client.initIndex(process.env.ALGOLIA_INDEX);
// algoliaIndex.setSettings({
//   paginationLimitedTo: 999
// });
