const assert = require('node:assert/strict');
const {test} = require('node:test');
const {makeGame, getResult} = require('../public/js/game.js');
const {chooseMove} = require('../public/js/bot.js');
const {classifyStroke, pointCell, validCellStroke} = require('../public/js/strokes.js');

test('game rejects illegal and out-of-turn moves', () => {
  const g=makeGame();assert.equal(g.move(-1),false);assert.equal(g.move(9),false);assert.equal(g.move(0,'O'),false);assert.equal(g.move(0),true);assert.equal(g.move(0),false);assert.equal(g.current,'O');
});
test('detects every winning line and a full-board draw', () => {
  for(const line of [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]){const b=Array(9).fill(null);line.forEach(i=>b[i]='X');assert.equal(getResult(b).winner,'X');assert.deepEqual(getResult(b).line,line);}
  assert.deepEqual(getResult(['X','O','X','X','O','O','O','X','X']),{winner:null,line:null,draw:true});
});
test('game locks after win and reset starts X with empty cells', () => {
 const g=makeGame();[0,3,1,4,2].forEach(i=>g.move(i));assert.equal(g.result.winner,'X');assert.equal(g.move(5),false);g.reset();assert.equal(g.current,'X');assert.equal(g.result,null);assert.ok(g.board.every(v=>v===null));
});
test('easy bot chooses legal cells; medium bot wins and blocks', () => {
 assert.ok([2,5,6,7,8].includes(chooseMove(['X','O',null,'O','X',null,null,null,null],'easy','O',()=>0)));
 assert.equal(chooseMove(['O','O',null,'X','X',null,null,null,null],'medium','O',()=>.8),2);
 assert.equal(chooseMove(['X','X',null,'O',null,null,null,null,null],'medium','O',()=>.8),2);
});
test('minimax bot takes a forced win and never loses to optimal play', () => {
 assert.equal(chooseMove(['O','O',null,'X','X',null,null,null,null],'hard','O'),2);
 function play(board,turn){const result=getResult(board);if(result)return result.winner==='O'?1:result?.draw?0:-1;if(turn==='O'){for(const i of board.map((x,i)=>x?null:i).filter(x=>x!==null)){board[i]='O';const v=play(board,'X');board[i]=null;if(v===1)return 1;}return 0;}let worst=1;for(const i of board.map((x,i)=>x?null:i).filter(x=>x!==null)){board[i]='X';worst=Math.min(worst,play(board,'O'));board[i]=null;if(worst===-1)return -1;}return worst;}
 for(let first=0;first<9;first++){const b=Array(9).fill(null);b[first]='X';while(!getResult(b)){const turn=b.filter(Boolean).length%2===1?'O':'X';const move=turn==='O'?chooseMove(b,'hard','O',()=>.4):b.findIndex(v=>v===null);if(move<0)break;b[move]=turn;}assert.notEqual(getResult(b)?.winner,'X');}
});
test('stroke recognizer accepts clean X and O; rejects short path', () => {
 const x=[{x:.1,y:.1},{x:.35,y:.35},{x:.65,y:.65},{x:.9,y:.9},{x:.1,y:.9},{x:.35,y:.65},{x:.65,y:.35},{x:.9,y:.1}];
 const o=Array.from({length:24},(_,i)=>({x:.5+.38*Math.cos(i/24*Math.PI*2),y:.5+.38*Math.sin(i/24*Math.PI*2)}));
 assert.equal(classifyStroke(x),'X');assert.equal(classifyStroke(o),'O');assert.equal(classifyStroke([{x:.1,y:.1},{x:.11,y:.11}]),null);
});
test('stroke stays inside a single cell and point maps correctly', () => {
 const rect={left:100,top:50,width:300,height:300};assert.equal(pointCell({x:110,y:60},rect),0);assert.equal(pointCell({x:290,y:240},rect),4);assert.equal(pointCell({x:401,y:60},rect),null);assert.equal(validCellStroke([{x:110,y:60},{x:190,y:140}],0,rect),true);assert.equal(validCellStroke([{x:110,y:60},{x:205,y:140}],0,rect),false);
});
