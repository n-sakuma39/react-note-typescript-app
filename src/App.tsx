import React, { useState, useEffect } from "react";
import "./App.css";

interface Note {
  id: number;
  text: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [selectedNote, setSelectedNote] = useState<Note | null>(() => {
    const savedSelectedNote = localStorage.getItem("selectedNote");
    return savedSelectedNote ? JSON.parse(savedSelectedNote) : null;
  });
  const [editedText, setEditedText] = useState<string>(() => {
    const savedEditedText = localStorage.getItem("editedText");
    return savedEditedText || "";
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("selectedNote", JSON.stringify(selectedNote));
  }, [selectedNote]);

  useEffect(() => {
    localStorage.setItem("editedText", editedText);
  }, [editedText]);

  const handleNoteAdd = () => {
    const newNote: Note = {
      id: Date.now(),
      text: "新規ノート🗒️",
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setEditedText(newNote.text);
  };

  const handleSelect = (note: Note) => {
    console.log(note);
    setSelectedNote(note);
    setEditedText(note.text);
  };

  const handleDelete = (noteId: number) => {
    console.log(noteId);
    const filteredNotes = notes.filter((note) => note.id !== noteId);
    console.log(filteredNotes);
    setNotes(filteredNotes);

    if (filteredNotes.length > 0) {
      const lastNote = filteredNotes[filteredNotes.length - 1];
      setSelectedNote(lastNote);
    } else {
      setSelectedNote(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
    setEditedText(e.target.value);
  };

  const handleSave = () => {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNote!.id) {
        return { ...note, text: editedText };
      }
      return note;
    });

    console.log(updatedNotes);
    setNotes(updatedNotes);
  };

  return (
    <div className="app-container">
      {/* サイドバー */}
      <div className="sidebar">
        <button id="create" onClick={handleNoteAdd}>
          ノート追加
        </button>
        <ul>
          {notes.map((note) => (
            <li
              className={
                selectedNote && selectedNote.id === note.id ? "selected" : ""
              }
              key={note.id}
            >
              <button className="delete" onClick={() => handleDelete(note.id)}>
                削除
              </button>
              <span onClick={() => handleSelect(note)}>{note.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* メインエリア */}
      <div className="main">
        {selectedNote ? (
          <>
            <h2>内容</h2>
            <textarea value={editedText} onChange={handleChange} />
            <button className="save" onClick={handleSave}>
              保存
            </button>
          </>
        ) : (
          <div>ノートを作成してください</div>
        )}
      </div>
    </div>
  );
}
export default App;

