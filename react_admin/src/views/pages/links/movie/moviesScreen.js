import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch, faTimes, faSlidersH, faHistory } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';
import Select from 'react-select';

import movieActions, { countActiveFilters, hasSearchCriteria, MIN_SEARCH_LENGTH, MOVIES_PAGE_SIZE } from 'src/actions/links/movieActions';
import movieCategoryActions from 'src/actions/links/movieCategoryActions';
import languageActions from 'src/actions/links/languageActions';
import actorActions from 'src/actions/links/actorActions';
import FilterPill from './filters/FilterPill';
import MoreFilters from './filters/MoreFilters';
import MovieFormModal from './MovieFormModal';
import './moviesScreen.scss';

const SEARCH_DEBOUNCE_MS = 350;
const RECENT_KEY = 'movies.recentSearches';
const RECENT_MAX = 5;

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pendiente', className: 'is-warn' },
    { value: 'converting', label: 'Convirtiendo', className: 'is-info' },
    { value: 'ready', label: 'Listo', className: 'is-ok' },
];

const ORDER_OPTIONS = [
    { value: 'recent', label: 'Más recientes' },
    { value: 'description', label: 'Título (A-Z)' },
    { value: 'ranking', label: 'Mejor ranking' },
];

const selectStyles = {
    menu: base => ({ ...base, position: 'static', boxShadow: 'none', marginTop: 8, marginBottom: 0 }),
    menuList: base => ({ ...base, maxHeight: 260 }),
};

// Historial de búsquedas (solo comodidad local; si falla el storage se ignora)
const loadRecent = () => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; } catch (e) { return []; }
};
const storeRecent = list => {
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (e) { /* sin storage */ }
};

const daysAgo = days => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
};

// Resalta el término buscado ignorando mayúsculas y acentos
const fold = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const Highlight = ({ text = '', term }) => {
    const t = fold(term.trim());
    if (t.length < MIN_SEARCH_LENGTH) return text;
    const folded = fold(text);
    const index = folded.indexOf(t);
    if (index < 0 || folded.length !== text.length) return text;
    return (
        <>
            {text.slice(0, index)}
            <mark>{text.slice(index, index + t.length)}</mark>
            {text.slice(index + t.length)}
        </>
    );
};

const Stars = ({ value }) => (
    <span className="mf-stars" role="img" aria-label={`${value} de 5`}>
        {[1, 2, 3, 4, 5].map(n => <span key={n} className={n <= value ? '' : 'is-off'}>★</span>)}
    </span>
);

const statusBadges = row => {
    const badges = [];
    if (row.pending === 1) badges.push(STATUS_OPTIONS[0]);
    if (row.converting === 1) badges.push(STATUS_OPTIONS[1]);
    return badges.length ? badges : [STATUS_OPTIONS[2]];
};

