import { useCallback, useEffect, useMemo, useState } from 'react';

const initialForm = {
  party: '',
  item: '',
  qty: '',
  unit: 'pcs',
  rate: '',
  remarks: ''
};

const statusLabels = {
  pending: 'Pending',
  dispatched: 'Dispatched',
  hold: 'On hold',
  return: 'Returned'
};

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${response.status}).`);
  }

  return response.json();
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
}

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const loadOrders = useCallback(async () => {
    setError('');
    try {
      setOrders(await request('/api/orders'));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const counts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    dispatched: orders.filter((order) => order.status === 'dispatched').length,
    hold: orders.filter((order) => order.status === 'hold').length
  }), [orders]);

  const visibleOrders = useMemo(
    () => filter === 'all' ? orders : orders.filter((order) => order.status === filter),
    [filter, orders]
  );

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function createOrder(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await request('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          qty: Number(form.qty),
          rate: Number(form.rate)
        })
      });
      setForm(initialForm);
      await loadOrders();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(order, status) {
    setError('');
    try {
      const updated = await request(`/api/orders/${order._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setOrders((current) => current.map((entry) => entry._id === updated._id ? updated : entry));
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  return (
    <>
      <section className="page-heading">
        <div>
          <p className="eyebrow">ORDER MANAGEMENT</p>
          <h1>Orders overview</h1>
          <p className="subheading">Track incoming orders and keep dispatch moving.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={loadOrders}>
          Refresh
        </button>
      </section>

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button type="button" aria-label="Dismiss error" onClick={() => setError('')}>×</button>
        </div>
      )}

      <section className="stat-grid" aria-label="Order summary">
        <StatCard label="Total orders" count={counts.all} tone="navy" />
        <StatCard label="Pending" count={counts.pending} tone="amber" />
        <StatCard label="Dispatched" count={counts.dispatched} tone="green" />
        <StatCard label="On hold" count={counts.hold} tone="red" />
      </section>

      <div className="content-grid">
        <section className="panel order-panel">
          <div className="panel-heading">
            <div>
              <h2>Order register</h2>
              <p>Review order details and update progress.</p>
            </div>
            <label className="filter-label">
              <span className="sr-only">Filter orders by status</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="all">All orders</option>
                <option value="pending">Pending</option>
                <option value="dispatched">Dispatched</option>
                <option value="hold">On hold</option>
                <option value="return">Returned</option>
              </select>
            </label>
          </div>

          {loading ? (
            <p className="empty-state">Loading orders…</p>
          ) : visibleOrders.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">▤</span>
              <strong>{filter === 'all' ? 'No orders yet' : `No ${statusLabels[filter]?.toLowerCase() || ''} orders`}</strong>
              <span>Add an order using the form to get started.</span>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Party / item</th>
                    <th>Quantity</th>
                    <th>Order date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <strong className="party-name">{order.party}</strong>
                        <span className="item-name">{order.item}</span>
                        {order.remarks && <span className="item-name">{order.remarks}</span>}
                      </td>
                      <td>{order.qty} <span className="muted">{order.unit}</span></td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <label>
                          <span className="sr-only">Status for {order.party}, {order.item}</span>
                          <select
                            className={`status-select status-${order.status}`}
                            value={order.status}
                            onChange={(event) => changeStatus(order, event.target.value)}
                          >
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <option key={value} value={value}>{label}</option>
                            ))}
                          </select>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h2>Add an order</h2>
              <p>Capture the order details below.</p>
            </div>
          </div>
          <form onSubmit={createOrder}>
            <label>
              Party name
              <input name="party" value={form.party} onChange={updateForm} maxLength="120" required />
            </label>
            <label>
              Item
              <input name="item" value={form.item} onChange={updateForm} maxLength="120" required />
            </label>
            <div className="form-row">
              <label>
                Quantity
                <input name="qty" type="number" min="0.01" step="any" value={form.qty} onChange={updateForm} required />
              </label>
              <label>
                Unit
                <input name="unit" value={form.unit} onChange={updateForm} maxLength="20" required />
              </label>
            </div>
            <label>
              Rate per unit
              <input name="rate" type="number" min="0" step="any" value={form.rate} onChange={updateForm} required />
            </label>
            <label>
              Remarks <span className="muted">(optional)</span>
              <textarea name="remarks" value={form.remarks} onChange={updateForm} maxLength="500" rows="3" />
            </label>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Add order'}
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

function StatCard({ label, count, tone }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span>{label}</span>
      <strong>{count}</strong>
    </article>
  );
}
