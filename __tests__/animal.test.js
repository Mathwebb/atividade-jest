const fs = require('fs');
const request = require('supertest');
const app = require('../src/app');
const animalsData = require('../src/data/animals.json');

describe('Cadastro de animais', () => {
    // afterAll Executa uma ação após todos os testes terem sido executados
    // beforeAll Executa uma ação antes de todos os testes serem executados
    // afterEach Executa uma ação após cada teste
    // beforeEach Executa uma ação antes de cada teste
    afterAll(() => {
        while (animalsData.length > 0) {
            animalsData.pop();
        }
        fs.writeFileSync('./src/data/animals.json', JSON.stringify(animalsData));
    });

    it('Deve cadastrar um animal com sucesso', async () => {
        const res = await request(app).post('/animais?nome=Spike&especie=Cachorro&idade=3');
        expect(res.statusCode).toBe(201);
    });

    it('Deve falhar no cadastro, pois o nome é curto demais', async () => {
        const res = await request(app).post('/animais?nome=J&especie=Hamster&idade=1');
        expect(res.statusCode).toBe(400);
    });

    it('Deve falhar no cadastro, pois a idade é inválida', async () => {
        const res = await request(app).post('/animais?nome=Mimi&especie=Gato&idade=Jovem');
        expect(res.statusCode).toBe(400);
    });
});

describe('Retorno de animais', () => {
    beforeAll(() => {
        animalsData.push(
            {
                'id': 'aaaa',
                'nome': 'Spike',
                'especie': 'Cachorro',
                'idade': 3
            },
            {
                'id': 'bbbb',
                'nome': 'Mimi',
                'especie': 'Gato',
                'idade': 2
            },
            {
                'id': 'cccc',
                'nome': 'Juno',
                'especie': 'Hamster',
                'idade': 1
            }
        );
        fs.writeFileSync('./src/data/animals.json', JSON.stringify(animalsData));
    });

    afterAll(() => {
        while (animalsData.length > 0) {
            animalsData.pop();
        }
        fs.writeFileSync('./src/data/animals.json', JSON.stringify(animalsData));
    });

    it('Deve retornar uma lista com 3 animais com sucesso', async () => {
        const res = await request(app).get('/animais');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(3);
    });
});