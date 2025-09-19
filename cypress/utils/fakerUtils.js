import { faker } from '@faker-js/faker';

export const gerarUsuario = () => ({
    userName: faker.person.fullName(),
    password: "SenhaForte123!"
});

