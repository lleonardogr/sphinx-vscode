# Animais (interfaces)

Uma **interface** é um contrato: ela lista métodos que uma classe promete ter, sem dizer como eles funcionam.

Crie uma interface `Animal` com dois métodos, `String name()` e `String sound()`, e quatro classes que a **implementam**:

| Classe | name() | sound() |
|--------|--------|---------|
| Dog    | dog    | Woof    |
| Cat    | cat    | Meow    |
| Cow    | cow    | Moo     |
| Duck   | duck   | Quack   |

Guarde os animais em um array `Animal[]` e depois percorra o array, deixando cada um falar.

**Entrada**

- Linha 1: a quantidade de animais `n`
- Linha 2: `n` tipos de animal (`dog`, `cat`, `cow` ou `duck`)

**Saída**

Para cada animal, na ordem:

```
The dog says Woof!
```

**O que você precisa saber**

- `interface Animal { String name(); String sound(); }` só lista os métodos.
- `class Dog implements Animal` precisa escrever os dois métodos, e eles precisam ser `public`.
- Um array `Animal[]` guarda objetos de qualquer classe que implemente `Animal`. O laço chama `animal.sound()` sem saber de qual classe ele é.

> **Java clássico:** escreva as suas classes no mesmo arquivo `Main.java`, acima ou abaixo de `public class Main`, *sem* a palavra `public` (só uma classe por arquivo pode ser pública).
