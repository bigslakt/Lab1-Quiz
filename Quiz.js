var xhr = new XMLHttpRequest();
var response;
var questions = [];  //Questions from web api
var answers = [];  //Users answers
var questionList = document.getElementById("questionList");
var output;  //Web page output
var questionsAnswered = 0;  //Number of answered questions
var points = 0;  //Users points

//Get questions from API and put it into "data"
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
        console.log(xhr.response);
        questions = xhr.response.results;

        render();
    }
}

//GET web API
xhr.open("GET", "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple");
xhr.responseType = "json";
xhr.send();

function render(){    

    questions.forEach((question, index) => {
        
        output = document.createElement("div");
        let options = [];
        let optionId;
        options.push(question.correct_answer);
        options = options.concat(question.incorrect_answers); 
        shuffle(options);
        output.innerHTML = `        
            
            <h3>${question.question}</h3>
            
            <form>
                <input type = "button" id = "${index + "_" + 0}" value = "${options[0]}" name = "answer">
                <input type = "button" id = "${index + "_" + 1}" value = "${options[1]}" name = "answer">
                <input type = "button" id = "${index + "_" + 2}" value = "${options[2]}" name = "answer">
                <input type = "button" id = "${index + "_" + 3}" value = "${options[3]}" name = "answer">
            </form>

        `;
        output.classList.add('output');

        questionList.appendChild(output);
    })
    
} 

//EventListener for div question list
questionList.addEventListener('click', (e) => {
    console.log(e.target);            
    
    //Check if event is triggered by answer button
    if(e.target.name == "answer") {    
        
        let answerId = e.target.id.split('_');  //Splitting of button id to sort out which question thats 
                                                //being answered
        
        //Check if current question already have been answered                                       
        if (!answers[answerId[0]]){

            questionsAnswered ++;  //questionsAnswered is used to store the nr of questions 
                                    //that the user answered before the current one
             
            document.getElementById("bar").value = (questionsAnswered / 10) * 100;  //Progress bar changed
        }
        //If current question already have been answered the last checked answer button shall be reset
        else{
            document.getElementById(answers[answerId[0]].id).style.backgroundColor = "";   
            document.getElementById(answers[answerId[0]].id).style.color = "";         
        }

       //Changing colors for the answer button thats been checked
        document.getElementById(e.target.id).style.backgroundColor = "#2e466e"; 
        document.getElementById(e.target.id).style.color = "#ffffff";       
        answers[answerId[0]] = e.target;  //The users answer is put in the answer list at the position 
                                           //for current question
    }   
})

//EventListener for the submit button
submit.addEventListener('click', (e) => {
    console.log(e.target);   
    
    //The submit button is inactive until the user has answered all questions
    if(questionsAnswered == 10)
    {
        //The users answers is compared to the correct answers to count points
        questions.forEach((question, index) => {            
                    
            if(question.correct_answer == answers[index].value){
                points++;                
            }             
        })

        document.getElementById("submitButton").disabled = true;  //Submit button disabled
        console.log(points + " rätt!");
        
        finalOutput();  //Method final output is called to create the final output
    }                        
    else{
        console.log("Svara på alla frågor!");
    }
})

//Method for creating final output after all questions have been answered
function finalOutput(){

    document.getElementById("questionList").innerHTML = "";  //Previous page is reset

    document.getElementById("heading").textContent = 'Results';

    //Questions with users answers and correct answers
    questions.forEach((question, index) => {

        let output = document.createElement("div");

        output.innerHTML = `        
            
            <h3>${question.question}</h3>
            
            <p>Your answer:</p>
            <p>${answers[index].value}</p>
            <br>
            <p>Correct answer:</p>
            <p>${question.correct_answer}</p>

        `;
        output.classList.add('output');

        questionList.appendChild(output);                                                   
                                                           
    })

    let output = document.createElement("div");

    output.innerHTML = `        
    
        <br>
        <h2>Results:</h2>
        
        <p>You got ${points}/10 correct answers!</p>
    `;
    output.classList.add('output');

    questionList.appendChild(output);   
    
}

// Shuffle the correct answeres to mix them up
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}