// Ligne nécéssaire pour faire marcher le lecteur de pdf
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js';

let text = "Il y a environ 13,5 milliards d’années, la matière, l’énergie, le temps et l’espace apparaissaient à l’occasion du Big Bang. L’histoire de ces traits fondamentaux de notre univers est ce qu’on appelle la physique. Environ 300 000 ans après leur apparition, la matière et l’énergie commencèrent à se fondre en structures complexes, appelées atomes, lesquels se combinèrent ensuite en molécules. L’histoire des atomes, des molécules et de leurs interactions est ce qu’on appelle la chimie. Voici près de 3,8 milliards d’années, sur la planète Terre, certaines molécules s’associèrent en structures particulièrement grandes et compliquées : les organismes. L’histoire des organismes est ce qu’on appelle la biologie. Voici près de 70 000 ans, des organismes appartenant à l’espèce Homo sapiens commencèrent à former des structures encore plus élaborées : les cultures. Le développement ultérieur de ces cultures humaines est ce qu’on appelle l’histoire. Trois révolutions importantes infléchirent le cours de l’histoire. La Révolution cognitive donna le coup d’envoi à l’histoire voici quelque 70 000 ans. La Révolution agricole l’accéléra voici environ 12 000 ans. La Révolution scientifique, engagée voici seulement 500 ans, pourrait bien mettre fin à l’histoire et amorcer quelque chose d’entièrement différent. Ce livre raconte comment ces trois révolutions ont affecté les êtres humains et les organismes qui les accompagnent."

// Chaine de mots par defaut
let words = text.split(' ');

//  Nombre de mots dans words
let wordCount = 100;

// Nombre de mots tapés par l'utilisateur
let wordsCounter = 0;

// Nombre de caractères tapés correctement par l'utilisateur
let correctCounter = 0;

// Nombre de caractères tapés par l'utilisateur (corrects et incorrects)
let lettersCounter = 0;

// Curseur
const cursor = document.getElementById('cursor');   // Curseur



// Champ pour recevoir le fichier pdf
const inputPDF = document.getElementById('inputPDF');

// Vérifie si un pdf a été importé
inputPDF.addEventListener('change', function (event) {
    const file = event.target.files[0];


    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const buffer = e.target.result;

            traiterPDF(buffer)
                .then(function (textePDF) {
                    console.log(textePDF);
                    text = textePDF
                    newGame();
                })
                .catch(function (erreur) {
                    console.error(erreur);
                });
        };

        reader.readAsArrayBuffer(file);
    }
});

// Traitement du fichier pdf
function traiterPDF(buffer) {
    return new Promise((resolve, reject) => {
        pdfjsLib.getDocument({ data: buffer }).promise
            .then(function (pdf) {
                const promises = [];

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    promises.push(pdf.getPage(pageNum).then(function (page) {
                        return page.getTextContent();
                    }));
                }

                return Promise.all(promises);
            })
            .then(function (pageTextContents) {
                let textePDF = '';

                pageTextContents.forEach(function (textContent) {
                    textContent.items.forEach(function (item) {
                        // Ajoute un espace avant chaque mot sauf pour le premier mot
                        if (textePDF !== '' && item.str !== ' ') {
                            //textePDF += '';
                        }
                        textePDF += item.str;
                    });
                });

                resolve(textePDF);


            })
            .catch(function (erreur) {
                reject("Erreur lors du traitement du PDF : " + erreur);
            });
    });
}


const restartButton = document.getElementById('restart');

restartButton.addEventListener("click", ev => {
    newGame();
})




// Convertir les caractères spéciaux
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}


// Ajouter une classe a un élément
function addClass(el, name) {
    el.className += ' '+name;
}

// Retirer une classe a un élément
function removeClass(el, name) {
    el.className = el.className.replace(name, '');
}

// Formatage des mots
function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}






