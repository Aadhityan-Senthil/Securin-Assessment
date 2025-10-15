"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { FaStar } from 'react-icons/fa';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

interface Recipe {
  id: number;
  title: string;
  cuisine?: string | null;
  rating?: number | null;
  prep_time?: number | null;
  cook_time?: number | null;
  total_time?: number | null;
  description?: string | null;
  nutrients?: Record<string, any> | null;
  serves?: string | null;
}

interface PageResp {
  page: number;
  limit: number;
  total: number;
  data: Recipe[];
}

const ratingStars = (value?: number | null) => {
  if (value == null) return <span>-</span>;
  const fullStars = Math.floor(value);
  const half = value - fullStars >= 0.5;
  const stars = [] as React.ReactNode[];
  for (let i = 0; i < 5; i++) {
    const active = i < fullStars || (i === fullStars && half);
    stars.push(
      <FaStar key={i} className="rating" style={{ opacity: i < value ? 1 : 0.25 }} />
    );
  }
  return <div style={{ display: 'flex', gap: 2 }}>{stars}</div>;
};

function useRecipes() {
  const [data, setData] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  // field filters
  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [rating, setRating] = useState(''); // operators: >=4.5, <=3
  const [totalTime, setTotalTime] = useState(''); // operators too
  const [calories, setCalories] = useState(''); // operators too

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set('page', String(page));
    p.set('limit', String(limit));
    if (title.trim()) p.set('title', title.trim());
    if (cuisine.trim()) p.set('cuisine', cuisine.trim());
    if (rating.trim()) p.set('rating', rating.trim());
    if (totalTime.trim()) p.set('total_time', totalTime.trim());
    if (calories.trim()) p.set('calories', calories.trim());
    return p.toString();
  }, [page, limit, title, cuisine, rating, totalTime, calories]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true); setError(null);
      try {
        const endpoint = (title || cuisine || rating || totalTime || calories)
          ? `/api/recipes/search?${query}`
          : `/api/recipes?${query}`;
        const res = await fetch(`${API_BASE}${endpoint}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: PageResp = await res.json();
        setData(json.data || []);
        setTotal(json.total || 0);
      } catch (e: any) {
        if (e.name !== 'AbortError') setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [query, title, cuisine, rating, totalTime, calories]);

  return {
    data, total, loading, error,
    page, setPage, limit, setLimit,
    title, setTitle, cuisine, setCuisine, rating, setRating,
    totalTime, setTotalTime, calories, setCalories,
  };
}

export default function Page() {
  const {
    data, total, loading, error,
    page, setPage, limit, setLimit,
    title, setTitle, cuisine, setCuisine, rating, setRating,
    totalTime, setTotalTime, calories, setCalories,
  } = useRecipes();

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Recipe | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  function onRowClick(r: Recipe) {
    setActive(r);
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
    setActive(null);
  }

  const pageSizes = [15, 20, 25, 30, 40, 50];

  return (
    <>
      <div className="controls">
        <input className="input" placeholder="Filter title (e.g., pie)" value={title} onChange={e => { setTitle(e.target.value); setPage(1); }} />
        <input className="input" placeholder="Filter cuisine" value={cuisine} onChange={e => { setCuisine(e.target.value); setPage(1); }} />
        <input className="input" placeholder="Rating (e.g., >=4.5)" value={rating} onChange={e => { setRating(e.target.value); setPage(1); }} />
        <input className="input" placeholder="Total time (e.g., <=60)" value={totalTime} onChange={e => { setTotalTime(e.target.value); setPage(1); }} />
        <input className="input" placeholder="Calories (e.g., <=400)" value={calories} onChange={e => { setCalories(e.target.value); setPage(1); }} />
        <select className="select" value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}>
          {pageSizes.map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>

      {loading && <div className="empty">Loading…</div>}
      {error && <div className="empty">Error: {error}</div>}
      {!loading && !error && data.length === 0 && (
        <div className="empty">No results found.</div>
      )}

      {!loading && !error && data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Cuisine</th>
              <th>Rating</th>
              <th>Total Time</th>
              <th>Serves</th>
            </tr>
          </thead>
          <tbody>
            {data.map(r => (
              <tr className="row" key={r.id} onClick={() => onRowClick(r)}>
                <td className="truncate" title={r.title}>{r.title}</td>
                <td>{r.cuisine || '-'}</td>
                <td>{ratingStars(r.rating)}</td>
                <td>{r.total_time ?? '-'}</td>
                <td>{r.serves || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button className="button secondary" disabled={page <= 1} onClick={() => setPage(1)}>{'<<'}</button>
        <button className="button" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button className="button" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
        <button className="button secondary" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>{'>>'}</button>
      </div>

      <div className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <div>
            <div style={{ fontWeight: 700 }}>{active?.title}</div>
            <div style={{ color: '#9aa4b2' }}>{active?.cuisine}</div>
          </div>
          <button className="button" onClick={closeDrawer}>Close</button>
        </div>

        {active && (
          <>
            <div className="kv">
              <div className="label">Description</div>
              <div>{active.description || '-'}</div>
            </div>

            <div className="kv" style={{ marginTop: 8 }}>
              <div className="label">Total Time</div>
              <div>
                {active.total_time ?? '-'}
                <details style={{ marginTop: 6 }}>
                  <summary style={{ cursor: 'pointer' }}>Expand</summary>
                  <div style={{ marginTop: 6 }}>
                    <div>Cook Time: {active.cook_time ?? '-'}</div>
                    <div>Prep Time: {active.prep_time ?? '-'}</div>
                  </div>
                </details>
              </div>
            </div>

            <div className="nutrition">
              <h3>Nutrition</h3>
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const n = active.nutrients || {} as Record<string, any>;
                    const keys = [
                      'calories','carbohydrateContent','cholesterolContent','fiberContent',
                      'proteinContent','saturatedFatContent','sodiumContent','sugarContent','fatContent'
                    ];
                    return keys.map(k => (
                      <tr key={k}>
                        <td>{k}</td>
                        <td>{n[k] ?? '-'}</td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
