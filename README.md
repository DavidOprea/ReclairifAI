# <img src="https://github.com/DavidOprea/ReclairifAI/blob/master/src/assets/logo.svg">


ReclairifAI is a match game for learning which changes the match definitions with AI, eliminating relying on pattern-recognition to beat the game.

Other match games like Quizlet match eventually devolve into using pattern-recognition, such as memorizing the *shape* of the text instead of the actual meaning/information inside the text. This makes the learning become incredibly inefficient.

We fix this by using ChatGPT to change the match text while keeping the core information. This removes pattern-recognition and forces users to learn the material thoroughly in order to beat the game as fast as possible.

## Installation

```
pip install openai
pip install Flask
pip install flask-cors
```

## Usage
Get a ChatGPT API key

Open .env and replace YOUR_API_KEY with your key

Navigate into the ReclarifAI folder and run:

```
python app.py
```

## Local usage

Get a ChatGPT API key

Open .env and replace YOUR_API_KEY with your key

Have Node.js installed

```
npm install
```

To run, use

```
python app.py
npm run dev
```
