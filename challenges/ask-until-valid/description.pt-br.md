# Pergunte até ser válido

Um formulário pede a idade do usuário e continua pedindo até a resposta ser válida. A idade precisa ser um número inteiro de `0` a `120`.

Complete `parseAge`: ele converte o texto e **lança uma `IllegalArgumentException`** quando a idade está fora do intervalo. Depois continue lendo linhas no `main` até uma ser válida:

```
Not a number: twenty
Out of range: 130
Age accepted: 25
```

**Entrada**

Uma resposta por linha. Sempre existe uma resposta válida em algum momento; ignore as linhas depois dela. Pode haver espaços em volta de uma resposta.

**Saída**

- `Not a number: texto` quando a linha não é um número inteiro (mostre o texto sem os espaços em volta)
- `Out of range: idade` quando é um número fora de 0 a 120
- `Age accepted: idade` para a primeira resposta válida, e então pare

**O que você precisa saber**

- `throw new IllegalArgumentException("mensagem")` avisa de um problema; o `catch` de quem chamou recebe a exceção, e `e.getMessage()` devolve a mensagem.
- Um `try` pode ter vários `catch`. O Java usa o **primeiro que combina**, e `NumberFormatException` é um tipo de `IllegalArgumentException`, então capture ela primeiro.
- Um `while (true)` com `break` quando a idade for aceita continua perguntando quanto for preciso.
