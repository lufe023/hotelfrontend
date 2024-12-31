import axios from 'axios';
import React, { useEffect } from 'react';
import getConfig from '../../utils/getConfig';

const FindUser = ({ setResults, selectedUser}) => {

  const findPeople = (findWord) => {
    const URL = `${import.meta.env.VITE_API_SERVER}/api/v1/users/userSearch`;
    axios
      .post(
        URL,
        {
          findUser: findWord,
        },
        getConfig()
      )
      .then((res) => {
        setResults(res.data.data.rows);
      })
      .catch((err) => {
        setResults([]);
        console.log(err);
      });
  };

  const findingWord = (word) => {
    const fn = word.trim();
    if (fn !== '') {
      findPeople(fn);
    } else {
      setResults([]); // Limpia los resultados si no hay texto
    }
  };

  useEffect(() => {
    if(selectedUser){
   setResults([selectedUser])}
  }, [selectedUser])
  

  return (
    <div>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Buscar persona</label>
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          id="exampleInputEmail1"
          placeholder="Nombre, apellido o teléfono"
          onChange={(e) => findingWord(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FindUser;
