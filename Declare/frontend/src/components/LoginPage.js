import React, { useState } from 'react';

const LoginPage = ({ socket, setLoggedIn, name, setName, room, setRoom }) => {
  const [nameError, setNameError] = useState('');
  const [roomError, setRoomError] = useState('');

  const nameChangeHandler = (e) => {
    const value = e.target.value;
    setName(value);
    if (value.trim() === '' || value.length > 20) {
      setNameError('El nombre es obligatorio y debe tener menos de 20 caracteres.');
    } else {
      setNameError('');
    }
  };

  const roomChangeHandler = (e) => {
    const value = e.target.value;
    setRoom(value);
    if (value.trim() === '' || value.length > 20) {
      setRoomError('El código de la partida es obligatorio y debe tener menos de 20 caracteres.');
    } else {
      setRoomError('');
    }
  };

  const joinRoomHandler = () => {
    if (name.trim() === '' || name.length > 20) {
      setNameError('El nombre es obligatorio y debe tener menos de 20 caracteres.');
      return;
    }
    if (room.trim() === '' || room.length > 20) {
      setRoomError('El código de la partida es obligatorio y debe tener menos de 20 caracteres.');
      return;
    }

    socket.current.emit('join_room', { room, name });
    setLoggedIn(true);
  };

  return (
    <div className="bg-repeat bg-gray-200 dark:bg-gray-700" style={{ backgroundImage: 'url(https://md.rereadgames.com/assets/images/background.9fd67490ba48987ac0c8.svg)' }}>
      <section className="h-screen flex items-center justify-center px-10">
        <div className="rounded-lg w-auto md:w-2/3 lg:w-2/5 bg-white dark:bg-gray-800 py-4 px-4 mx-auto text-center">
          <div className="mb-4 border-gray-200 dark:border-gray-700">
            <div className="rounded-md flex justify-center flex-wrap text-xl font-medium text-center bg-indigo-100 text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:bg-indigo-200 dark:border-indigo-500">
              <div className="w-full p-4 flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linejoin="round" stroke-width="2" d="M17 13v5l-5-1-5 1v-5l5-1 5 1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 13h2v2h-2v-2zm0-6h2v5h-2v-5z" />
                </svg>
                Unirse o crear partida
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="max-w-sm mx-auto mt-5">
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={nameChangeHandler}
                  className={`block rounded-t-md px-2.5 pb-2.5 pt-5 w-full text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-2 border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-0 focus:border-indigo-600 peer ${nameError && 'border-red-500' && 'dark:border-red-500'}`}
                  placeholder=" "
                />
                <label
                  htmlFor="tu_nombre"
                  className={`absolute text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3.5 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto ${nameError && 'text-red-500' && 'dark:text-red-500'}`}
                >
                  Tu nombre
                </label>
              </div>
              {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
            </div>

            <div className="max-w-sm mx-auto mt-5">
              <div className="relative">
                <input
                  type="text"
                  value={room}
                  onChange={roomChangeHandler}
                  className={`block rounded-t-md px-2.5 pb-2.5 pt-5 w-full text-gray-900 bg-gray-100 dark:bg-gray-700 border-0 border-b-2 border-gray-200 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-0 focus:border-indigo-600 peer ${roomError && 'border-red-500' && 'dark:border-red-500'}`}
                  placeholder=" "
                />
                <label
                  htmlFor="codigo_partida"
                  className={`absolute text-gray-500 dark:text-gray-400 duration-200 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-3.5 peer-focus:text-indigo-600 peer-focus:dark:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto ${roomError && 'text-red-500' && 'dark:text-red-500'}`}
                >
                  Código de la partida
                </label>
              </div>
              {roomError && <p className="text-xs text-red-500 mt-1">{roomError}</p>}
              <p id="floating_helper_text" className="mt-2 text-xs text-start text-gray-500 dark:text-gray-400">
                Pide el código de la partida a la persona que te ha invitado o crea uno nuevo
              </p>
            </div>

            <div className="flex justify-end items-center max-w-sm mx-auto mt-5">
              <button
                onClick={joinRoomHandler}
                className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-200 rounded-md px-5 py-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 w-full md:w-auto"
              >
                <svg
                  className="w-3.5 h-3.5 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 21"
                >
                  <path
                    d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"
                  />
                </svg>
                Jugar
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
