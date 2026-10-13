# Ordenar três

Na unidade de funções, um `swap(int x, int y)` não conseguia mudar nada: trocava cópias. Com **ponteiros** uma função recebe os endereços das variáveis de quem chamou e pode mudar as próprias variáveis. É o que o `scanf` vem fazendo o tempo todo com `&x`.

Escreva `void sort3(int *a, int *b, int *c)`, que põe em ordem crescente as três variáveis para onde aponta, e use-a em cada linha da entrada:

```
3 1 2    →    1 2 3
5 5 1    →    1 5 5
```

**Entrada**

- Linha 1: `t`, a quantidade de linhas (1 ≤ t ≤ 100)
- Depois `t` linhas com três inteiros entre −10⁹ e 10⁹

**Saída**

Os três números de cada linha em ordem crescente.

**Coisas para saber**

- Em `sort3`, `a` é um endereço e `*a` é a variável naquele endereço: `*a = 5;` muda a variável de quem chamou.
- Chame com os endereços: `sort3(&x, &y, &z)`, e depois imprima `x`, `y` e `z`.
- Sem arrays: a graça são três variáveis separadas, mudadas por ponteiros.
