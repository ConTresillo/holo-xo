{
const { WIN_LINES } = typeof module !== 'undefined' ? require('./game.js') : window.HoloXO;

function winningMove(board, mark) {
  for (const line of WIN_LINES) {
    const cells = line.map(i => board[i]);
    if (cells.filter(v => v === mark).length === 2 && cells.includes(null)) return line[cells.indexOf(null)];
  }
  return null;
}

function available(board) { return board.map((cell, i) => cell ? -1 : i).filter(i => i >= 0); }

function minimax(board, maximizing, botMark, humanMark, alpha, beta) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      const score = board[a] === botMark ? 10 : -10;
      return score - (9 - board.filter(Boolean).length) * Math.sign(score);
    }
  }
  const moves = available(board);
  if (!moves.length) return 0;
  if (maximizing) {
    let best = -Infinity;
    for (const i of moves) {
      board[i] = botMark;
      best = Math.max(best, minimax(board, false, botMark, humanMark, alpha, beta));
      board[i] = null;
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  }
  let best = Infinity;
  for (const i of moves) {
    board[i] = humanMark;
    best = Math.min(best, minimax(board, true, botMark, humanMark, alpha, beta));
    board[i] = null;
    beta = Math.min(beta, best);
    if (beta <= alpha) break;
  }
  return best;
}

function chooseMove(board, level, botMark = 'O', random = Math.random) {
  const legal = available(board);
  if (!legal.length) return null;
  if (level === 'easy') return legal[Math.floor(random() * legal.length)];
  if (level === 'medium') {
    const win = winningMove(board, botMark);
    if (win !== null) return win;
    const block = winningMove(board, botMark === 'X' ? 'O' : 'X');
    if (block !== null) return block;
    return legal[Math.floor(random() * legal.length)];
  }
  let best = -Infinity;
  let choices = [];
  for (const i of legal) {
    board[i] = botMark;
    const value = minimax(board, false, botMark, botMark === 'X' ? 'O' : 'X', -Infinity, Infinity);
    board[i] = null;
    if (value > best) { best = value; choices = [i]; }
    else if (value === best) choices.push(i);
  }
  return choices[Math.floor(random() * choices.length)];
}

if (typeof module !== 'undefined') module.exports = { chooseMove, winningMove };
else Object.assign(window.HoloXO, { chooseMove, winningMove });
}
