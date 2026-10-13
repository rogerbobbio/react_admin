import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

import movieActions from 'src/actions/links/movieActions';
import { fetchConToken } from 'src/helpers/fetch';

const DUPLICATE_CHECK_MS = 400;
const REQUIRED = ['link', 'description', 'category_id', 'actor_id', 'language_id'];

const SWITCHES = [
    { key: 'subtitle', label: 'Subtítulos' },
    { key: 'pending', label: 'Pendiente' },
    { key: 'converting', label: 'Convirtiendo' },
];
const MINOR_SWITCHES = [
    { key: 'serie', label: 'Es serie' },
    { key: 'old', label: 'Antigua (old)' },
];

const selectStyles = {
    control: (base, state) => ({
        ...base,
        minHeight: 42,
        borderRadius: 8,
        borderColor: state.selectProps.invalid ? '#b42318' : state.isFocused ? '#2f4bd6' : '#d5d9e0',
        boxShadow: state.isFocused ? '0 0 0 3px #eaeeff' : 'none',
    }),
    menuPortal: base => ({ ...base, zIndex: 2000 }),
};

const GENERIC_SEGMENTS = ['watch', 'view', 'video', 'videos', 'play', 'player', 'index', 'embed', 'file', 'download', 'd'];

// "https://sitio/peliculas/nueve-reinas.html" -> "Nueve reinas"
const suggestDescription = url => {
    let parsed;
    try {
        parsed = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    } catch (e) {
        return '';
    }
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (!segments.length) return '';
    let text = segments[segments.length - 1];
    try { text = decodeURIComponent(text); } catch (e) { /* se usa tal cual */ }
    text = text.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_+.]+/g, ' ').trim();
    // Segmentos genéricos o numéricos no sirven como título
    if (!text || /^\d+$/.test(text) || GENERIC_SEGMENTS.includes(text.toLowerCase())) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

// Busca si ya existe otro link con el mismo valor exacto en `field` ('link' | 'description')
const findDuplicate = async (field, value, ownId) => {
    const resp = await fetchConToken('movies/search/byparam/', { [field]: encodeURIComponent(value.trim()), limit: 20 });
    const body = await resp.json();
    if (!body.ok) return null;
    return body.movies.find(m => same(m[field], value) && String(m.id) !== String(ownId)) || null;
};

// Estado de la verificación de duplicados para un campo
const useDuplicateCheck = (field, value, ownId, enabled) => {
    const [state, setState] = useState({ status: 'idle' });
    useEffect(() => {
        if (!enabled || !value || !value.trim()) {
            setState({ status: 'idle' });
            return;
        }
        let cancelled = false;
        setState({ status: 'checking' });
        const timer = setTimeout(async () => {
            try {
                const duplicate = await findDuplicate(field, value, ownId);
                if (!cancelled) setState(duplicate ? { status: 'duplicate', movie: duplicate } : { status: 'ok' });
            } catch (e) {
                if (!cancelled) setState({ status: 'idle' });
            }
        }, DUPLICATE_CHECK_MS);
        return () => { cancelled = true; clearTimeout(timer); };
    }, [field, value, ownId, enabled]);
    return state;
};

const Switch = ({ label, checked, onChange, minor }) => (
    <div className={`mfm-switch-row${minor ? ' is-minor' : ''}`}>
        <span id={`sw-${label}`}>{label}</span>
        <button type="button" role="switch" aria-checked={checked} aria-labelledby={`sw-${label}`}
                className={`mfm-switch${checked ? ' is-on' : ''}`} onClick={() => onChange(!checked)} />
    </div>
);

