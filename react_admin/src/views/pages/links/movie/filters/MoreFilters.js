import React from 'react';

const Segmented = ({ label, value, onChange, options }) => (
    <div className="mf-field">
        <span className="mf-label">{label}</span>
        <div className="mf-seg" role="group" aria-label={label}>
            {options.map(o => (
                <button key={o.value} type="button" aria-pressed={value === o.value}
                        className={value === o.value ? 'is-on' : ''} onClick={() => onChange(o.value)}>
                    {o.label}
                </button>
            ))}
        </div>
    </div>
);

/** Contenido del panel "Más filtros": ranking, subtítulos, antigua y fecha de alta. */
function MoreFilters({ filter, onChange, onClear, onClose }) {
    const { rankingMin, subtitle, old, dateFrom, dateTo } = filter;

    return (
        <div className="mf-more">
            <div className="mf-field">
                <span className="mf-label">Ranking mínimo</span>
                <div className="mf-stars-input">
                    {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button"
                                className={n <= rankingMin ? 'is-on' : ''}
                                aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'} o más`}
                                aria-pressed={n === rankingMin}
                                onClick={() => onChange({ rankingMin: n === rankingMin ? 0 : n })}>
                            ★
                        </button>
                    ))}
                    <span className="mf-hint">{rankingMin ? `${rankingMin} o más` : 'Cualquiera'}</span>
                </div>
            </div>

            <Segmented label="Subtítulos" value={subtitle} onChange={v => onChange({ subtitle: v })}
                       options={[{ value: '', label: 'Todos' }, { value: '1', label: 'Con' }, { value: '0', label: 'Sin' }]} />

            <Segmented label="Antigua (old)" value={old} onChange={v => onChange({ old: v })}
                       options={[{ value: '', label: 'Todas' }, { value: '1', label: 'Sí' }, { value: '0', label: 'No' }]} />

            <div className="mf-field">
                <span className="mf-label">Fecha de alta</span>
                <div className="mf-dates">
                    <label>
                        Desde
                        <input type="date" className="form-control" value={dateFrom} max={dateTo || undefined}
                               onChange={e => onChange({ dateFrom: e.target.value })} />
                    </label>
                    <label>
                        Hasta
                        <input type="date" className="form-control" value={dateTo} min={dateFrom || undefined}
                               onChange={e => onChange({ dateTo: e.target.value })} />
                    </label>
                </div>
            </div>

            <div className="mf-more-footer">
                <button type="button" className="mf-link" onClick={onClear}>Limpiar</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>Listo</button>
            </div>
        </div>
    );
}

export default MoreFilters;