// Démarre le script
function newGame() {

    wordsCounter = 0;
    correctCounter = 0;
    lettersCounter =0;

    text = replaceAll(text, "’", "'");
<<<<<<< Updated upstream
    words = text.split(/\t| /);
=======

    const min = 0;
    const max = text.length - 700;
    console.log("max = " + max);
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;


    const newText = text.substring(randomInt);
    words = newText.split(/\t| |\n/);
>>>>>>> Stashed changes

    document.getElementById('words').innerHTML = '';
    for (let i=0; i<wordCount; i++) {
        if (words[i] !== '') {
            document.getElementById('words').innerHTML += formatWord(words[i]);
        }

    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');

    const firstLetter = document.querySelector('.letter')

    cursor.style.top = firstLetter.getBoundingClientRect().top + 8 + 'px';
    cursor.style.left = firstLetter.getBoundingClientRect().left + 'px';

    const game = document.getElementById('game')
    game.focus();
}


// Mise a jour du compteur de mots tapés par l'utilisateur
function updateWordCount(wordsCounter) {
    const el = document.getElementById('word-count');
    el.innerText = wordsCounter;
}

// Mise a jour de la précision de l'utilisateur
function updateAccuracy(correctCounter, lettersCounter) {
    const acc = Math.round((correctCounter * 100 / lettersCounter));
    const el = document.getElementById('accuracy');
    el.innerText = acc + '%';
}







// Logique
document.getElementById('game').addEventListener('keydown', ev => {
    const key = ev.key; // Touche entrée par l'utilisateur

    const currentWord = document.querySelector('.word.current');    // Mot à taper


    // Lettre à taper par l'utilisateur
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';


    // La touche entrée par l'utilisateur est une lettre (ou un chiffre)
    const isLetter = key.length === 1 && key !== ' ';

    // La touche entrée par l'utilisateur est la barre espace
    const isSpace = key === ' ';

    // La touche entrée par l'utilisateur est backspace
    const isBackspace = key === 'Backspace';

    // La lettre à taper est la première lettre d'un mot
    const isFirstLetter = currentLetter === currentWord.firstChild;

    // Champ contenant les mots à taper
    const words = document.getElementById('words');

    // Valeur de la marge. Nécéssaire pour le défilement
    const margin = parseInt(words.style.marginTop || 0);

    // La lettre à taper est la dernière lettre du texte
    const isLastLetterGlo = currentLetter === words.lastElementChild.lastElementChild;

    // La distance entre le prochain mot et le haut du cadre est assez élevée pour activer le scroll
    let farFromTop = 0;
    if (currentWord.nextElementSibling) {
        farFromTop = currentWord.nextElementSibling.getBoundingClientRect().top - words.getBoundingClientRect().top >= 135;
    } else {
        farFromTop = currentWord.getBoundingClientRect().top - words.getBoundingClientRect().top >= 135;

    }


    // L'utilisateur a tapé une lettre
    if (isLetter) {

        // Verifie si la currentLetter est la dernière lettre du texte et si l'utilisateur a bien tapé cemme ci
        if (isLastLetterGlo) {
            if (key === expected) {
                correctCounter++;
                console.log("fini");
                // Fin du texte
                // A compléter
            } else if (isSpace) {
                // Fin du texte
            }
        }

        lettersCounter++;
        // Cas 1 : L'utilisateur devais taper une lettre
        if (currentLetter) {

            // Vérifie si la touche entrée par l'utilisateur est la bonne
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');

            // Incrémentation du compteur de caractères corrects
            if (key === expected) {
                correctCounter++;
            }
            removeClass(currentLetter, 'current');

            // Change la lettre courante par la prochaine
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            // Cas 2 : L'utilisateur devais taper un espace
            // On ajoute donc les lettres en rouge à la fin du mot
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }


    // L'utilisateur doit entrer un espace
    if (isSpace) {
        wordsCounter++;
        // L'utilisateur ne devais pas taper un espace
        if (expected !== ' ') {
            // On invalide toutes les lettres du mot
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
                lettersCounter++;
            });
        }

        // On passe au mot suivant
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        let newLetter = currentWord.nextSibling.firstChild;
        addClass(newLetter, 'current');
    }



    // La touche tapé par l'utilisateur est backspace
    if (isBackspace) {

        // Cas 1 : On doit taper la première lettre d'un mot
        // Cas 2 : On est au milieu d'un mot
        // Cas 3 : On vient de taper la dernière lettre d'un mot
        if (currentLetter && isFirstLetter) {
            wordsCounter--;
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            cursor.style.top = currentWord.previousSibling.getBoundingClientRect().top + 8 + 'px';
            cursor.style.left = currentWord.previousSibling.getBoundingClientRect().right + 'px';
        } else if (currentLetter) {
            lettersCounter--;
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            if (currentLetter.previousElementSibling.classList.contains('correct')) {
                correctCounter--;
            }
            removeClass(currentLetter.previousSibling, 'correct');
            removeClass(currentLetter.previousSibling, 'incorrect');

        } else {
            lettersCounter--;
            addClass(currentWord.lastChild, 'current')
            if (currentWord.lastElementChild.classList.contains('extra')) {
                currentWord.lastElementChild.remove();
            } else {
                if (currentWord.lastElementChild.classList.contains('correct')) {
                    correctCounter--;
                }
                removeClass(currentWord.lastChild, 'correct');
                removeClass(currentWord.lastChild, 'incorrect');
            }
        }

    }

    //Scroll words
    if (currentWord.nextElementSibling) {
        if (currentWord.nextElementSibling.getBoundingClientRect().right < currentWord.getBoundingClientRect().right) {
            if (isSpace && farFromTop) {
                const words = document.getElementById('words');
                const margin = parseInt(words.style.marginTop || 0);
                words.style.marginTop = (margin - 35) + 'px';
            }
        }
    }


    if (isBackspace && isFirstLetter) {
        if (currentWord.previousElementSibling.getBoundingClientRect().right > currentWord.getBoundingClientRect().right) {

            if (margin < 0) {
                words.style.marginTop = (margin + 35) + 'px';
            }
        }

    }

    // Move cursor
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current')

    // Cas 1 : On doit taper la première lettre d'un mot et on tape backspace
    if (isBackspace && isFirstLetter) {

        // Vérifie si il faut remonter sur la ligne du dessus
        if (currentWord.previousElementSibling.getBoundingClientRect().right > currentWord.getBoundingClientRect().right && margin < 0) {
            cursor.style.left = nextWord.getBoundingClientRect().right + 'px';
            cursor.style.top = currentWord.getBoundingClientRect().top + 8 + 'px';
        }
    } else if (nextLetter && farFromTop) {
        // cursor.style.top = nextLetter.getBoundingClientRect().top + 8 + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
        console.log("1");

    } else if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 8 + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
        console.log("2");
    }
    else {
        cursor.style.top = nextWord.getBoundingClientRect().top + 8 + 'px';
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';
        console.log("3");

    }


    // Mise a jour du compteur de mot et de la précision
    updateWordCount(wordsCounter);
    updateAccuracy(correctCounter, lettersCounter);
})

newGame()