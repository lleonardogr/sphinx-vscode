# Ler números (NumberFormatException)

O registro de um sensor mistura números com lixo. Some os valores que são números inteiros e avise quais você precisou pular.

Para `12 abc 30 4.5 -7`:

```
Skipped: abc
Skipped: 4.5
Valid numbers: 3
Sum: 35
```

**Entrada**

Uma linha de valores separados por um espaço.

**Saída**

- `Skipped: valor` para cada valor que não é um `int` válido, na ordem da entrada
- `Valid numbers: k`
- `Sum: s` (a soma pode passar do tamanho de um `int`)

**O que você precisa saber**

- `Integer.parseInt(texto)` lança uma **`NumberFormatException`** quando o texto não é um número inteiro que cabe em um `int`: letras, decimais e números grandes demais falham. Sinais e zeros à esquerda (`+5`, `-0`, `007`) funcionam.
- Mantenha o `try` pequeno: só o código que pode falhar, para um valor ruim não pular os outros.
- Deixe o `parseInt` decidir o que é número em vez de conferir os caracteres você mesmo. Use um `long` para a soma.
