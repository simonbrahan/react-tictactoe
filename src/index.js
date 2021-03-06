import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={ props.onClick }
    >
      { props.value }
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={ this.props.squares[i] }
      onClick={ () => this.props.onClick(i) }
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: false
    };
  }

  nextPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  handleClick(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // If game is over or square is filled, ignore click
    if (calculateWinner(squares) || squares[i]) {
        return;
    }

    squares[i] = this.nextPlayer();
    history.push({ squares: squares });

    this.setState({
      history: history,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length - 1
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 1
    });
  }

  render() {
    const current = this.state.history[this.state.stepNumber]
    const winner = calculateWinner(current.squares);

    const status = winner ?
        'Winner: ' + winner :
        'Next player: ' + this.nextPlayer();

    const moves = this.state.history.map((squares, idx) => {
        const desc = idx ?
            'Go to move #' + idx :
            'Clear board';

        return (
            <li key={ idx }>
                <button onClick={ () => this.jumpTo(idx) }>{ desc }</button>
            </li>
        );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            onClick={ (i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
    const possibleLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i=0; i<possibleLines.length; i++) {
        const [a, b, c] = possibleLines[i];
        // If first square has been filled in, and all squares match, we have a winner!
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    // If not, we don't.
    return null;
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

