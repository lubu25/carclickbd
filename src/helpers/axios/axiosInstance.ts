import { authKey } from '@/constant/storegeKey';
import { getNewAccessToken, storeToken } from '@/service/auth.service';
import { removeFromLocalStorage } from '@/utils/local-storage';

import axios from 'axios';

const getCleanToken = (token?: string | null) => {
  if (!token || token === 'undefined' || token === 'null') return '';
  return token.startsWith('Bearer ') ? token.split(' ')[1] : token;
};

const isPublicAuctionSheetRequest = (config?: { url?: string }) => {
  const url = config?.url || '';
  return (
    url.includes('/auction-sheet') ||
    url.includes('/payment/bdgate/auction-sheet')
  );
};

const instance = axios.create();
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers['Accept'] = 'application/json';
instance.defaults.timeout = 90000;

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = getCleanToken(localStorage.getItem(authKey));
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // console.log(response);

    return response;
  },

  async function (error) {
    const config = error?.config;

    // Auction-sheet search and payment are public flows. A failed request in
    // this flow must not refresh or remove an unrelated signed-in user's token.
    if (
      error?.response?.status === 401 &&
      isPublicAuctionSheetRequest(config)
    ) {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      const accessToken = getCleanToken(await getNewAccessToken());
      if (!accessToken) {
        removeFromLocalStorage(authKey);
        return Promise.reject(error);
      }
      config.headers['Authorization'] = accessToken;
      storeToken({ accessToken });
      return instance(config);
    } else {
      // console.log(error);
      if (error?.response?.status === 401) {
        removeFromLocalStorage(authKey);
      }
      const hasServerResponse = Boolean(error?.response);
      const responseObject: any = {
        statusCode: error?.response?.status || 500,
        message: hasServerResponse
          ? 'Something went wrong'
          : error?.code === 'ECONNABORTED'
            ? 'The server is taking too long to respond. Please try again.'
            : error?.message || 'Network request failed',
        success: false,
        errorMessages: [],
      };
      // Check if the error response has the expected structure
      if (error?.response?.data) {
        responseObject.message =
          error?.response?.data?.message || responseObject.message;
        responseObject.success =
          error?.response?.data?.success || responseObject.success;

        if (error?.response?.data?.errorMessage) {
          responseObject.errorMessages.push(
            error?.response?.data?.errorMessage,
          );
        }
      }
      return Promise.reject(responseObject);
    }

    // return Promise.reject(error);
  },
);

export { instance };
