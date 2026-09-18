// client/src/pages/Subjects.jsx
import { useState, useEffect } from "react";
import { getSubjects, createSubject, deleteSubject } from "../services/subjectService";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [teacher, setTeacher] = useState("");

  const loadSubjects = async () => {
    const data = await getSubjects();
    setSubjects(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSubjects();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createSubject({ name, code, teacher });
    setName("");
    setCode("");
    setTeacher("");
    loadSubjects(); // refetch so the list reflects the new row
  };

  const handleDelete = async (id) => {
    await deleteSubject(id);
    loadSubjects();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Subjects</h1>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input className="border p-2 rounded flex-1" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 rounded w-24" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <input className="border p-2 rounded flex-1" placeholder="Teacher" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 rounded" type="submit">Add</button>
      </form>

      <ul className="flex flex-col gap-2">
        {subjects.map((s) => (
          <li key={s.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{s.name} {s.code && `(${s.code})`}</p>
              {s.teacher && <p className="text-sm text-gray-500">{s.teacher}</p>}
            </div>
            <button onClick={() => handleDelete(s.id)} className="text-red-500 text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Subjects;