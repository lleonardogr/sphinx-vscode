# Fatorial gigante

25! é 15.511.210.043.330.985.984.000.000: 26 dígitos, demais até para um `unsigned long long`, que vai só até 20. O Java tem `BigInteger`; o C não tem nada embutido, então bibliotecas de números grandes (usadas em criptografia, por exemplo) guardam o número como um **array de dígitos** e fazem as contas como você aprendeu na escola.

Leia `n` e imprima `n!` exatamente, seguido de quantos dígitos ele tem:

```
25   →   15511210043330985984000000
         Digits: 26
```

**Entrada**

Um número inteiro `n` (0 ≤ n ≤ 1000).

**Saída**

`n!` por extenso, depois `Digits: ` e a quantidade de dígitos. (`0!` é 1.)

**Coisas para saber**

- 1000! tem 2.568 dígitos, então um array de 3.000 dígitos basta.
- Guarde o último dígito primeiro: o dígito `i` vale 10ⁱ, e dígitos novos entram no fim do array conforme o número cresce.
- Multiplicar um número longo por um pequeno: vá do último dígito ao primeiro calculando `dígito × fator + vai_um`; o novo dígito é isso `% 10` e o "vai um" é isso `/ 10`.
- Sem `double` nem `float`: eles arredondariam o número.
