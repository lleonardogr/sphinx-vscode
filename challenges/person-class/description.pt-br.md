# Sua primeira classe

Uma **classe** é uma planta, e um **objeto** é algo construído a partir dela. Crie uma classe `Person` e use-a para apresentar várias pessoas.

A classe precisa de:

- dois **atributos**: `String name` e `int age`
- um **construtor** `Person(String name, int age)` que guarda os valores
- um **método** `String introduce()` que retorna `Hi, I'm <name> and I'm <age> years old.`

**Entrada**

- Linha 1: a quantidade de pessoas `n`
- Próximas `n` linhas: um nome (uma palavra) e uma idade

**Saída**

Uma apresentação por pessoa.

**O que você precisa saber**

- `new Person("Ana", 20)` chama o construtor e cria um objeto.
- Dentro do construtor, `this.name = name;` copia o parâmetro para o atributo.

> **Java clássico:** escreva as suas classes no mesmo arquivo `Main.java`, acima ou abaixo de `public class Main`, *sem* a palavra `public` (só uma classe por arquivo pode ser pública).
