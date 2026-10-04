# Arrumar uma lista de nomes

Um formulário de inscrição juntou nomes com maiúsculas bagunçadas e repetidos. Arrume a lista com um stream:

1. deixe cada nome com a **primeira letra maiúscula** e o resto minúsculo (`bOB` → `Bob`);
2. tire os **repetidos**;
3. **ordene** em ordem alfabética;
4. imprima separados por `, `.

**Resolva sem laços `for` ou `while`.**

**Entrada**

Uma linha de nomes separados por um espaço.

**Saída**

Os nomes arrumados, por exemplo `Alice, Bob, Carol`.

**O que você precisa saber**

- `.map(...)` transforma cada elemento, `.distinct()` tira os repetidos e `.sorted()` ordena.
- `name.substring(0, 1)` é a primeira letra, e `name.substring(1)` é o resto.
- A ordem dos passos importa: arrume as maiúsculas **antes** de tirar os repetidos, para `bob` e `Bob` contarem como o mesmo nome.
