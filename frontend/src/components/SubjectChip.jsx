// frontend/src/components/SubjectChip.jsx
import { subjectColor } from "../utils/colors";

// A small colored label with the subject's name, in that subject's own color
const SubjectChip = ({ id, name }) => {
  const color = subjectColor(id);

  return (
    <span
      className={`inline-flex max-w-[14rem] items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${color.chip}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color.dot}`} />
      <span className="truncate">{name}</span>
    </span>
  );
};

export default SubjectChip;
