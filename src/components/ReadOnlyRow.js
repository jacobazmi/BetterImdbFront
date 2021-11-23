import React from "react";

const ReadOnlyRow = ({ film, handleEditClick, deleteFilm }) => {
  return (
    <tr>
      <td>{film.title}</td>
      <td>{film.year}</td>
      <td>{film.description}</td>
      <td>{film.length}</td>
      <td>{film.rating}</td>
      <td>
        <button type="button" onClick={(event) => handleEditClick(event, film)}>
          Edit
        </button>
        <div className="delBttn">
          <button type="button" onClick={() => deleteFilm(film.id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
