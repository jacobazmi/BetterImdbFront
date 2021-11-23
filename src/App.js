import React, { useState, Fragment, useEffect, useSortBy } from "react";
import { nanoid } from "nanoid";
import "./App.css";
import ReadOnlyRow from "./components/ReadOnlyRow";
import EditableRow from "./components/EditableRow";
import ReactPaginate from "react-paginate";

const App = () => {
  const [films, setFilms] = useState(null);
  const [apiUrl, setApiUrl] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("ASC");
  const [pageNumber, setPageNumber] = useState(0);
  const [addFormData, setAddFormData] = useState({
    title: "",
    year: 0,
    description: "",
    length: 0,
    rating: "",
  });

  const [editFormData, setEditFormData] = useState({
    title: "",
    year: 0,
    description: "",
    length: 0,
    rating: "",
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
      rating: addFormData.rating,
    };

    const newFilms = [...films, newFilm];
    setFilms(newFilms);
  };

  const handleAddFormSubmitApi = (event) => {
    alert("New Film Added");
    event.preventDefault();

    const newFilm = {
      title: addFormData.title,
      year: addFormData.year,
      description: addFormData.description,
      length: addFormData.length,
      rating: addFormData.rating,
    };

    fetch("http://localhost:8080/betterimdb/films/addfilmbody", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFilm),
    }).then(() => {
      console.log("new film added");
      getFilms();
    });
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();

    const editedFilm = {
      id: editFilmId,
      title: editFormData.title,
      year: editFormData.year,
      description: editFormData.description,
      length: editFormData.length,
      rating: editFormData.rating,
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
      rating: film.rating,
    };

    setEditFormData(formValues);
  };

  const handleCancelClick = () => {
    setEditFilmId(null);
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

  const handleSearch = (e) => {
    let newApiUrl = { ...apiUrl };
    setSearchTerm(e.target.value);
    newApiUrl =
      "http://localhost:8080/betterimdb/films" + "/search?title=" + searchTerm;
    setApiUrl(newApiUrl);
    console.log(newApiUrl);
  };

  const searchFilms = (e) => {
    e.preventDefault();
    fetch(apiUrl)
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

  const deleteFilm = (id) => {
    if (window.confirm("Are you sure?")) {
      fetch("http://localhost:8080/betterimdb/films/deletefilm/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).then((result) => {
        result.json().then((resp) => {
          console.warn("Film " + resp.id + " deleted.", resp);
          getFilms();
        });
      });
    }
  };

  const updateFilm = (event) => {
    event.preventDefault();

    const editedFilm = {
      id: editFilmId,
      title: editFormData.title,
      year: editFormData.year,
      description: editFormData.description,
      length: editFormData.length,
      rating: editFormData.rating,
    };

    const index = editFilmId;

    fetch("http://localhost:8080/betterimdb/films/updatefilmbody/" + index, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedFilm),
    }).then((result) => {
      result.json().then((resp) => {
        console.warn("Film " + resp.id + " updated.", resp);
      });
    });
    alert("Film updated: ID " + index);
    setEditFilmId(null);
    getFilms();
  };

  const filmsPerPage = 10;
  const pagesVisited = pageNumber * filmsPerPage;

  const displayUsers = films
    .slice(pagesVisited, pagesVisited + filmsPerPage)
    .map((film) => {
      return (
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
              deleteFilm={deleteFilm}
            />
          )}
        </Fragment>
      );
    });

  const pageCount = Math.ceil(films.length / filmsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="app-container">
      <div className="search-container">
        <form onSubmit={(e) => searchFilms(e)}>
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              handleSearch(e);
            }}
          ></input>
          <button>Search</button>
        </form>
      </div>
      <button onClick={getFilms}>Refresh Films</button>
      <form onSubmit={updateFilm}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th onClick={() => sorting("title")}>Title</th>
              <th onClick={() => sortingNumber("year")}>Year</th>
              <th onClick={() => sorting("description")}>Description</th>
              <th onClick={() => sortingNumber("length")}>Length</th>
              <th onClick={() => sorting("rating")}>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{displayUsers}</tbody>
        </table>
      </form>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />

      <h2>Add a Film</h2>
      <form onSubmit={handleAddFormSubmitApi}>
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
        <input
          type="text"
          name="rating"
          required="required"
          placeholder="Enter a rating..."
          onChange={handleAddFormChange}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default App;
