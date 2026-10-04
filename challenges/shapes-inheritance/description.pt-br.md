# Formas (herança)

Com **herança**, várias classes compartilham uma classe mãe. A classe `abstract` `Shape` diz que toda forma tem um `name()` e uma `area()`, mas deixa cada subclasse decidir como calcular.

`Shape` e uma subclasse de exemplo, `Circle`, já estão escritas. Adicione:

- `class Square extends Shape`: construída a partir de um lado, área = lado × lado
- `class Triangle extends Shape`: construída a partir da base e da altura, área = base × altura / 2

Depois termine o `main`. Como todo objeto é um `Shape`, a mesma linha de código consegue imprimir qualquer um deles. Isso se chama **polimorfismo**.

**Entrada**

- Linha 1: a quantidade de formas `n`
- Próximas `n` linhas: `circle <raio>`, `square <lado>` ou `triangle <base> <altura>`

**Saída**

Uma linha por forma com a área (2 casas decimais), e depois o total das áreas exatas:

```
Circle: 12.57
Square: 9.00
Total area: 21.57
```

**O que você precisa saber**

- `class Square extends Shape` herda de `Shape` e precisa implementar os métodos abstratos, `name()` e `area()`.
- Coloque `@Override` acima de cada método que você implementar, para o Java conferir a assinatura.
- Uma variável `Shape` pode guardar qualquer subclasse: `Shape s = new Square(3);`, e `s.area()` executa a versão do `Square`.
- Some as áreas exatas em um total `double` e arredonde só na hora de imprimir.

> **Java clássico:** escreva as suas classes no mesmo arquivo `Main.java`, acima ou abaixo de `public class Main`, *sem* a palavra `public` (só uma classe por arquivo pode ser pública).
