import React, {useCallback, useEffect, useMemo, useState} from 'react';
import "./TicTacToe.css"

const PlayerSymbols = {
  PLAYER_1: "X",
  PLAYER_2: "O"
}
/*
*
* 0 1 2
* 3 4 5
* 6 7 8
*
* */
const TicTacToe = () => {
  const getDefaultBoardData = () => {
    return new Array(9).fill().map((_, index) => {
      return {
        id: index + 1,
        value: ''
      }
    })
  }

  const resetBoard = () => {
    setBoardCellData(getDefaultBoardData());
    setWinnerText(null);
    setHiglightedBox([]);
  }

  const [boardCellData, setBoardCellData] = useState(getDefaultBoardData());
  const [higlightedBox, setHiglightedBox] = useState([]);
  const [winnerText, setWinnerText] = useState(null);
  const [winHistory, setWinHistory] = useState([]);
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);


  const handleCellClick = useCallback(
    (index) => {
      if(winnerText) return;
      let newValue;
      if (isPlayer1Turn) {
        newValue = PlayerSymbols.PLAYER_1
      } else {
        newValue = PlayerSymbols.PLAYER_2
      }
      setBoardCellData((old) => {
        return [...old.slice(0, index), {
          ...old[index],
          value: newValue
        }, ...old.slice(index + 1, old.length)]
      })
      setIsPlayer1Turn(old => !old)
    },
    [isPlayer1Turn, winnerText],
  );

  const getBotMove = useCallback(
    () => {
      // Try to see if bot can win
      let canWin = null;
      for (let i = 0; i < 3; i++) {
        if (i < 3) {
          if ((boardCellData[i] === boardCellData[i + 3]) && (boardCellData[i + 3] === boardCellData[i + 6])) {
            rowWin = i;
            break;
          }
        }
        if (i % 3 === 0) {
          if (boardCellData[i] === boardCellData[i + 1] && boardCellData[i + 1] === boardCellData[i + 2]) {
            columnWin = i
            break;
          }
        }
      }
    },
    [boardCellData],
  );


  const checkBoardForWin = useCallback(() => {
    let rowWin = null;
    let columnWin = null;
    for (let i = 0; i < 3; i++) {
      if (i < 3 && boardCellData[i].value) {
        if ((boardCellData[i].value === boardCellData[i + 3].value) && (boardCellData[i + 3].value === boardCellData[i + 6].value)) {
          rowWin = i;
          break;
        }
      }
      if (i % 3 === 0 && boardCellData[i].value) {
        if (boardCellData[i].value === boardCellData[i + 1].value && boardCellData[i + 1].value === boardCellData[i + 2].value) {
          columnWin = i
          break;
        }
      }
    }
    if (rowWin != null) {
      return {
        type: "OVER",
        winner: boardCellData[rowWin].value,
        winnerIndices: [rowWin, rowWin + 3, rowWin + 6]
      }
    }
    if (columnWin != null) {
      return {
        type: "OVER",
        winner: boardCellData[columnWin].value,
        winnerIndices: [columnWin, columnWin + 1, columnWin + 2]
      }
    }
    if ((boardCellData[0].value === boardCellData[4].value) && (boardCellData[4].value === boardCellData[8].value) && boardCellData[4].value) {
      return {
        type: "OVER",
        winner: boardCellData[0].value,
        winnerIndices: [0, 4, 8]
      }
    }
    if((boardCellData[2].value === boardCellData[4].value) && (boardCellData[4].value === boardCellData[6].value) && boardCellData[4].value) {
      return {
        type: "OVER",
        winner: boardCellData[0].value,
        winnerIndices: [2, 4, 6]
      }
    }
    if(boardCellData.find(e => !e.value)) return null;
    return {
      type: "OVER",
      winner: null
    }
  }, [boardCellData]);


  useEffect(() => {
    let result = checkBoardForWin();
    if(!result) return;
    if(result?.type === "OVER") {
      setWinHistory(old => [...old, result])
      if(result?.winner) {
        setWinnerText(`The winner is ${result?.winner === PlayerSymbols.PLAYER_1 ? "Player" : "Bot"}`)
        setHiglightedBox(result?.winnerIndices)
      } else {
        setWinnerText("The game is draw")
      }
    }
  }, [boardCellData, checkBoardForWin]);

  return (
    <div className={'tic-tac-toe-game'}>
      <div className={'header'}>
        {winnerText ? ` ${winnerText}` : ''}
        <button onClick={resetBoard}>Reset</button>
      </div>
      <div className={'main-content'}>
        <div className={'game-board'}>
          {boardCellData.map((item, index) => {
              return <div onClick={() => handleCellClick(index)}
                          key={item?.id} id={`game-board-cell-${index + 1}`}
                          className={`game-board-cell ${higlightedBox?.[0]=== index || higlightedBox?.[1]=== index || higlightedBox?.[2] === index ? "highlighted-cell" : ""}`}>{item.value}</div>
            }
          )}
        </div>
      </div>
      <div className={'footer'}>
        <div>Win History</div>
        <div style={{display: "flex", flexDirection: "column"}}>
          {winHistory.map(ele => {
            if(ele.winner) {
              if(ele.winner === PlayerSymbols.PLAYER_1) return <div> Player 1</div>
              else return <div> Bot</div>
            } else {
              return <div>Draw</div>
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