function MoviesScreen() {
    const dispatch = useDispatch();
    // /movie/new y /movie/:id abren el formulario en un modal sobre la lista
    const formMatch = useRouteMatch('/movie/:id');
    const { movies, totalRecords, loading, filter } = useSelector(state => state.movie);
    const categories = useSelector(state => state.movieCategory.movieCategories);
    const languages = useSelector(state => state.language.languages);
    const actors = useSelector(state => state.actor.actors);

    const categoryOptions = useMemo(() => categories.map(r => ({ value: r.id, label: r.description })), [categories]);
    const languageOptions = useMemo(() => languages.map(r => ({ value: r.id, label: r.description })), [languages]);
    const actorOptions = useMemo(() => actors.map(r => ({ value: r.id, label: r.name })), [actors]);

    const [searchText, setSearchText] = useState(filter.search);
    const [recent, setRecent] = useState(loadRecent);
    const searchRef = useRef(null);

    useEffect(() => {
        dispatch(movieCategoryActions.getMovieCategories());
        dispatch(languageActions.getLanguages());
        dispatch(actorActions.getActors());
        dispatch(movieActions.applyFilter());
    }, [dispatch]);

    // Busca cuando se deja de escribir
    useEffect(() => {
        if (searchText === filter.search) return;
        const timer = setTimeout(() => dispatch(movieActions.setFilter({ search: searchText })), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [searchText, filter.search, dispatch]);

    // Atajo "/" para enfocar el buscador
    useEffect(() => {
        const onKeyDown = e => {
            const el = document.activeElement;
            const typing = el && (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable);
            const modalOpen = !!document.querySelector('.mfm-backdrop');
            if (e.key === '/' && !typing && !modalOpen) {
                e.preventDefault();
                searchRef.current && searchRef.current.focus();
            }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, []);

    const setFilter = changes => dispatch(movieActions.setFilter(changes));

    const rememberSearch = () => {
        const term = filter.search.trim();
        if (term.length < MIN_SEARCH_LENGTH) return;
        const next = [term, ...recent.filter(r => r.toLowerCase() !== term.toLowerCase())].slice(0, RECENT_MAX);
        setRecent(next);
        storeRecent(next);
    };

    const runSearch = term => {
        setSearchText(term);
        setFilter({ search: term });
    };

    const onSearchKeyDown = e => {
        if (e.key === 'Enter') {
            if (searchText !== filter.search) setFilter({ search: searchText });
            rememberSearch();
        }
        if (e.key === 'Escape' && searchText) runSearch('');
    };

    const clearAll = () => {
        setSearchText('');
        dispatch(movieActions.clearFilters());
    };

    const addMovie = () => dispatch(push('/movie/new'));

    const editMovie = movie => {
        rememberSearch();
        dispatch(movieActions.editMovie(movie));
        dispatch(push(`/movie/${movie.id}`));
    };

    const closeForm = () => dispatch(push('/movies'));

    const deleteMovie = async movie => {
        const result = await Swal.fire({
            title: '¿Desea borrar el registro?',
            text: `Esta apunto de borrar el registro ${movie.description}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Borrar',
        });
        if (result.isConfirmed) dispatch(movieActions.deleteMovie(movie));
    };

    const hasCriteria = hasSearchCriteria(filter);
    const activeCount = countActiveFilters(filter);
    const moreCount = [filter.rankingMin > 0, filter.subtitle, filter.old, filter.dateFrom || filter.dateTo].filter(Boolean).length;
    const statusOption = STATUS_OPTIONS.find(o => o.value === filter.status);
    const searchTerm = filter.search.trim();
    const typedTooShort = searchText.trim().length > 0 && searchText.trim().length < MIN_SEARCH_LENGTH;

    const pages = Math.max(1, Math.ceil(totalRecords / MOVIES_PAGE_SIZE));
    const from = totalRecords ? (filter.page - 1) * MOVIES_PAGE_SIZE + 1 : 0;
    const to = Math.min(filter.page * MOVIES_PAGE_SIZE, totalRecords);

    const selectFilter = (key, options, placeholder) => close => (
        <Select autoFocus menuIsOpen options={options} value={filter[key]} styles={selectStyles}
                placeholder={placeholder} noOptionsMessage={() => 'Sin resultados'}
                onChange={option => { setFilter({ [key]: option }); close(); }} />
    );

    return (
        <div className="movies-screen">
            <h1 className="sr-only">Links</h1>

            <section className="mf-card mf-filters" aria-label="Filtros">
                <div className="mf-search-row">
                <div className="mf-search">
                    <FontAwesomeIcon icon={faSearch} className="mf-search-icon" />
                    <label htmlFor="movies-search" className="sr-only">Buscar links</label>
                    <input id="movies-search" ref={searchRef} type="text" autoComplete="off"
                           placeholder="Buscar por título, URL o actor…"
                           value={searchText}
                           onChange={e => setSearchText(e.target.value)}
                           onKeyDown={onSearchKeyDown} />
                    {searchText && (
                        <button type="button" className="mf-icon-btn" aria-label="Borrar búsqueda" onClick={() => runSearch('')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )}
                    <kbd className="mf-kbd" title="Atajo para enfocar el buscador">/</kbd>
                </div>
                <button type="button" className="btn btn-primary mf-btn mf-new" onClick={addMovie}>
                    <FontAwesomeIcon icon={faPlus} /> Nuevo link
                </button>
                </div>

                <div className="mf-pills">
                    <FilterPill label="Categoría" valueLabel={filter.category && filter.category.label}
                                active={!!filter.category} onClear={() => setFilter({ category: null })}>
                        {selectFilter('category', categoryOptions, 'Buscar categoría…')}
                    </FilterPill>
                    <FilterPill label="Idioma" valueLabel={filter.language && filter.language.label}
                                active={!!filter.language} onClear={() => setFilter({ language: null })}>
                        {selectFilter('language', languageOptions, 'Buscar idioma…')}
                    </FilterPill>
                    <FilterPill label="Actor" valueLabel={filter.actor && filter.actor.label}
                                active={!!filter.actor} onClear={() => setFilter({ actor: null })}>
                        {selectFilter('actor', actorOptions, 'Buscar actor…')}
                    </FilterPill>
                    <FilterPill label="Estado" valueLabel={statusOption && statusOption.label}
                                active={!!statusOption} onClear={() => setFilter({ status: null })} width={220}>
                        {close => (
                            <div className="mf-options" role="listbox" aria-label="Estado">
                                {STATUS_OPTIONS.map(o => (
                                    <button key={o.value} type="button" role="option" aria-selected={filter.status === o.value}
                                            className={filter.status === o.value ? 'is-selected' : ''}
                                            onClick={() => { setFilter({ status: o.value }); close(); }}>
                                        <span className={`mf-badge ${o.className}`}>{o.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </FilterPill>

                    <span className="mf-divider" aria-hidden="true" />

                    <FilterPill label="Más filtros" icon={faSlidersH} active={moreCount > 0} badge={moreCount} width={340}>
                        {close => (
                            <MoreFilters filter={filter} onChange={setFilter} onClose={close}
                                         onClear={() => setFilter({ rankingMin: 0, subtitle: '', old: '', dateFrom: '', dateTo: '' })} />
                        )}
                    </FilterPill>

                    {hasCriteria && (
                        <button type="button" className="mf-link mf-clear-all" onClick={clearAll}>Limpiar todo</button>
                    )}
                </div>

                <p className="mf-help">
                    {typedTooShort
                        ? `Escribí al menos ${MIN_SEARCH_LENGTH} letras para buscar`
                        : 'Busca en título, URL y actor · los resultados se actualizan al dejar de escribir'}
                </p>
            </section>

            {!hasCriteria ? (
                <section className="mf-card mf-empty-start" aria-label="Resultados">
                    <div className="mf-empty-side">
                        {recent.length > 0 && (
                            <div className="mf-empty-group">
                                <span className="mf-label">Búsquedas recientes</span>
                                {recent.map(term => (
                                    <button key={term} type="button" className="mf-recent" onClick={() => runSearch(term)}>
                                        <FontAwesomeIcon icon={faHistory} /> {term}
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="mf-empty-group">
                            <span className="mf-label">Accesos rápidos</span>
                            <div className="mf-quick">
                                <button type="button" className="mf-pill" onClick={() => setFilter({ status: 'pending' })}>
                                    <span className="mf-dot is-warn" /> Pendientes
                                </button>
                                <button type="button" className="mf-pill" onClick={() => setFilter({ status: 'converting' })}>
                                    <span className="mf-dot is-info" /> Convirtiendo
                                </button>
                                <button type="button" className="mf-pill" onClick={() => setFilter({ dateFrom: daysAgo(7) })}>
                                    Agregados esta semana
                                </button>
                                <button type="button" className="mf-pill" onClick={() => setFilter({ showAll: true })}>
                                    Ver todos
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="mf-card mf-results" aria-label="Resultados" aria-busy={loading}>
                    <div className="mf-results-header">
                        <p aria-live="polite">
                            <strong>{totalRecords} {totalRecords === 1 ? 'resultado' : 'resultados'}</strong>
                            <span className="mf-muted">
                                {searchTerm.length >= MIN_SEARCH_LENGTH && ` para «${searchTerm}»`}
                                {activeCount > 0 && ` · ${activeCount} ${activeCount === 1 ? 'filtro activo' : 'filtros activos'}`}
                                {!searchTerm && !activeCount && ' · todos los links'}
                                {loading && ' · buscando…'}
                            </span>
                        </p>
                        <label className="mf-sort">
                            <span className="sr-only">Ordenar por</span>
                            <select className="form-control" value={filter.orderBy} onChange={e => setFilter({ orderBy: e.target.value })}>
                                {ORDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                        </label>
                    </div>

                    {totalRecords === 0 && !loading ? (
                        <div className="mf-no-results">
                            <h2>No encontramos links</h2>
                            <p>Probá con otro texto o quitá algún filtro.</p>
                            <button type="button" className="btn btn-outline-primary mf-btn" onClick={clearAll}>Limpiar filtros</button>
                        </div>
                    ) : (
                        <>
                            <div className={`mf-table-wrap${loading ? ' is-loading' : ''}`}>
                                <table className="mf-table">
                                    <thead>
                                        <tr>
                                            <th>Título</th><th>Categoría</th><th>Idioma</th><th>Actor</th>
                                            <th>Ranking</th><th>Estado</th><th>Alta</th>
                                            <th><span className="sr-only">Acciones</span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movies.map(row => (
                                            <tr key={row.id}>
                                                <td className="mf-title-cell">
                                                    <a href={row.link} target="_blank" rel="noopener noreferrer" onClick={rememberSearch}>
                                                        <Highlight text={row.description} term={searchTerm} />
                                                    </a>
                                                    <div className="mf-url"><Highlight text={row.link.replace(/^https?:\/\//, '')} term={searchTerm} /></div>
                                                </td>
                                                <td>{row.category_description}</td>
                                                <td>
                                                    {row.language_description}
                                                    {row.subtitle === 1 && <div className="mf-url">con subtítulos</div>}
                                                </td>
                                                <td><Highlight text={row.actor_name} term={searchTerm} /></td>
                                                <td><Stars value={row.ranking} /></td>
                                                <td>
                                                    {statusBadges(row).map(b => (
                                                        <span key={b.value} className={`mf-badge ${b.className}`}>{b.label}</span>
                                                    ))}
                                                    {row.old === 1 && <span className="mf-badge">Antigua</span>}
                                                </td>
                                                <td className="mf-date">{row.create_date ? new Date(row.create_date).toISOString().split('T')[0] : ''}</td>
                                                <td className="mf-actions">
                                                    <button type="button" className="mf-icon-btn" aria-label={`Editar ${row.description}`} title="Editar"
                                                            onClick={() => editMovie(row)}>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <button type="button" className="mf-icon-btn" aria-label={`Borrar ${row.description}`} title="Borrar"
                                                            onClick={() => deleteMovie(row)}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {totalRecords > MOVIES_PAGE_SIZE && (
                                <div className="mf-pagination">
                                    <span className="mf-muted">Mostrando {from}–{to} de {totalRecords}</span>
                                    <div>
                                        <button type="button" className="btn btn-outline-secondary btn-sm" disabled={filter.page <= 1 || loading}
                                                onClick={() => setFilter({ page: filter.page - 1 })}>
                                            Anterior
                                        </button>
                                        <span className="mf-page">Página {filter.page} de {pages}</span>
                                        <button type="button" className="btn btn-outline-secondary btn-sm" disabled={filter.page >= pages || loading}
                                                onClick={() => setFilter({ page: filter.page + 1 })}>
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}

            {formMatch && <MovieFormModal id={formMatch.params.id} onClose={closeForm} />}
        </div>
    );
}

export default MoviesScreen;
