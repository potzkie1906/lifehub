// frontend/src/hooks/useApiData.js
import { useCallback, useEffect, useState } from "react";

// Loads a page's data from the API and keeps track of loading and errors.
//
//   const { data, loading, error, reload } = useApiData(getTasks, []);
//
// - fetcher:     a function that returns a Promise, like getTasks from a service.
//                Define it OUTSIDE your component, so it's the same function on every
//                render. An arrow function written inside the component would be a new
//                function each render, and the page would keep reloading forever.
// - initialData: what `data` holds until the first response arrives.
// - reload():    call it after you add, edit or delete something.
export const useApiData = (fetcher, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(
    () =>
      fetcher()
        .then((result) => {
          setData(result);
          setError("");
        })
        .catch((err) => {
          console.error(err);
          setError("Couldn't load your data. Make sure the server is running, then refresh the page.");
        })
        .finally(() => setLoading(false)),
    [fetcher]
  );

  // The state only changes inside .then/.catch/.finally, after the server answers —
  // never directly in the effect body. That's why this doesn't trip the
  // react-hooks/set-state-in-effect rule the way the old loadData() did.
  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload };
};
