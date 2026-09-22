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
          const rawXmlText = await response.text();
          // Sanitize XML: replace unescaped '&' with '&amp;' to prevent DOMParser from failing
          const xmlText = rawXmlText.replace(/&(?!amp;|lt;|gt;|apos;|quot;)/g, '&amp;');
          
          if (typeof window !== "undefined" && window.DOMParser) {
            const parser = new window.DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            
            const errorNode = xmlDoc.querySelector("parsererror");
            if (errorNode) {
              console.error("XML Parsing Error:", errorNode.textContent);
              // Fallback or just continue to let it fail gracefully
            }
            
            const notFoundNode = xmlDoc.querySelector("error");
            if (notFoundNode && notFoundNode.textContent === "not found") {
              return { data: { data: { found: false, report: [], download_available: false, chassis } } };
            }
            
            const rowNodes = xmlDoc.querySelectorAll("row");
            const rows = Array.from(rowNodes).map(row => {
              const obj: any = {};
              Array.from(row.children).forEach(child => {
                const tag = child.tagName.toLowerCase();
                const value = child.textContent;
                
                // Map the specific fields to what the frontend expects
                if (tag === 'car_model') obj.model = value;
                else if (tag === 'car_year') obj.year = value;
                else if (tag === 'car_color') obj.color = value;
                else if (tag === 'car_grade') obj.grade = value;
                else if (tag === 'image') obj.image = value;
                else if (tag !== 'color') {
                  // Ignore the numeric <color> tag so it doesn't overwrite car_color
                  obj[tag] = value;
                }
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
