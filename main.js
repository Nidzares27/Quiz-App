let gameContainer = document.querySelector(".gameContainer");
let qAndA = document.querySelector("#qAndA");
let questn = document.querySelector("#questn");
let nextQuestBtn = document.querySelector("#nextQuestBtn");
let skelet = document.querySelector("#skelet");
let redniBrPitanja = document.querySelector("#redniBrPitanja");
let b2HP = document.querySelector("#b2HP");

let elementiKviza;
let odgovoriNaPitanja;
let pitanjeNaRedu;
let brTacnihOdgovora;
let brOdgovoraNaPitanje;
let scores = [];
let sviRezultati;

let elem = document.getElementById("myBar");
let width = 0;
elem.style.width = width + "%";

if (localStorage.getItem("Rezultati")) {
  sviRezultati = localStorage.getItem("Rezultati");
  scores = sviRezultati.split(",");
}

let myVar;

function myFunction() {
  myVar = setTimeout(showPage, 3000);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

function getRandomItem(arr) {
  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  let item = arr.splice(randomIndex, 1);

  return item;
}

function renderAnswersOnRandomPositions() {
  brOdgovoraNaPitanje = odgovoriNaPitanja[pitanjeNaRedu]?.length;

  for (let index = 0; index < brOdgovoraNaPitanje; index++) {
    const element = getRandomItem(odgovoriNaPitanja[pitanjeNaRedu]);
    let skeleton = `
    <input type="radio" id="html" name="option" value="${element}" />
    <label for="html">${element}</label><br />
`;
    skelet.insertAdjacentHTML("afterbegin", skeleton);
  }
}

function move() {
  let id = setTimeout(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width += 10;
      elem.style.width = width + "%";
    }
  }
}

const fetchQuestions = async function () {
  try {
    const rq = await fetch(
      `https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple`
    );
    console.log(rq);
    const data = await rq.json();
    console.log(data.results);
    if (data.results.length == 0) {
      elem.classList.add("hidden");
      nextQuestBtn.classList.add("hidden");
      b2HP.classList.remove("hidden");
      throw new Error(
        "Doslo je do greske prilikom dobavljanja pitanja! Radimo na rijesavanju problema"
      );
    }

    function generisanjePitanjaOdgovora() {
      for (const iterator of data.results) {
        elementiKviza.push(iterator);
        odgovoriNaPitanja.push([
          ...iterator.incorrect_answers,
          iterator.correct_answer,
        ]);
      }
      console.log(elementiKviza);
      console.log(odgovoriNaPitanja);
    }

    function renderNextQuestion() {
      skelet.innerHTML = "";

      renderAnswersOnRandomPositions();
      questn.textContent = elementiKviza[pitanjeNaRedu]?.question;
    }

    function lastQuestion() {
      if (pitanjeNaRedu == elementiKviza.length) {
        questn.textContent = "";
        let skor = `${brTacnihOdgovora} / ${elementiKviza.length}`;
        skelet.innerHTML = `
            Game Over!
            Your Score: ${skor}        
          `;
        scores.push(skor);
        localStorage.setItem("Rezultati", scores);
        b2HP.classList.remove("hidden");
        nextQuestBtn.classList.add("hidden");
        questn.classList.add("hidden");
        return;
      }
    }

    elementiKviza = [];
    odgovoriNaPitanja = [];
    brTacnihOdgovora = 0;
    generisanjePitanjaOdgovora();
    nextQuestBtn.classList.remove("hidden");
    pitanjeNaRedu = 0;

    redniBrPitanja.innerHTML = `Pitanje: ${pitanjeNaRedu + 1} / ${
      elementiKviza.length
    } `;

    renderAnswersOnRandomPositions();
    questn.textContent = elementiKviza[pitanjeNaRedu].question;

    qAndA.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = new FormData(e.target);
      const entries = Object.fromEntries(data.entries());
      console.log(entries.option);

      if (entries.option === undefined) {
        return;
      }
      move();

      if (entries.option == elementiKviza[pitanjeNaRedu]?.correct_answer) {
        brTacnihOdgovora++;
        gameContainer.style.backgroundColor = "green";
        setTimeout(function () {
          gameContainer.style.backgroundColor = "white";
          if (pitanjeNaRedu != elementiKviza.length) {
            renderNextQuestion();
          } else {
            lastQuestion();
          }
        }, 200);
      } else {
        gameContainer.style.backgroundColor = "red";
        setTimeout(function () {
          gameContainer.style.backgroundColor = "white";
          if (pitanjeNaRedu != elementiKviza.length) {
            renderNextQuestion();
          } else {
            lastQuestion();
          }
        }, 200);
      }

      pitanjeNaRedu++;
      if (pitanjeNaRedu < elementiKviza.length) {
        redniBrPitanja.innerHTML = `Pitanje: ${pitanjeNaRedu + 1} / ${
          elementiKviza.length
        } `;
      }
    });
  } catch (error) {
    console.error(error);
    gameContainer.insertAdjacentText("afterbegin", error);
  }
};

fetchQuestions();
