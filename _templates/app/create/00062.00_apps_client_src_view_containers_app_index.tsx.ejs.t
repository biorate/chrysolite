---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/containers/app/index.tsx`) %>
unless_exists: true
---
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { inject, Types } from '@biorate/inversion';
import { observer } from 'mobx-react';
import { Preloader, Spinner as SpinnerStore } from '../../../store';
import { Spinner, Slot } from '../../components';
import { Layout } from '../../containers';
import { SLOTS } from '../../consts';
import { router } from '../../../router';
import './index.less';

@observer
export class App extends React.Component<unknown, unknown> {
  @inject(Types.Preloader) protected preloader: Preloader;

  @inject(Types.Spinner) protected spinner: SpinnerStore;

  public render() {
    return (
      <>
        <Spinner visible={this.spinner.visible || !this.preloader.loaded} />
        {this.preloader.loaded ? (
          <Layout>
            <Slot name={SLOTS.HEADER}></Slot>
            <Slot name={SLOTS.CONTENT}>
              <RouterProvider router={router} />
            </Slot>
            <Slot name={SLOTS.FOOTER}></Slot>
          </Layout>
        ) : null}
      </>
    );
  }
}
