import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Píldora de filtro con panel desplegable.
 * `children` puede ser una función que recibe `close` para cerrar el panel.
 */
function FilterPill({ label, valueLabel, active, badge, icon, onClear, width, children }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onMouseDown = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onKeyDown = e => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    const close = () => setOpen(false);

    return (
        <div className="mf-anchor" ref={ref}>
            <span className={`mf-pill${active ? ' is-active' : ''}`}>
                <button type="button" className="mf-pill-main" aria-expanded={open} onClick={() => setOpen(o => !o)}>
                    {icon && <FontAwesomeIcon icon={icon} />}
                    <span>
                        {label}
                        {valueLabel && <>: <strong>{valueLabel}</strong></>}
                    </span>
                    {badge ? <span className="mf-count">{badge}</span> : null}
                    {!(active && onClear) && <FontAwesomeIcon icon={faChevronDown} className="mf-chevron" />}
                </button>
                {active && onClear && (
                    <button type="button" className="mf-pill-clear" aria-label={`Quitar filtro ${label}`} onClick={onClear}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                )}
            </span>
            {open && (
                <div className="mf-popover" role="dialog" aria-label={label} style={width ? { width } : undefined}>
                    {typeof children === 'function' ? children(close) : children}
                </div>
            )}
        </div>
    );
}

export default FilterPill;
