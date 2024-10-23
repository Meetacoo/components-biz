import React from 'react';
import { preset as fetchPreset } from '@kne/react-fetch';
import { Spin, Empty, message } from 'antd';
import axios from 'axios';
import { preset as remoteLoaderPreset } from '@kne/remote-loader';
import omit from 'lodash/omit';

window.PUBLIC_URL = window.runtimePublicUrl || process.env.PUBLIC_URL;
window.STATIC_BASE_URL = window.runtimeStaticBaseUrl || 'http://uc.dev.fatalent.cn';

export const globalInit = async () => {
  const ajax = (() => {
    const instance = axios.create({
      validateStatus: function () {
        return true;
      }
    });

    instance.interceptors.response.use(
      response => {
        if (response.status !== 200) {
          response.showError !== false && response.config.showError !== false && message.error(response?.data?.msg || '请求发生错误');
        }
        return response;
      },
      error => {
        message.error(error.message || '请求发生错误');
        return Promise.reject(error);
      }
    );

    return params => {
      if (params.hasOwnProperty('loader') && typeof params.loader === 'function') {
        return Promise.resolve(params.loader(omit(params, ['loader'])))
          .then(data => ({
            data: {
              code: 0,
              data
            }
          }))
          .catch(err => {
            message.error(err.message || '请求发生错误');
            return { data: { code: 500, msg: err.message } };
          });
      }

      return instance(params);
    };
  })();
  fetchPreset({
    ajax,
    loading: (
      <Spin
        delay={500}
        style={{
          position: 'absolute',
          left: '50%',
          padding: '10px',
          transform: 'translateX(-50%)'
        }}
      />
    ),
    error: null,
    empty: <Empty />,
    transformResponse: response => {
      const { data } = response;
      response.data = {
        code: data.code === 0 ? 200 : data.code,
        msg: data.msg,
        results: data.data
      };
      return response;
    }
  });
  const registry = {
    url: 'https://uc.fatalent.cn',
    tpl: '{{url}}/packages/@kne-components/{{remote}}/{{version}}/build'
  };

  const componentsCoreRemote = {
    ...registry,
    //url: 'http://localhost:3001',
    //tpl: '{{url}}',
    remote: 'components-core',
    defaultVersion: '0.2.55'
  };

  remoteLoaderPreset({
    remotes: {
      default: componentsCoreRemote,
      'components-core': componentsCoreRemote,
      'components-field': {
        ...registry,
        remote: 'components-field',
        defaultVersion: '0.1.2'
      },
      'components-iconfont': {
        ...registry,
        remote: 'components-iconfont',
        defaultVersion: '0.1.8'
      },
      'components-function': {
        remote: 'components-function',
        url: window.STATIC_BASE_URL,
        defaultVersion: '1.0.0'
      },
      'components-biz':
        process.env.NODE_ENV === 'development'
          ? {
              remote: 'components-biz',
              url: '/',
              tpl: '{{url}}'
            }
          : {
              ...registry,
              remote: 'components-biz',
              defaultVersion: process.env.DEFAULT_VERSION
            }
    }
  });

  return {
    ajax,
    themeToken: {
      colorPrimary: '#4F185A',
      colorPrimaryHover: '#702280'
    }
  };
};
