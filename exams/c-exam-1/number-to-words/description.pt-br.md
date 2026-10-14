# Número por extenso

Cheques, contratos e leitores de tela escrevem números por extenso. Leia números e imprima cada um por extenso, em inglês:

```
123405   →   one hundred twenty-three thousand four hundred five
42       →   forty-two
0        →   zero
1000     →   one thousand
```

**Entrada**

Números inteiros de 0 a 999.999, um por linha, até o fim da entrada.

**Saída**

Cada número por extenso em inglês, em minúsculas:

- `one` a `nineteen`; as dezenas `twenty`, `thirty`, `forty`, `fifty`, `sixty`, `seventy`, `eighty`, `ninety`, ligadas à unidade por hífen (`ninety-nine`);
- centenas como `… hundred`, seguidas do resto depois de um espaço (`one hundred five`, sem "and");
- milhares como `… thousand`, seguidos do resto depois de um espaço;
- um espaço entre as palavras, e `zero` para 0.

**Coisas para saber**

- Uma função que escreve de 1 a 999 faz a maior parte do trabalho: a parte dos milhares também a usa.
- Monte a linha num array de `char` com `strcat` ou `snprintf`, ou imprima as palavras conforme avança.
