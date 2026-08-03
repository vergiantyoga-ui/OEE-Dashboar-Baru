import "./Button.css";

/**
 * Button — MES action button.
 * variant: primary | secondary | ghost | success | danger | warning | info
 */
export default function Button({
  variant = "secondary",
  size = "md",
  block = false,
  icon,
  children,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`mes-btn mes-btn--${variant} mes-btn--${size} ${
        block ? "mes-btn--block" : ""
      } ${className}`}
      {...rest}
    >
      {icon && <span className="mes-btn__icon">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
}
