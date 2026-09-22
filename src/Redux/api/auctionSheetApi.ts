import { baseApi } from "./baseApi";

export const auctionSheetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuctionSheetReport: build.query({
      queryFn: async (chassis: string, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const response = await fetch(`/api/jpcenter?chassis=${encodeURIComponent(chassis)}`);
          if (!response.ok) {
            return { error: { status: response.status, data: await response.text() } };
          }
          const xmlText = await response.text();
          
          if (typeof window !== "undefined" && window.DOMParser) {
            const parser = new window.DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            
            const errorNode = xmlDoc.querySelector("error");
            if (errorNode && errorNode.textContent === "not found") {
              return { data: { data: { found: false } } };
            }
            
            const rowNodes = xmlDoc.querySelectorAll("row");
            const rows = Array.from(rowNodes).map(row => {
              const obj: any = {};
              Array.from(row.children).forEach(child => {
                obj[child.tagName] = child.textContent;
              });
              return obj;
            });
            
            return { 
              data: {
                data: {
                  found: rows.length > 0, 
                  report: rows, 
                  download_available: rows.length > 0,
                  chassis 
                }
              } 
            };
          } else {
             return { error: { status: 'PARSER_ERROR', error: 'DOMParser is not available' } };
          }
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
    }),
    createAuctionSheetOrder: build.mutation({
      query: (data: Record<string, any>) => ({
        url: "/auction-sheet/order",
        method: "POST",
        data,
        timeout: 90000,
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useCreateAuctionSheetOrderMutation,
  useLazyGetAuctionSheetReportQuery,
} = auctionSheetApi;

export default auctionSheetApi;
