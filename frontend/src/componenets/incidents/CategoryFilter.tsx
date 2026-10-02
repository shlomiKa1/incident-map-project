import { CATEGORY } from "../../config";
import type { Category } from "../../types/incident";

interface CategoryFilterProps {
  value: Category | null;
  onChange: (category: Category | null) => void;
}

const CategoryFilter = ({ value, onChange }: CategoryFilterProps) => {
  return (
    <select
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value ? (e.target.value as Category) : null)
      }
    >
      <option value="">All</option>
      {CATEGORY.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;
