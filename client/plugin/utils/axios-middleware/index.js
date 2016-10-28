import axiosMiddleware from 'redux-axios-middleware';
import axiosClient from 'utils/axios-client';
import { accessTokenInterceptor } from 'utils/axios-interceptors';

const axiosOptions = {
  interceptors: {
    request: [accessTokenInterceptor]
  }
}

export default axiosMiddleware(axiosClient, axiosOptions);
