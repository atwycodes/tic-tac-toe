/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */

const Player = (sign) => {
  this.sign = sign
   
  const getSign = () => sign
  
  return {
    getSign
  }
}

const Gameboard = (() => {
  const board = ['','','','','','','','',''];
  
  const setTile = (index, sign) => {
    board[index] = sign
  }

  const getTile = (index) => board[index]

  const getBoard = () => board

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = ''
    }
  }

  const getEmptyIndex = () => {
    const emptyIndex = board.reduce((accumulator, current, index) => {
      if (current === '') {
        accumulator.push(index)
      }
      return accumulator
    },[])
    return emptyIndex
  }

  return {
    setTile,
    getTile,
    getBoard,
    getEmptyIndex,
    reset
  }

})();

const GameController = (() => {
  const player = Player('X')
  const computer = Player('O')

  const getPlayerSign = () => player.getSign()

  const checkWinner = () => {
    const boardState = Gameboard.getBoard()
    const winningConditionIndex = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    let checkingArray = []
    let winner = ''
    
    for (i = 0; i < winningConditionIndex.length; i++) {
      for (j = 0; j < 3; j++) {
        checkingArray.push(boardState[winningConditionIndex[i][j]])
      }
      if (checkingArray.every((field) => field === 'X')) {
        winner = 'X'
        return winner
      }
      if (checkingArray.every((field) => field === 'O')) {
        winner = 'O'
        return winner
      }
      checkingArray = []
    }
    return winner
  }

  const computerTurn = () => {
    if (checkWinner() === 'X' || checkWinner() === 'O') {
      return
    } 
    const emptyIndex = Gameboard.getEmptyIndex()
    const i = Math.floor(Math.random() * Gameboard.getEmptyIndex().length)
    Gameboard.setTile(emptyIndex[i], computer.getSign())
  }

  const playerTurn = (element) => {
    if (checkWinner() === 'X' || checkWinner() === 'O') {
      return
    } 
    Gameboard.setTile(element.dataset.index,getPlayerSign())
  }


  const playRound = (element) => {
    playerTurn(element)
    computerTurn()
  }

  return {
    getPlayerSign,
    checkWinner,
    playRound
  }
})();

const DisplayController = (() => {
  const gameTiles = Array.from(document.querySelectorAll('.gameboard__tile'))
  const statusMessage = document.querySelector('.status-message')

  const updateDisplay = () => {
    for (let i = 0; i < gameTiles.length ; i++ ) {
      gameTiles[i].textContent = Gameboard.getTile(i);
    }
  }   
  
  const setStatusMessage = () => {
    statusMessage.textContent = ''
    displayWinner()
  }

  const displayWinner = () => {
    if (GameController.checkWinner() === 'X') {
      statusMessage.textContent = 'X is the winner!'
    }
    if (GameController.checkWinner() === 'O') {
      statusMessage.textContent = 'O is the winner!'
    }
  }

  gameTiles.forEach( (tile) => {
    tile.addEventListener('click' , () => {
      if (tile.textContent) {
        return
      }
      GameController.playRound(tile)
      updateDisplay()
      setStatusMessage()
    })
  })
  
  return {
    updateDisplay,
    displayWinner,
  }
})();

DisplayController.updateDisplay()

// ------------------------------------------------------------- 