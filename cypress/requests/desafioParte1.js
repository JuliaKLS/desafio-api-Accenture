import { gerarUsuario } from '../utils/fakerUtils';

Cypress.Commands.add('cadastrarUsuario', () => {
const usuario = gerarUsuario();

    return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/User',
    headers: {'Content-Type': 'application/json'},
    body: usuario
  }).then((response) => {

    expect(response.status).to.eq(201);
    expect(response.body.username).to.eq(usuario.userName)

    return {
      userId: response.body.userID,
      userName: response.body.username
    };
  });
}); 

Cypress.Commands.add('gerarToken', () => {
  const usuario = gerarUsuario(); 
  return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/User',
    headers: { 'Content-Type': 'application/json' },
    body: usuario
  }).then((response) => {
    expect(response.status).to.eq(201);
    expect(response.body.username).to.eq(usuario.userName);

    return cy.request({
      method: 'POST',
      url: 'https://demoqa.com/Account/v1/GenerateToken',
      headers: { 'Content-Type': 'application/json' },
      body: usuario
    }).then((responseToken) => {
      expect(responseToken.status).to.eq(200);
      expect(responseToken.body.status).to.eq("Success");
      expect(responseToken.body.result).to.eq("User authorized successfully.");

      return { token: responseToken.body.token };
    });
  });
});

Cypress.Commands.add('confirmarUsuarioAutorizado', () => {

    return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/Authorized',
    body: {
  "userName": "Luna Linda",
  "password": "SenhaForte123@"
}
  }).then((response) => {

    expect(response.status).to.eq(200);
    expect(response.body).to.eq(true)
  });
});

Cypress.Commands.add('listarLivros', () => {

  const usuario = gerarUsuario();

    cy.request({
    method: 'GET',
    url: 'https://demoqa.com/BookStore/v1/Books',
      body: usuario
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.books).to.be.an('array')
  });
});

Cypress.Commands.add('alugarLivros', () => {
  const usuario = gerarUsuario();

  return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/User',
    headers: {'Content-Type': 'application/json'},
    body: usuario
  }).then((responseUser) => {

    expect(responseUser.status).to.eq(201);

    const userId = responseUser.body.userID;

  return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/GenerateToken',
    headers: {'Content-Type': 'application/json'},
    body: usuario
  }).then((responseToken) => {
    
    expect(responseToken.status).to.eq(200);

    const token = responseToken.body.token;

    return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/BookStore/v1/Books',
    headers: { Authorization: `Bearer ${token}`},
    body:{
            "userId": userId,
            "collectionOfIsbns": [
            { "isbn": "9781449325862" },
            { "isbn": "9781449331818" }
            ]
          }
  }).then((responseAluguel) => {

    expect(responseAluguel.status).to.eq(201);
    expect(responseAluguel.body.books).to.be.an('array');
    });
    });
  });
})
Cypress.Commands.add('listarUsuarioComLivrosEscolhidos', () => {
  const usuario = gerarUsuario();

  return cy.request({
    method: 'POST',
    url: 'https://demoqa.com/Account/v1/User',
    headers: { 'Content-Type': 'application/json' },
    body: usuario
  }).then((responseUser) => {
    expect(responseUser.status).to.eq(201);

    const userId = responseUser.body.userID;

    return cy.request({
      method: 'POST',
      url: 'https://demoqa.com/Account/v1/GenerateToken',
      headers: { 'Content-Type': 'application/json' },
      body:usuario
    }).then((responseToken) => {
      expect(responseToken.status).to.eq(200);

      const token = responseToken.body.token;

      return cy.request({
        method: 'POST',
        url: 'https://demoqa.com/BookStore/v1/Books',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          userId,
          collectionOfIsbns: [
            { isbn: "9781449325862" },
            { isbn: "9781449331818" }
          ]
        }
      }).then((responseAluguel) => {
        expect(responseAluguel.status).to.eq(201);
        expect(responseAluguel.body.books).to.be.an('array');

        return cy.request({
          method: 'GET',
          url: `https://demoqa.com/Account/v1/User/${userId}`, 
          headers: { Authorization: `Bearer ${token}` }
        }).then((responseLivrosEscolhidos) => {
          expect(responseLivrosEscolhidos.status).to.eq(200);
          expect(responseLivrosEscolhidos.body.username).to.eq(usuario.userName); 
          expect(responseLivrosEscolhidos.body.books).to.be.an('array');
        
        });
      });
    });
  });
});

