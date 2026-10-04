# Números primos (método)

Complete o método `isPrime(int n)` para que ele retorne `true` quando `n` for primo e `false` caso contrário.

Um **número primo** é maior que 1 e só é divisível por 1 e por ele mesmo (2, 3, 5, 7, 11, …).

O método `main` já está escrito: ele lê vários números e chama o seu método para cada um. **Mude só o `isPrime`.**

**Entrada**

- Linha 1: quantos números vêm depois, `t`
- Linha 2: `t` inteiros

**Saída**

Para cada número, `<n> is prime` (é primo) ou `<n> is not prime` (não é primo).

**O que você precisa saber**

- Um método devolve o resultado com `return`. Assim que `return false;` roda, o método para.
- Você só precisa testar divisores até a raiz quadrada: se `n` tem um divisor maior que √n, também tem um menor. Repita enquanto `i * i <= n`.
- Números menores que 2, incluindo 0, 1 e negativos, não são primos.
