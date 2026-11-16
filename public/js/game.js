{
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getResult(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every(Boolean)) return { winner: null, line: null, draw: true };
  return null;
}

function makeGame() {
  let board = Array(9).fill(null);
  let current = 'X';
  let result = null;
  let scoreCounted = false;
  return {
    get board() { return board.slice(); },
    get current() { return current; },
    get result() { return result; },
    get scoreCounted() { return scoreCounted; },
    markScoreCounted() { if (!result || scoreCounted) return false; scoreCounted = true; return true; },
    move(index, mark = current) {
      if (result || !Number.isInteger(index) || index < 0 || index > 8 || board[index] || mark !== current) return false;
      board[index] = mark;
      result = getResult(board);
      if (!result) current = current === 'X' ? 'O' : 'X';
      return true;
    },
    reset() { board = Array(9).fill(null); current = 'X'; result = null; scoreCounted = false; },
  };
}

if (typeof module !== 'undefined') module.exports = { WIN_LINES, getResult, makeGame };
else window.HoloXO = { WIN_LINES, getResult, makeGame };
}
