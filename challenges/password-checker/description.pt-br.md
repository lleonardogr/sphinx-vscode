# Verificador de senha

Um formulário de cadastro confere se as senhas novas são fortes. Teste a senha com estas regras, **nesta ordem**, e imprima uma linha para **cada regra que ela não cumpre**:

| Regra | Mensagem |
|-------|----------|
| pelo menos 8 caracteres | `Too short` |
| pelo menos uma letra maiúscula | `Needs an uppercase letter` |
| pelo menos uma letra minúscula | `Needs a lowercase letter` |
| pelo menos um dígito | `Needs a digit` |

Se ela cumpre todas, imprima `Strong password`.

Para `abc`:

```
Too short
Needs an uppercase letter
Needs a digit
```

**Entrada**

Uma linha com a senha. Ela pode ter qualquer caractere, inclusive espaços.

**Saída**

Uma mensagem por regra não cumprida, ou `Strong password`.

**O que você precisa saber**

- `length()` devolve o número de caracteres de uma String.
- `Character.isUpperCase(c)`, `Character.isLowerCase(c)` e `Character.isDigit(c)` testam um caractere.
- Uma variável `boolean` começa como `false` e vira `true` quando o laço encontra o que procura.
