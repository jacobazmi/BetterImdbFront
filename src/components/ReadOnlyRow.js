import React from "react";

const ReadOnlyRow = ({ film, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{film.title}</td>
      <td>{film.year}</td>
      <td>{film.description}</td>
      <td>{film.length}</td>
      <td>
        <button type="button" onClick={(event) => handleEditClick(event, film)}>
          Edit
        </button>
        <button type="button" onClick={() => handleDeleteClick(film.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
