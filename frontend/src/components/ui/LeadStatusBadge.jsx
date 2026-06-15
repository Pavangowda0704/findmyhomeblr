import { LEAD_STATUSES } from '../../constants';

const LeadStatusBadge = ({ status }) => {
  const found = LEAD_STATUSES.find(s => s.value === status);
  if (!found) return null;
  return (
    <span className={`badge ${found.color} font-medium capitalize`}>
      {found.label}
    </span>
  );
};

export default LeadStatusBadge;
