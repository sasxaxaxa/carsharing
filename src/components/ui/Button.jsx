import classnames from 'classnames';

const Button = (props) => {
  const {
    label,
    ariaLabel,
    mode,
    location,
    href,
    iconName,
    iconPosition = 'after',
    className,
    iconSize = 24,
    ...rest
  } = props;

  const title = label || '';
  const isLink = !!href;
  const Component = isLink ? 'a' : 'button';

  const linkProps = isLink
    ? { href, role: 'button' }
    : { type: 'button', ...rest };

  const iconComponent = typeof iconName === 'string'
    ? (
      <svg
        width={iconSize}
        height={iconSize}
        className="button__icon"
        role="img"
        aria-label={ariaLabel || title}
      >
        <use href={`/src/assets/icons/sprite.svg#icon-${iconName}`} />
      </svg>
    )
    : iconName;

  return (
    <Component
      className={classnames(
        'button',
        `button--${mode}`,
        location && `button-${location}`,
        className
      )}
      title={title}
      aria-label={title || ariaLabel}
      {...linkProps}
    >
      {iconPosition === 'before' && iconComponent}
      {title && <span className="button__label">{title}</span>}
      {iconPosition === 'after' && iconComponent}
    </Component>
  );
};

export default Button;