import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        //The square that is rendered is a button, named square, with an onClick event that triggers the props's onClick function , and displays the props value
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
            //renders the square with the proper value that is defined below
                value={this.props.squares[i]}
                //chains the onClick to the parent component which will define what to do with onClick
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            //renders a board of 9 tiles, hard coded
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
    //constructor for properties
    constructor(props) {
        super(props);
        this.state = {
            //creates a history of arrays that will allow us to undo steps
            history: [{
                squares: Array(9).fill(null),
            }],
            //the following two lines helps us ensure that turns are properly rotating
            stepNumber: 0,
            xIsNext: true
        };
    }

    //the main handleClick function that will give behavior to the previous onClick events
    handleClick(i) {
        //this fills our history array with a save state of each turn as they occur (saves the state of the overall array of the board)
        //slicing is how we can duplicate an array without mutating it
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        //this tells us which array index we are currently on in the most recent turn
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        //if the calculateWinner function finds a winner, clicks will not return anything in order for the game to stop.
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        //if X is not next, then O is the next state for the square.
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //add the current state of the square array to history array.
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            //this ensures that X and O is always switching.
            xIsNext: !this.state.xIsNext,
        });
    }

    //this function allows the jumpTo button to go back to a specific move.
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext:(step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        //mapping the moves allows us to properly jump to the correct move via the key, as stored by React.
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares ={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

//calculates the winner by hard coding potential winning lines
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    //if any of the above lines have matching statuses, then the winner is declared.
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
