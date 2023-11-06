const highscoresContainer = document.querySelector("#highscoresContainer");
const highscoresList = document.querySelector("#highscoresList");

let sviRezultati;
let sviRez;

try {
  sviRezultati = localStorage.getItem("Rezultati");
  if (sviRezultati === null) {
    throw new Error("Istorijat je prazan!");
  }
  sviRez = sviRezultati.split(",");

  sviRez.forEach((element) => {
    highscoresList.insertAdjacentHTML(
      "afterbegin",
      `
        <li>skor: ${element}</li>
        `
    );
  });
} catch (error) {
  console.log(error);
  highscoresContainer.insertAdjacentText("afterbegin", error);
}
