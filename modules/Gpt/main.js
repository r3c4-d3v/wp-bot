const { Configuration, OpenAIApi } = require("openai");
const dotenv = require('dotenv').config();

class OpenAIHandler {
    static #instance;
    #configuration;
    #openai;
    #aditionalPrompt;

    constructor() {
        if (OpenAIHandler.#instance) {
            return OpenAIHandler.#instance;
        }
        OpenAIHandler.#instance = this;

        console.log(process.env.OPENIA_API_KEY)

        this.#configuration = new Configuration({
            apiKey: process.env.OPENIA_API_KEY
        });

        this.#openai = new OpenAIApi(this.#configuration);

        this.#aditionalPrompt = "responda a pergunta apos os dois pontos, seja direto e eficiente na resposta sem exceder 130 palavras na resposta:";
    }

    static getInstance() {
        return !OpenAIHandler.#instance
            ? OpenAIHandler.#instance = new OpenAIHandler()
            : OpenAIHandler.#instance;
    }

    #sanitizePrompt(rawPrompt) {
        return this.#aditionalPrompt + rawPrompt;
    }

    #setConfiguration(rawPrompt) {
        return {
            model: "text-davinci-003",
            prompt: this.#sanitizePrompt(rawPrompt),
            temperature: 1,
            max_tokens: 300
        }
    }

    async executePrompt(rawPrompt) {
        const configuration = this.#setConfiguration(rawPrompt);
        return await this.#openai.createCompletion(configuration)
            .catch(error => console.error(error));
    }
}

module.exports = OpenAIHandler;