function MovieFormModal({ id, onClose }) {
    const dispatch = useDispatch();
    const { movie, saving } = useSelector(state => state.movie);
    const categories = useSelector(state => state.movieCategory.movieCategories);
    const languages = useSelector(state => state.language.languages);
    const actors = useSelector(state => state.actor.actors);

    const categoryOptions = useMemo(() => categories.map(r => ({ value: r.id, label: r.description })), [categories]);
    const languageOptions = useMemo(() => languages.map(r => ({ value: r.id, label: r.description })), [languages]);
    const actorOptions = useMemo(() => actors.map(r => ({ value: r.id, label: r.name })), [actors]);

    const isNew = id === 'new';
    const loaded = isNew || String(movie.id) === String(id);
    const [descriptionTouched, setDescriptionTouched] = useState(!isNew);
    const [errors, setErrors] = useState({});
    const fieldRefs = useRef({});

    // Prepara el formulario según se cree o se edite
    useEffect(() => {
        setErrors({});
        setDescriptionTouched(!isNew);
        if (isNew) dispatch(movieActions.newMovie());
        else if (String(movie.id) !== String(id)) dispatch(movieActions.getMovie(id));
        // movie.id no va en las dependencias: solo se evalúa al abrir
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, isNew, dispatch]);

    // Evita que la página de atrás scrollee mientras el modal está abierto
    useEffect(() => {
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = previous; };
    }, []);

    const linkCheck = useDuplicateCheck('link', movie.link, movie.id, loaded);
    const descriptionCheck = useDuplicateCheck('description', movie.description, movie.id, loaded);

    const set = (key, value) => {
        dispatch(movieActions.updateMovieProperty(key, value));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
    };

    const onLinkChange = value => {
        set('link', value);
        if (!descriptionTouched) set('description', suggestDescription(value));
    };

    const onDescriptionChange = value => {
        setDescriptionTouched(value !== '');
        set('description', value);
    };

    const save = () => {
        if (saving || !loaded) return;
        const nextErrors = {};
        REQUIRED.forEach(key => {
            if (movie[key] === '' || movie[key] === null || movie[key] === undefined || movie[key] === 0) {
                nextErrors[key] = 'Campo requerido.';
            }
        });
        if (linkCheck.status === 'duplicate') nextErrors.link = 'Ya existe un link con esta URL.';
        if (descriptionCheck.status === 'duplicate') nextErrors.description = 'Ya existe un link con esta descripción.';

        setErrors(nextErrors);
        const firstInvalid = [...REQUIRED].find(key => nextErrors[key]);
        if (firstInvalid) {
            const el = fieldRefs.current[firstInvalid];
            el && el.focus();
            return;
        }
        dispatch(isNew ? movieActions.addMovie() : movieActions.updateMovie());
    };

    const onKeyDown = e => {
        // react-select marca el evento cuando Esc cierra su propio menú
        if (e.key === 'Escape' && !e.defaultPrevented) {
            e.preventDefault();
            onClose();
        }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            save();
        }
    };

    const option = (options, value) => options.find(o => String(o.value) === String(value)) || null;
    const category = option(categoryOptions, movie.category_id);
    const language = option(languageOptions, movie.language_id);
    const actor = option(actorOptions, movie.actor_id);
    const ranking = Number(movie.ranking) || 0;

    const statusBadges = [];
    if (movie.pending === 1) statusBadges.push(<span key="p" className="mf-badge is-warn">Pendiente</span>);
    if (movie.converting === 1) statusBadges.push(<span key="c" className="mf-badge is-info">Convirtiendo</span>);
    if (!statusBadges.length) statusBadges.push(<span key="r" className="mf-badge is-ok">Listo</span>);

    const checkMessage = (check, error, okText, field) => {
        if (error) return <span className="mfm-msg is-error">{error}</span>;
        if (check.status === 'checking') return <span className="mfm-msg">Verificando…</span>;
        if (check.status === 'duplicate') {
            return <span className="mfm-msg is-error">Ya existe: «{check.movie[field === 'link' ? 'description' : 'link']}»</span>;
        }
        if (check.status === 'ok') return <span className="mfm-msg is-ok">✓ {okText}</span>;
        return null;
    };

    const selectField = (key, label, options, value, placeholder) => (
        <div className="mfm-field">
            <label className="mfm-label" htmlFor={`mfm-${key}`}>{label} <span className="mfm-req">*</span></label>
            <Select inputId={`mfm-${key}`} ref={el => { fieldRefs.current[key] = el; }}
                    options={options} value={value} placeholder={placeholder} styles={selectStyles}
                    invalid={!!errors[key]} noOptionsMessage={() => 'Sin resultados'}
                    menuPortalTarget={document.body}
                    onChange={o => set(key, o ? o.value : '')} />
            {errors[key] && <span className="mfm-msg is-error">{errors[key]}</span>}
        </div>
    );

    return (
        <div className="mfm-backdrop">
            <div className="mfm-dialog" role="dialog" aria-modal="true" aria-labelledby="mfm-title" onKeyDown={onKeyDown}>
                <div className="mfm-header">
                    <h2 id="mfm-title">{isNew ? 'Nuevo link' : 'Editar link'}</h2>
                    <button type="button" className="mf-icon-btn" aria-label="Cerrar" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {!loaded ? (
                    <div className="mfm-loading">Cargando…</div>
                ) : (
                    <div className="mfm-body">
                        <div className="mfm-main">
                            <div className="mfm-field">
                                <label className="mfm-label" htmlFor="mfm-link">{isNew ? '1. Pegá la URL' : 'URL'} <span className="mfm-req">*</span></label>
                                <div className="mfm-inline">
                                    <input id="mfm-link" ref={el => { fieldRefs.current.link = el; }} autoFocus
                                           className={`mfm-input mfm-mono${errors.link ? ' is-invalid' : ''}`}
                                           value={movie.link} placeholder="https://…" autoComplete="off"
                                           onChange={e => onLinkChange(e.target.value)} />
                                    <a className={`btn btn-outline-secondary mfm-open${movie.link ? '' : ' disabled'}`}
                                       href={movie.link || undefined} target="_blank" rel="noopener noreferrer"
                                       aria-label="Abrir URL en otra pestaña" title="Abrir URL">
                                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                                    </a>
                                </div>
                                {checkMessage(linkCheck, errors.link, 'URL nueva, no está cargada', 'link')}
                            </div>

                            <div className="mfm-field">
                                <label className="mfm-label" htmlFor="mfm-description">{isNew ? '2. Descripción' : 'Descripción'} <span className="mfm-req">*</span></label>
                                <input id="mfm-description" ref={el => { fieldRefs.current.description = el; }}
                                       className={`mfm-input${errors.description ? ' is-invalid' : ''}`}
                                       value={movie.description} autoComplete="off"
                                       onChange={e => onDescriptionChange(e.target.value)} />
                                {checkMessage(descriptionCheck, errors.description, 'No hay otro link con esta descripción', 'description')
                                    || (isNew && !descriptionTouched && movie.description &&
                                        <span className="mfm-msg">Sugerida a partir de la URL · podés editarla</span>)}
                            </div>

                            <div className="mfm-grid-3">
                                {selectField('category_id', 'Categoría', categoryOptions, category, 'Elegí…')}
                                {selectField('actor_id', 'Actor', actorOptions, actor, 'Buscar actor…')}
                                {selectField('language_id', 'Idioma', languageOptions, language, 'Elegí…')}
                            </div>

                            <div className="mfm-field">
                                <span className="mfm-label" id="mfm-ranking">Ranking</span>
                                <div className="mfm-stars" role="radiogroup" aria-labelledby="mfm-ranking">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button key={n} type="button" role="radio" aria-checked={n === ranking}
                                                aria-label={`${n} de 5`} className={n <= ranking ? 'is-on' : ''}
                                                onClick={() => set('ranking', n)}>★</button>
                                    ))}
                                    <span className="mfm-msg">{ranking} de 5</span>
                                </div>
                            </div>

                            <div className="mfm-field">
                                <label className="mfm-label" htmlFor="mfm-note">Notas</label>
                                <textarea id="mfm-note" className="mfm-input mfm-textarea" rows={2} placeholder="Opcional"
                                          value={movie.note || ''} onChange={e => set('note', e.target.value)} />
                            </div>
                        </div>

                        <aside className="mfm-side">
                            <div className="mfm-section">
                                <span className="mf-label">Vista previa en la lista</span>
                                <div className="mfm-preview">
                                    <div className="mfm-preview-top">
                                        <strong>{movie.description || 'Sin descripción'}</strong>
                                        <span className="mf-stars" role="img" aria-label={`${ranking} de 5`}>
                                            {[1, 2, 3, 4, 5].map(n => <span key={n} className={n <= ranking ? '' : 'is-off'}>★</span>)}
                                        </span>
                                    </div>
                                    <span className="mf-url">{(movie.link || 'sin URL').replace(/^https?:\/\//, '')}</span>
                                    <span className="mfm-preview-meta">
                                        {[category && category.label,
                                          language && `${language.label}${movie.subtitle === 1 ? ' con subtítulos' : ''}`,
                                          actor && actor.label].filter(Boolean).join(' · ') || 'Categoría · Idioma · Actor'}
                                    </span>
                                    <div>
                                        {statusBadges}
                                        {movie.old === 1 && <span className="mf-badge">Antigua</span>}
                                        {movie.serie === 1 && <span className="mf-badge">Serie</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="mfm-section">
                                <span className="mf-label">Estado</span>
                                <div>
                                    {SWITCHES.map(s => (
                                        <Switch key={s.key} label={s.label} checked={movie[s.key] === 1}
                                                onChange={v => set(s.key, v ? 1 : 0)} />
                                    ))}
                                    <div className="mfm-sep" />
                                    {MINOR_SWITCHES.map(s => (
                                        <Switch key={s.key} label={s.label} minor checked={movie[s.key] === 1}
                                                onChange={v => set(s.key, v ? 1 : 0)} />
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                )}

                <div className="mfm-footer">
                    <span className="mfm-msg">Esc para cerrar · Ctrl ↵ para guardar</span>
                    <button type="button" className="btn btn-outline-secondary mf-btn" onClick={onClose}>Cancelar</button>
                    <button type="button" className="btn btn-primary mf-btn" onClick={save} disabled={saving || !loaded}>
                        {saving ? 'Guardando…' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MovieFormModal;
