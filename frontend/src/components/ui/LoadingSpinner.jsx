const LoadingSpinner = ({ size = 'md', center = true }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' };

  return (
    <div className={center ? 'flex items-center justify-center min-h-[200px]' : 'inline-flex'}>
      <div className={`${sizes[size]} border-4 border-border border-t-primary rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
