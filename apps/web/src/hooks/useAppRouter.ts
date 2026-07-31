import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  tab: string;
  payload?: any;
  searchQuery?: string;
  filterState?: any;
  activeSubTab?: string;
}

export function useAppRouter() {
  const parseUrl = useCallback((): RouteState => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get('q') || '';
    const filter = searchParams.get('filter') || '';
    const subTab = searchParams.get('subTab') || 'overview';

    // Deep-link pattern matching
    if (path.startsWith('/gl/accounts/')) {
      const code = path.replace('/gl/accounts/', '');
      return { tab: 'chart-accounts', payload: { accountCode: code }, searchQuery: search, filterState: filter, activeSubTab: subTab };
    }
    if (path === '/gl/accounts') {
      return { tab: 'chart-accounts', searchQuery: search, filterState: filter };
    }
    if (path.startsWith('/gl/journals/')) {
      const transNo = path.replace('/gl/journals/', '');
      return { tab: 'gl-journal', payload: { transNo }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/gl/journals') {
      return { tab: 'gl-journal', searchQuery: search };
    }
    if (path.startsWith('/customers/')) {
      const id = path.replace('/customers/', '');
      return { tab: 'customers', payload: { customerId: id }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/customers') {
      return { tab: 'customers', searchQuery: search };
    }
    if (path.startsWith('/suppliers/')) {
      const id = path.replace('/suppliers/', '');
      return { tab: 'suppliers', payload: { supplierId: id }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/suppliers') {
      return { tab: 'suppliers', searchQuery: search };
    }
    if (path.startsWith('/inventory/')) {
      const code = path.replace('/inventory/', '');
      return { tab: 'inventory', payload: { itemCode: code }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/inventory') {
      return { tab: 'inventory', searchQuery: search };
    }
    if (path.startsWith('/banking/')) {
      const code = path.replace('/banking/', '');
      return { tab: 'bank-trans', payload: { accountCode: code }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/banking') {
      return { tab: 'bank-trans', searchQuery: search };
    }
    if (path.startsWith('/sales/invoices/')) {
      const transNo = path.replace('/sales/invoices/', '');
      return { tab: 'sales-invoice', payload: { transNo }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/sales/invoices') {
      return { tab: 'sales-invoice', searchQuery: search };
    }
    if (path.startsWith('/sales/payments/')) {
      const transNo = path.replace('/sales/payments/', '');
      return { tab: 'customer-payment', payload: { transNo }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/sales/payments') {
      return { tab: 'customer-payment', searchQuery: search };
    }
    if (path.startsWith('/purchasing/bills/')) {
      const transNo = path.replace('/purchasing/bills/', '');
      return { tab: 'supplier-bill', payload: { transNo }, searchQuery: search, activeSubTab: subTab };
    }
    if (path === '/purchasing/bills') {
      return { tab: 'supplier-bill', searchQuery: search };
    }

    // Default tab map based on query param or pathname
    const routeTab = searchParams.get('tab');
    if (routeTab) {
      return { tab: routeTab, searchQuery: search, filterState: filter };
    }

    return { tab: 'dashboard' };
  }, []);

  const [routeState, setRouteState] = useState<RouteState>(parseUrl);

  const navigate = useCallback((tab: string, payload?: any, options?: { replace?: boolean; subTab?: string }) => {
    let url = '/';
    const params = new URLSearchParams();

    if (options?.subTab) {
      params.set('subTab', options.subTab);
    }

    // Build canonical URLs
    if (tab === 'chart-accounts') {
      url = payload?.accountCode ? `/gl/accounts/${payload.accountCode}` : '/gl/accounts';
    } else if (tab === 'gl-journal') {
      url = payload?.transNo ? `/gl/journals/${payload.transNo}` : '/gl/journals';
    } else if (tab === 'customers') {
      url = payload?.customerId ? `/customers/${payload.customerId}` : '/customers';
    } else if (tab === 'suppliers') {
      url = payload?.supplierId ? `/suppliers/${payload.supplierId}` : '/suppliers';
    } else if (tab === 'inventory') {
      url = payload?.itemCode ? `/inventory/${payload.itemCode}` : '/inventory';
    } else if (tab === 'bank-trans' || tab === 'banking') {
      url = payload?.accountCode ? `/banking/${payload.accountCode}` : '/banking';
    } else if (tab === 'sales-invoice') {
      url = payload?.transNo ? `/sales/invoices/${payload.transNo}` : '/sales/invoices';
    } else if (tab === 'customer-payment') {
      url = payload?.transNo ? `/sales/payments/${payload.transNo}` : '/sales/payments';
    } else if (tab === 'supplier-bill') {
      url = payload?.transNo ? `/purchasing/bills/${payload.transNo}` : '/purchasing/bills';
    } else {
      params.set('tab', tab);
    }

    const queryString = params.toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    if (options?.replace) {
      window.history.replaceState({ tab, payload, subTab: options?.subTab }, '', finalUrl);
    } else {
      window.history.pushState({ tab, payload, subTab: options?.subTab }, '', finalUrl);
    }

    setRouteState({ tab, payload, activeSubTab: options?.subTab });
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tab) {
        setRouteState({ tab: e.state.tab, payload: e.state.payload, activeSubTab: e.state.subTab });
      } else {
        setRouteState(parseUrl());
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [parseUrl]);

  return {
    currentTab: routeState.tab,
    tabPayload: routeState.payload,
    activeSubTab: routeState.activeSubTab,
    navigate,
    routeState
  };
}
