const sections = {
  suma: {
    title: 'Suma',
    description:
      'En esta sección podrás practicar operaciones de suma con números de distinto nivel.'
  },
  resta: {
    title: 'Resta',
    description:
      'Aquí encontrarás ejercicios para resolver diferencias y mejorar tu precisión.'
  },
  multiplicacion: {
    title: 'Multiplicación',
    description:
      'Practica tablas y productos para desarrollar rapidez mental.'
  },
  division: {
    title: 'División',
    description:
      'Aprende a repartir cantidades de forma clara y ordenada.'
  },
  trigonometria: {
    title: 'Trigonometría',
    description:
      'Explora las funciones trigonométricas con ejemplos visuales y sencillos.'
  },
  figuras: {
    title: 'Figuras geométricas',
    description:
      'Descubre cómo calcular áreas, perímetros y propiedades de las figuras.'
  }
};

const cards = document.querySelectorAll('.card');
const title = document.getElementById('section-title');
const description = document.getElementById('section-description');
const startButton = document.getElementById('start-quiz-btn');
const quizArea = document.getElementById('quiz-area');
const resultArea = document.getElementById('result-area');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const timerDisplay = document.getElementById('timer');

let selectedSection = 'suma';
let quizState = null;
let timerId = null;

function updateSection(sectionKey) {
  selectedSection = sectionKey;
  const selected = sections[sectionKey];
  title.textContent = selected.title;
  description.textContent = selected.description;
  resultArea.classList.add('hidden');
  quizArea.classList.add('hidden');
  feedback.textContent = '';
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildOptions(correct, min, max) {
  const options = new Set([correct]);
  while (options.size < 4) {
    options.add(getRandomInt(min, max));
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}

function generateQuestions(sectionKey) {
  const questions = [];

  if (sectionKey === 'suma') {
    for (let i = 0; i < 30; i += 1) {
      const a = getRandomInt(10, 99);
      const b = getRandomInt(10, 99);
      const answer = a + b;
      questions.push({
        prompt: `${a} + ${b} = ?`,
        answer,
        options: buildOptions(answer, 20, 200)
      });
    }
  }

  if (sectionKey === 'resta') {
    for (let i = 0; i < 30; i += 1) {
      const a = getRandomInt(20, 120);
      const b = getRandomInt(5, a - 1);
      const answer = a - b;
      questions.push({
        prompt: `${a} - ${b} = ?`,
        answer,
        options: buildOptions(answer, 1, 120)
      });
    }
  }

  if (sectionKey === 'multiplicacion') {
    for (let i = 0; i < 30; i += 1) {
      const a = getRandomInt(2, 12);
      const b = getRandomInt(2, 12);
      const answer = a * b;
      questions.push({
        prompt: `${a} × ${b} = ?`,
        answer,
        options: buildOptions(answer, 1, 144)
      });
    }
  }

  if (sectionKey === 'division') {
    for (let i = 0; i < 30; i += 1) {
      const divisor = getRandomInt(2, 12);
      const quotient = getRandomInt(2, 12);
      const dividend = divisor * quotient;
      questions.push({
        prompt: `${dividend} ÷ ${divisor} = ?`,
        answer: quotient,
        options: buildOptions(quotient, 1, 20)
      });
    }
  }

  if (sectionKey === 'trigonometria') {
    const baseQuestions = [
      { prompt: '¿Cuál es el valor de sin(30°)?', answer: '1/2', options: ['1/2', '√3/2', '1', '0'] },
      { prompt: '¿Cuál es el valor de cos(60°)?', answer: '1/2', options: ['1/2', '√2/2', '√3/2', '1'] },
      { prompt: '¿Cuál es el valor de tan(45°)?', answer: '1', options: ['1', '0', '√3', '√2'] },
      { prompt: '¿Cuál es el valor de sin(90°)?', answer: '1', options: ['1', '0', '-1', '1/2'] },
      { prompt: '¿Cuál es el valor de cos(0°)?', answer: '1', options: ['1', '0', '-1', '√3/2'] },
      { prompt: '¿Cuál es el valor de tan(0°)?', answer: '0', options: ['0', '1', '√3', '∞'] },
      { prompt: '¿Cuál es el valor de sin(60°)?', answer: '√3/2', options: ['√3/2', '1/2', '√2/2', '0'] },
      { prompt: '¿Cuál es el valor de cos(45°)?', answer: '√2/2', options: ['√2/2', '1/2', '1', '√3/2'] },
      { prompt: '¿Cuál es el valor de tan(60°)?', answer: '√3', options: ['√3', '1/√3', '0', '1'] },
      { prompt: '¿Cuál es el valor de sin(0°)?', answer: '0', options: ['0', '1', '1/2', '-1'] }
    ];

    for (let i = 0; i < 30; i += 1) {
      questions.push(baseQuestions[i % baseQuestions.length]);
    }
  }

  if (sectionKey === 'figuras') {
    const baseQuestions = [
      { prompt: '¿Cuál es el área de un rectángulo de 6 cm por 4 cm?', answer: '24 cm²', options: ['24 cm²', '20 cm²', '10 cm²', '16 cm²'] },
      { prompt: '¿Cuál es el perímetro de un cuadrado de lado 5 cm?', answer: '20 cm', options: ['20 cm', '10 cm', '25 cm', '15 cm'] },
      { prompt: '¿Cuántos lados tiene un hexágono?', answer: '6', options: ['6', '5', '7', '8'] },
      { prompt: '¿Cuál es el área de un triángulo de base 8 cm y altura 5 cm?', answer: '20 cm²', options: ['20 cm²', '40 cm²', '10 cm²', '30 cm²'] },
      { prompt: '¿Cuál es el perímetro de un triángulo equilátero de lado 7 cm?', answer: '21 cm', options: ['21 cm', '14 cm', '28 cm', '35 cm'] },
      { prompt: '¿Cuál es el área de un cuadrado de lado 9 cm?', answer: '81 cm²', options: ['81 cm²', '36 cm²', '18 cm²', '72 cm²'] },
      { prompt: '¿Qué figura tiene 4 lados iguales y 4 ángulos rectos?', answer: 'Cuadrado', options: ['Cuadrado', 'Triángulo', 'Círculo', 'Rombo'] },
      { prompt: '¿Cuál es el número de diagonales de un cuadrado?', answer: '2', options: ['2', '3', '4', '1'] }
    ];

    for (let i = 0; i < 30; i += 1) {
      questions.push(baseQuestions[i % baseQuestions.length]);
    }
  }

  return questions;
}

function renderQuestion() {
  const currentQuestion = quizState.questions[quizState.currentIndex];
  if (!currentQuestion) {
    finishQuiz();
    return;
  }

  questionCounter.textContent = `Pregunta ${quizState.currentIndex + 1}/30`;
  questionText.textContent = currentQuestion.prompt;
  optionsContainer.innerHTML = '';
  feedback.textContent = '';

  currentQuestion.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.addEventListener('click', () => answerQuestion(option));
    optionsContainer.appendChild(button);
  });
}

