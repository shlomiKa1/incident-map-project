import { useState, type FormEvent } from "react";
// import CategoryFilter from "./CategoryFilter";
import type {
  Category,
  CreateIncidentInput,
  Location,
} from "../../types/incident";
import { CATEGORY } from "../../config";

interface IncidentFormProps {
  location: Location;
  onSubmit: (input: Omit<CreateIncidentInput, "location">) => Promise<void>;
  onCancel: () => void;
}

const IncidentForm = ({ location, onSubmit, onCancel }: IncidentFormProps) => {
  const [title, setTilte] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORY[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create incident",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>New incident</h3>
      <p>
        Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </p>

      <input
        type="text"
        value={title}
        onChange={(e) => setTilte(e.target.value)}
        placeholder="Title of incident"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descript what append"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
      >
        {CATEGORY.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {error && <p role="alert">{error}</p>}
      <button disabled={loading}>{loading ? "Saving..." : "Create"}</button>

      <button onClick={onCancel} disabled={loading}>
        Cancel
      </button>
    </form>
  );
};

export default IncidentForm;
