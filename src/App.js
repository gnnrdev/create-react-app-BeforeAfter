import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import logo from './logo.svg';
import './App.css';

class LambdaDemo extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false, msg: null };
    }

    handleClick = (api) => (e) => {
        e.preventDefault();

        this.setState({ loading: true });
        fetch('/.netlify/functions/' + api)
            .then((response) => response.json())
            .then((json) => this.setState({ loading: false, msg: json.msg }));
    };

    render() {
        const { loading, msg } = this.state;

        return (
            <p>
                <button onClick={this.handleClick('hello')}>
                    {loading ? 'Loading...' : 'Call Lambda'}
                </button>
                <button onClick={this.handleClick('async-dadjoke')}>
                    {loading ? 'Loading...' : 'Call Async Lambda'}
                </button>
                <br />
                <span>{msg}</span>
            </p>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameInProgress: false,
            victory: false,
            loading: false,
            errorInit: null,
            correctWord: null,
            wordDef: null,
            answerDefinition: null,
            guesses: [],
            beforeOrAfter: null,
            inputText: '',
            comment: null,
        };
    }

    startGame = () => {
        const DICTIONARY_KEY = 'ed334f48-572c-4ed2-982f-dabb1eb8e76e';
        const randomWordUrl = 'https://random-word-api.herokuapp.com/word';
        const dictionaryUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        fetch(randomWordUrl)
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log('Recieved Word Result:', result);
                    const word = result[0];
                    fetch(dictionaryUrl + word)
                        .then((res) => res.json())
                        .then(
                            (defResult) => {
                                console.log('Recieved Defintion Result:', defResult);
                                this.setState({
                                    correctWord: word,
                                    wordDef: defResult[0],
                                    loading: false,
                                    errorInit: null,
                                });
                            },
                            (error) => {
                                console.error('Recieved Error from Dictionary:', error);
                                this.setState({
                                    errorInit: true,
                                    loading: false,
                                    correctWord: null,
                                    wordDef: null,
                                });
                            }
                        );
                },
                (error) => {
                    console.error('Recieved Error from Word Generator:', error);
                    this.setState({
                        errorInit: true,
                        loading: false,
                        correctWord: null,
                        wordDef: null,
                    });
                }
            );

        this.setState({
            gameInProgress: true,
            loading: true,
            victory: false,
            correctWord: null,
            comment: null,
            guesses: [],
        });
    };

    handleGuess = (e) => {
        e.preventDefault();
        const guess = this.state.inputText.toLowerCase();
        var beforeAfter = null;
        if (this.state.correctWord == guess) {
            this.setState({ victory: true, gameInProgress: false });
        } else if (this.state.correctWord > guess) {
            beforeAfter = 'AFTER';
        } else {
            beforeAfter = 'BEFORE';
        }
        this.setState({
            guesses: [...this.state.guesses, this.state.inputText],
            inputText: '',
            beforeOrAfter: beforeAfter,
            comment: this.generateRandomComment(),
        });
    };

    updateInput = (e) => {
        this.setState({ inputText: e.target.value });
    };

    generateRandomComment = () => {
        const responses = [
            'Nice guess, dummy',
            "Hey, you'll get em next time, pal",
            'LOL did you actually think that was it??',
            'Worst guess NA',
            'Nice guess, idiot',
            'Jumper caabbllessssssssss',
            'Do you even CARE about your body?',
            'DJ SHOOOWWWWWWWWWWWSSSS',
            '8=======D',
            'GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO',
            "Let's Riiiiiiiddeeeeee",
            'Cabo waaabbooooo',
            '48 points for calling Gunnar feminine',
            'BUT BANANA BREAD, AT WORK',
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    render() {
        const stateDebug = (
            <div id='debugger'>
                <p>Current state: {JSON.stringify(this.state)}</p>
            </div>
        );
        var displayDiv = (
            <div id='gameInstructions'>
                <Typography variant='h2'>How to play:</Typography>
                <Typography variant='body1'>
                    I will select a random word from the English dictionary. Your job is to guess my
                    word in as few guesses as possible.
                </Typography>
                <Typography variant='body1'>
                    When you guess a word, I will tell you whether my word comes BEFORE or AFTER the
                    word you guessed in the dictionary.
                </Typography>
                <Typography variant='body1'>Simple enough. Good luck!</Typography>
                <Button onClick={this.startGame} variant='contained' size='large'>
                    Start the game!
                </Button>
            </div>
        );

        if (this.state.loading) {
            displayDiv = <p>Loading...</p>;
        } else if (this.state.errorInit) {
            displayDiv = (
                <div>
                    <Typography variant='h5'>Sorry, unable to initalize the game</Typography>
                    <Button onClick={this.startGame} variant='contained' size='large'>
                        Retry
                    </Button>
                </div>
            );
        } else if (this.state.gameInProgress) {
            displayDiv = (
                <div id='gameDiv'>
                    {this.state.guesses.length == 0 ? (
                        <Typography variant='body1'>I have chosen my word.</Typography>
                    ) : (
                        <>
                            <Typography variant='body1'>
                                Guesses: {this.state.guesses.length}
                            </Typography>
                            <Typography variant='body1'>
                                My word is <b>{this.state.beforeOrAfter}</b> the word{' '}
                                <b>{this.state.guesses[this.state.guesses.length - 1]}</b>.
                            </Typography>
                        </>
                    )}
                    <Box
                        component='form'
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete='off'
                        onSubmit={this.handleGuess}
                    >
                        <TextField
                            id='outlined-basic'
                            label='Type your word'
                            variant='outlined'
                            autoFocus
                            value={this.state.inputText}
                            onChange={this.updateInput}
                        />
                        <Button onClick={this.handleGuess} variant='contained' size='large'>
                            Guess
                        </Button>
                    </Box>

                    {this.state.comment ? (
                        <Typography variant='body1'>
                            {' '}
                            <i>{this.state.comment}</i>
                        </Typography>
                    ) : (
                        ''
                    )}
                </div>
            );
        } else if (this.state.victory) {
            displayDiv = this.getVictoryDisplay();
        }
        return (
            <div className='App'>
                <Typography variant='h1'>Before Or After word game!</Typography>
                {displayDiv}
                {stateDebug}
                <footer>
                    <Typography variant='body2'>Made w/ ♥️ for Austie</Typography>
                    <Typography variant='body2'>By TrainBoi 👨🏽‍🦲🚂🚃🚃🚃🚃🚃🚃🚃</Typography>
                </footer>
            </div>
        );
    }

    getVictoryDisplay = () => {
        // Parse dictionary result

        return (
            <div>
                <Typography variant='h3'>Victory!!</Typography>
                <Typography variant='body1'>
                    The correct word was <b>{this.state.correctWord}</b>
                </Typography>
                <Typography variant='body1'>
                    You got it after {this.state.guesses.length} guesses
                </Typography>
                <Typography variant='h6'>Definition:</Typography>
                <Typography variant='body1'>{'DEFINITION COMING SOON :)'} </Typography>

                <Button onClick={this.startGame} variant='contained' size='large'>
                    Play Again
                </Button>
            </div>
        );
    };
}

export default App;