function answerQuestion(selectedOption) {
  const currentQuestion = quizState.questions[quizState.currentIndex];
  const isCorrect = selectedOption === currentQuestion.answer;
  if (isCorrect) {
    quizState.score += 1;
    feedback.textContent = 'Correcto';
    feedback.className = 'feedback correct';
  } else {
    feedback.textContent = `Incorrecto. La respuesta correcta era ${currentQuestion.answer}`;
    feedback.className = 'feedback incorrect';
  }

  setTimeout(() => {
    quizState.currentIndex += 1;
    renderQuestion();
  }, 700);
}

function startQuiz(sectionKey) {
  if (timerId) {
    clearInterval(timerId);
  }

  quizState = {
    sectionKey,
    questions: generateQuestions(sectionKey),
    currentIndex: 0,
    score: 0,
    timeLeft: 60
  };

  quizArea.classList.remove('hidden');
  resultArea.classList.add('hidden');
  feedback.className = 'feedback';
  timerDisplay.textContent = '60s';
  renderQuestion();

  timerId = setInterval(() => {
    quizState.timeLeft -= 1;
    timerDisplay.textContent = `${quizState.timeLeft}s`;

    if (quizState.timeLeft <= 0) {
      clearInterval(timerId);
      finishQuiz('¡Se acabó el tiempo!');
    }
  }, 1000);
}

function finishQuiz(message = 'Prueba finalizada') {
  clearInterval(timerId);
  quizArea.classList.add('hidden');
  resultArea.classList.remove('hidden');
  resultArea.innerHTML = `
    <h4>${message}</h4>
    <p>Obtuviste ${quizState.score} respuestas correctas de 30.</p>
    <p>Tu porcentaje fue ${Math.round((quizState.score / 30) * 100)}%.</p>
    <button class="start-btn" onclick="startQuiz('${selectedSection}')">Intentar de nuevo</button>
  `;
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    cards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');

    const key = card.dataset.section;
    updateSection(key);
    selectedSection = key;
  });
});

startButton.addEventListener('click', () => {
  startQuiz(selectedSection);
});

updateSection(selectedSection);
