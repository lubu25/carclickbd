import { baseApi } from "./baseApi";

export interface AuctionLookupData {
  found: boolean;
  report: any[];
  exactMatches: any[];
  allMatches: any[];
  matchCount: number;
  exactMatchCount: number;
  download_available: boolean;
  firstKey: string;
  chassis: string;
}

export const auctionSheetApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAuctionSheetReport: build.query<{ data: AuctionLookupData }, string>({
      queryFn: async (chassis: string): Promise<{ data?: { data: AuctionLookupData }; error?: any }> => {
        try {
          const response = await fetch(`/api/jpcenter?chassis=${encodeURIComponent(chassis)}`);
          if (!response.ok) {
            const errorText = await response.text();
            if (errorText.includes('support@ajes.com') || errorText.includes('allow_ip_ai')) {
              return { error: { status: 'IP_BLOCKED', message: 'আপনার IP Address টি JPCenter থেকে ব্লক করা হয়েছে। দয়া করে support@ajes.com এ ইমেইল করে আপনার IP আনব্লক করুন, অথবা অন্য নেটওয়ার্ক বা সার্ভার ব্যবহার করুন।' } };
            }
            return { error: { status: response.status, data: errorText } };
          }

          const responseText = await response.text();

          // If JSON response from our upgraded API
          if (responseText.trim().startsWith('{')) {
            try {
              const json = JSON.parse(responseText);
              if (json.data) {
                return {
                  data: {
                    data: {
                      found: Boolean(json.data.found),
                      report: json.data.report || [],
                      exactMatches: json.data.exactMatches || [],
                      allMatches: json.data.allMatches || [],
                      matchCount: json.data.matchCount || 0,
                      exactMatchCount: json.data.exactMatchCount || 0,
                      download_available: json.data.download_available ?? (json.data.report?.length > 0),
                      firstKey: json.data.firstKey || '',
                      chassis: json.data.chassis || chassis,
                    },
                  },
                };
              }
            } catch (e) {
              console.error("Failed to parse JSON response:", e);
            }
          }

          // Fallback to XML parsing
          const xmlText = responseText.replace(/&(?!amp;|lt;|gt;|apos;|quot;)/g, '&amp;');
          if (typeof window !== "undefined" && window.DOMParser) {
            const parser = new window.DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");
            
            const notFoundNode = xmlDoc.querySelector("error");
            if (notFoundNode && notFoundNode.textContent?.includes("not found")) {
              return {
                data: {
                  data: {
                    found: false,
                    report: [],
                    exactMatches: [],
                    allMatches: [],
                    matchCount: 0,
                    exactMatchCount: 0,
                    download_available: false,
                    firstKey: '',
                    chassis,
                  },
                },
              };
            }
            
            const rowNodes = xmlDoc.querySelectorAll("row");
            const rows = Array.from(rowNodes).map(row => {
              const obj: any = {};
              Array.from(row.children).forEach(child => {
                const tag = child.tagName.toLowerCase();
                const value = child.textContent;
                
                if (tag === 'car_model') obj.model = value;
                else if (tag === 'car_maker') { obj.maker = value; obj.brand = value; }
                else if (tag === 'car_year') obj.year = value;
                else if (tag === 'car_color') obj.color = value;
                else if (tag === 'car_grade') obj.grade = value;
                else if (tag === 'car_displacement') { obj.displacement = value; obj.engineCc = value; }
                else if (tag === 'car_transmission') obj.transmission = value;
                else if (tag === 'car_options') { obj.options = value; obj.equipment = value; }
                else if (tag === 'car_result') { obj.result = value; obj.status = value; }
                else if (tag === 'image') obj.image = value;
                else if (tag === 'color') obj.colorTag = value;
                else {
                  obj[tag] = value;
                }
              });
              return obj;
            });

            const exact = rows.filter(r => r.colorTag === '3');
            const primary = exact.length > 0 ? exact : rows;
            
            return { 
              data: {
                data: {
                  found: primary.length > 0, 
                  report: primary, 
                  exactMatches: exact,
                  allMatches: rows,
                  matchCount: primary.length,
                  exactMatchCount: exact.length,
                  download_available: primary.length > 0,
                  firstKey: primary[0]?.key || '',
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
    getFullTrueReport: build.query({
      queryFn: async (
        arg: { chassis: string; key?: string },
        _queryApi,
        _extraOptions,
        _fetchWithBQ
      ) => {
        try {
          const { chassis, key } = arg;
          const url = `/api/jpcenter?chassis=${encodeURIComponent(
            chassis
          )}&full=true${key ? `&key=${encodeURIComponent(key)}` : ""}`;
          const response = await fetch(url);
          if (!response.ok) {
            const err = await response.text();
            return { error: { status: response.status, data: err } };
          }
          const json = await response.json();
          if (json.success && json.data) {
            return { data: json.data };
          }
          return { error: { status: "EMPTY_DATA", message: "No report returned" } };
        } catch (error: any) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
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
  useGetFullTrueReportQuery,
  useLazyGetFullTrueReportQuery,
} = auctionSheetApi;

export default auctionSheetApi;

