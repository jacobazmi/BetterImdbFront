import React, { useState, Fragment, useEffect, useSortBy } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";

const App = () => {
  const [films, setFilms] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("ASC");
  const [addFormData, setAddFormData] = useState({
    title: "",
    year: "",
    description: "",
    length: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    year: "",
    description: "",
    length: "",
  });

  const [editFilmId, setEditFilmId] = useState(null);

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;

    setEditFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newFilm = {
      id: nanoid(),
      title: addFormData.title,
      year: addFormData.year,
      description: addFormData.description,
      length: addFormData.length,
    };

    const newFilms = [...films, newFilm];
    setFilms(newFilms);
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedFilm = {
      id: editFilmId,
      title: editFormData.title,
      year: editFormData.year,
      description: editFormData.description,
      length: editFormData.length,
    };

    const newFilms = [...films];

    const index = films.findIndex((film) => film.id === editFilmId);

    newFilms[index] = editedFilm;

    setFilms(newFilms);
    setEditFilmId(null);
  };

  const handleEditClick = (event, film) => {
    event.preventDefault();
    setEditFilmId(film.id);

    const formValues = {
      title: film.title,
      year: film.year,
      description: film.description,
      length: film.length,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditFilmId(null);
  };

  const handleDeleteClick = (filmId) => {
    const newFilms = [...films];

    const index = films.findIndex((film) => film.id === filmId);

    newFilms.splice(index, 1);

    setFilms(newFilms);
  };

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...films].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setFilms(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...films].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setFilms(sorted);
      setOrder("ASC");
    }
  };

  const sortingNumber = (col) => {
    if (order === "ASC") {
      const sorted = [...films].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setFilms(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...films].sort((a, b) => (a[col] < b[col] ? 1 : -1));
      setFilms(sorted);
      setOrder("ASC");
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/betterimdb/films")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((films) => {
        setFilms(films);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return "Loading...";
  if (error) return "Error!";

  const getFilms = () => {
    fetch("http://localhost:8080/betterimdb/films")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((films) => {
        setFilms(films);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) return "Loading...";
  if (error) return "Error!";

  const searchFilms = () => {
    fetch(
      "http://localhost:8080/betterimdb/films" + "/search?title=" + "aladdin"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((films) => {
        setFilms(films);
      });
  };

  return (
    <div className="app-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          // onChange={(event) => {
          //   setSearchTerm(event.target.value);
          // }}
        ></input>
        <button onClick={searchFilms}>Search</button>
      </div>
      <button onClick={getFilms}>Refresh Films</button>
      <form onSubmit={handleEditFormSubmit}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th onClick={() => sorting("title")}>Title</th>
              <th onClick={() => sortingNumber("year")}>Year</th>
              <th onClick={() => sorting("description")}>Description</th>
              <th onClick={() => sortingNumber("length")}>Length</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {films
              .filter((film) => {
                if (searchTerm == "") {
                  return film;
                } else if (
                  film.title.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return film;
                }
              })
              .map((film) => (
                <Fragment>
                  {editFilmId === film.id ? (
                    <EditableRow
                      editFormData={editFormData}
                      handleEditFormChange={handleEditFormChange}
                      handleCancelClick={handleCancelClick}
                    />
                  ) : (
                    <ReadOnlyRow
                      film={film}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
      </form>

      <h2>Add a Film</h2>
      <form onSubmit={handleAddFormSubmit}>
        <input
          type="text"
          name="title"
          required="required"
          placeholder="Enter a name..."
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="year"
          required="required"
          placeholder="Enter a year..."
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="description"
          required="required"
          placeholder="Enter a description..."
          onChange={handleAddFormChange}
        />
        <input
          type="text"
          name="length"
          required="required"
          placeholder="Enter a length..."
          onChange={handleAddFormChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default App;
