import Icon from '../Atoms/Icon';
import { useNavigate } from 'react-router-dom';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: string;
  iconPosition?: 'left' | 'right';
  href?: string;
};

export default function AnimatedButton({
  children,
  icon,
  iconPosition = 'right',
  className = '',
  href,
  onClick,
  ...props
}: Props) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);

    if (href) {
      navigate(href);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`
        flex items-center justify-center gap-3
        group
        transition-all duration-300
        active:scale-[0.98]
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && (
        <Icon
          name={icon}
          className="transition-transform group-hover:-translate-x-1"
        />
      )}

      {children}

      {icon && iconPosition === 'right' && (
        <Icon
          name={icon}
          className="transition-transform group-hover:translate-x-1"
        />
      )}
    </button>
  );
}