/// <reference types="cypress" />

describe('Testes API Parte 1', () => {
    it('Criar Usuário', () => {
        cy.cadastrarUsuario();
    });
    it('Gerar Token', () => {
        cy.gerarToken();
    });
    it('Confirmar Usuario Autorizado', () => {
        cy.confirmarUsuarioAutorizado();
    });
    it('Listar Livros', () => {
        cy.listarLivros();
    });
    it('Alugar Livros', () => {
        cy.alugarLivros();
    });

    it('Listar Usuário Com Livros Escolhidos', () => {
        cy.listarUsuarioComLivrosEscolhidos();
    });
});