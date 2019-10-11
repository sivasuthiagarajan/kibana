/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { Fragment, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { EuiPageContent, EuiBasicTable, EuiSpacer } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { PageError } from '../../../components/page_error';
import { loadActions } from '../../../lib/api';
import { ActionsContext } from '../../../context/app_context';
import { useAppDependencies } from '../../../index';

interface ActionsListProps {
  api: any;
}

export const ActionsList: React.FunctionComponent<RouteComponentProps<ActionsListProps>> = ({
  match: {
    params: { api },
  },
  history,
}) => {
  const {
    core: { http },
  } = useAppDependencies();

  const [sortField, setSortField] = useState('actionTypeId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await loadActions(http, sortField, sortDirection);
        setData(response.data);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [sortField, sortDirection]);

  const actionsTableColumns = [
    {
      field: 'description',
      name: i18n.translate(
        'xpack.alertingUI.sections.actionsList.actionsListTable.descriptionHeader',
        {
          defaultMessage: 'Description',
        }
      ),
      sortable: false,
      truncateText: true,
    },
    {
      field: 'actionTypeId',
      name: i18n.translate(
        'xpack.alertingUI.sections.actionsList.actionsListTable.actionTypeIdHeader',
        {
          defaultMessage: 'Action Type',
        }
      ),
      sortable: true,
      truncateText: true,
    },
    {
      field: 'config',
      name: i18n.translate('xpack.alertingUI.sections.actionsList.actionsListTable.configHeader', {
        defaultMessage: 'Config',
      }),
      sortable: false,
      truncateText: false,
    },
  ];

  let content;

  if (error) {
    content = (
      <EuiPageContent>
        <PageError errorCode={error} />
      </EuiPageContent>
    );
  } else {
    content = (
      <Fragment>
        <EuiBasicTable
          loading={isLoading}
          items={data}
          itemId="id"
          columns={actionsTableColumns}
          rowProps={() => ({
            'data-test-subj': 'row',
          })}
          cellProps={() => ({
            'data-test-subj': 'cell',
          })}
          data-test-subj="actionsTable"
          sorting={{ sort: { field: sortField, direction: sortDirection } }}
          onChange={({ sort }: { sort: { field: string; direction: 'asc' | 'desc' } }) => {
            setSortField(sort.field);
            setSortDirection(sort.direction);
          }}
        />
      </Fragment>
    );
  }

  return (
    <section data-test-subj="actionsList">
      <ContentWrapper>
        <EuiSpacer size="m" />
        {content}
      </ContentWrapper>
    </section>
  );
};

export const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <EuiPageContent>
      <EuiSpacer size="s" />
      <ActionsContext.Provider value={{}}>{children}</ActionsContext.Provider>
    </EuiPageContent>
  );
};
