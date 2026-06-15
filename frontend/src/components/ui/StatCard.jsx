const StatCard = ({ title, value, icon: Icon, color = 'primary', change, suffix = '' }) => {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-sub text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-text-main mt-1">
            {value?.toLocaleString()}{suffix}
          </p>
          {change !== undefined && (
            <p className={`text-xs mt-2 font-medium ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {change >= 0 ? '▲' : '▼'} {Math.abs(change)}% this month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
