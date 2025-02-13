import React from 'react';
import TicTacToe from "../../components/TicTacToe/TicTacToe.jsx";

const GamePage = () => {
  return (
    <div className={'game-page'}>
      <div className={'header'}>
        <h1>Tic Tac Toe</h1>
      </div>
      <TicTacToe/>
    </div>
  );
};

export default GamePage;
