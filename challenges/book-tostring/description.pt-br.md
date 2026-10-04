# Livro com toString()

Quando você imprime um objeto, o Java chama o método `toString()` dele. Por padrão, isso imprime algo pouco útil, como `Book@1b6d3586`. **Sobrescreva** esse método para descrever o objeto direito.

Crie uma classe `Book` com os atributos `title`, `author` e `year`, e sobrescreva `toString()` para que imprimir um livro mostre:

```
"Clean Code" by Robert Martin (2008)
```

Imprima cada livro passando o próprio objeto para o `println`.

**Entrada**

- Linha 1: a quantidade de livros `n`
- Próximas `n` linhas: `título;autor;ano` (separados por ponto e vírgula; títulos e autores podem ter espaços)

**Saída**

Uma linha por livro, no formato acima.

**O que você precisa saber**

- `@Override public String toString() { … }` troca o texto padrão. Mantenha `public` e escrito exatamente assim.
- `IO.println(book)` (ou `System.out.println(book)`) chama o `toString()` para você.
- Separe cada linha com `line.split(";")`. Para colocar aspas dentro de uma String, escreva `\"`: `"\"" + title + "\""`.

> **Java clássico:** escreva as suas classes no mesmo arquivo `Main.java`, acima ou abaixo de `public class Main`, *sem* a palavra `public` (só uma classe por arquivo pode ser pública).
