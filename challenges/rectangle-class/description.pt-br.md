# Classe Retângulo

Objetos juntam **dados** (atributos) com **comportamento** (métodos). Crie uma classe `Rectangle` que sabe responder perguntas sobre si mesma.

A classe precisa de:

- atributos `int width` e `int height`, e um construtor `Rectangle(int width, int height)`
- `int area()`: largura × altura
- `int perimeter()`: 2 × (largura + altura)
- `boolean isSquare()`: `true` quando a largura é igual à altura

**Entrada**

- Linha 1: a quantidade de retângulos `n`
- Próximas `n` linhas: `largura altura`

**Saída**

Para cada retângulo:

```
Area: 12, Perimeter: 14, Square: false
```

**O que você precisa saber**

- Os métodos de uma classe podem usar os atributos do objeto direto: `return width * height;`
- Um método `boolean` pode retornar uma comparação: `return width == height;`
- Cada `new Rectangle(w, h)` é um objeto separado, com a sua própria largura e altura.

> **Java clássico:** escreva as suas classes no mesmo arquivo `Main.java`, acima ou abaixo de `public class Main`, *sem* a palavra `public` (só uma classe por arquivo pode ser pública).
