import { useState, type ChangeEvent } from "react";
import { useAuthStore } from "../../store/auth.store";
import type { IncidentMarkerProps, Status } from "../../types/incident";
import { canModify } from "../../utils/permissions";
import { STATUSES } from "../../config";

const LANG_PLACE = "he-IL";
const TIME_ZONE: string = "Asia/Jerusalem";
function getTimeAndDate(date: string): string {
  return date
    ? `${new Date(date).toLocaleTimeString(LANG_PLACE, { timeZone: TIME_ZONE })} - ${new Date(date).toLocaleDateString(LANG_PLACE, { timeZone: TIME_ZONE })}`
    : "-";
}

const IncidentDetails = ({
  incident,
  onStatusChange,
  onDelete,
}: IncidentMarkerProps) => {
  const user = useAuthStore.getState().user;
  const isAllowed = canModify(incident, user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<void>) => {
    setError(null);
    setLoading(true);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as Status;
    run(() => onStatusChange(incident.id, status));
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete "${incident.title}"?`)) return;
    run(() => onDelete(incident.id));
  };

  return (
    <div>
      <h3>{incident.title}</h3>
      <hr />

      <div>
        <h5>Description:</h5>
        <p>{incident.description}</p>
        <hr />
      </div>

      <p>
        Category: <strong>{incident.category}</strong>
      </p>

      {isAllowed ? (
        <>
          <label>
            Status:{" "}
            <select
              value={incident.status}
              onChange={handleStatusChange}
              disabled={loading}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </>
      ) : (
        <p>
          Status: <strong>{incident.status}</strong>
        </p>
      )}
      <hr />
      <p>
        Created at: <strong>{getTimeAndDate(incident.createdAt)}</strong>
      </p>

      <p>
        Updated at: <strong>{getTimeAndDate(incident.updatedAt)}</strong>
      </p>

      <p>
        Created by:{" "}
        <strong>
          {incident.createdBy === user?.id ? "Me" : `Anthor user`}
        </strong>
      </p>
      {error && <p role="alert">{error}</p>}
    </div>
  );
};

export default IncidentDetails;
