import "./Card.css";

/**
 * Card — the primary surface of the MES theme.
 * @param {string} title      optional header title (bold, navy)
 * @param {ReactNode} icon    optional leading icon element
 * @param {ReactNode} action  optional right-aligned header content
 * @param {boolean} muted     use the muted lavender surface
 */
export default function Card({
  title,
  icon,
  action,
  muted = false,
  className = "",
  bodyClassName = "",
  children,
  ...rest
}) {
  return (
    <section
      className={`mes-card ${muted ? "mes-card--muted" : ""} ${className}`}
      {...rest}
    >
      {(title || action) && (
        <header className="mes-card__head">
          <div className="mes-card__title">
            {icon && <span className="mes-card__icon">{icon}</span>}
            {title && <h3>{title}</h3>}
          </div>
          {action && <div className="mes-card__action">{action}</div>}
        </header>
      )}
      <div className={`mes-card__body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
