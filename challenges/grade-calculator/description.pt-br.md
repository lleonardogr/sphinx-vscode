# Calculadora de conceitos

Transforme a nota de uma prova em um conceito (letra).

| Nota     | Conceito |
|----------|----------|
| 90 – 100 | A        |
| 80 – 89  | B        |
| 70 – 79  | C        |
| 60 – 69  | D        |
| 0 – 59   | F        |

**Entrada**

Uma nota inteira entre 0 e 100.

**Saída**

A letra do conceito.

**O que você precisa saber**

- Uma cadeia `if / else if / else` testa as condições de cima para baixo e executa só a **primeira** que for verdadeira.
- Por causa dessa ordem, depois de testar `nota >= 90`, o próximo teste só precisa de `nota >= 80`.
- Teste os limites você mesmo: 90, 89, 60 e 59 são onde os erros se escondem.
