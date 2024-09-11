import { createContext, useReducer } from "react";
import questions from '../data/questions_complete'

const STAGES = ['Start', 'Category' , 'Playing', 'End']

const initialState = {
    gameStage: STAGES[0],
    questions,
    currentQuestion: 0,
    score: 0,
    answerSelected: false,
    help: false,
    optionToHide: null,
}

const quizReducer = (state, action) =>{
    switch(action.type){
        case "CHANGE_STATE":
        return {
            ...state,
            gameStage: STAGES[1],
        }

        case "START_GAME":
            let quizQuestions = null

            state.questions.forEach((question)=>{
                if(question.category === action.payload){
                    quizQuestions = question.questions
                }
            })
            return{
                ...state,
                questions: quizQuestions,
                gameStage: STAGES[2],
                help: false,
            }

        case "CHANGE_QUESTION":
        const nexQuestion = state.currentQuestion + 1; 
        let endGame = false

            if(!state.questions[nexQuestion]){
                endGame = true;
            }

         return {
             ...state,
             currentQuestion:nexQuestion,
             gameStage: endGame ? STAGES[3] : state.gameStage,
             answerSelected: false,
         }

        case "REODER_QUESTIONS":
            const reorderredQuestions= state.questions.sort(()=>{
                return Math.random() -0.5;
            })

            return {
                ...state,
                questions: reorderredQuestions,
            }

            case "NEW_GAME":
                return initialState;

            case "CHECK_ANSWER":
                if (state.answarSelected) return state; 

                  const answar = action.payload.answer;
                  const option = action.payload.option;
                  let corectAnswer = 0

                  if(answar === option) corectAnswer = 1;

                  return{
                    ...state,
                    score: state.score + corectAnswer,
                    answerSelected: option,
                  }

                  case "SHOW_TIP":
                    return{
                        ...state, 
                        help: "tip",
                    }
                
            case "REMOVE_OPTION":
                const questionWithoutOption = state.questions[state.currentQuestion]
                let repeat = true
                let optionToHide

                questionWithoutOption.options.forEach((option) => {
                    if(option !== questionWithoutOption.answar && repeat){
                        optionToHide = option;
                        repeat = false;
                    }
                });

                return{
                    ...state,
                    optionToHide,
                    help:true,
                }

        default:
            return state;
    }
}

export const QuizContext = createContext();

export const QuizProvider = ({children, }) =>{
    const value= useReducer(quizReducer, initialState);
    return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
};