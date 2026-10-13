# Verificação de Luhn

Digite errado um dígito do cartão de crédito e o site reclama antes mesmo de consultar o banco. Isso é o **algoritmo de Luhn**, um dígito verificador que também protege números de IMEI e muitos documentos. Ele pega todo erro de um só dígito e a maioria das trocas de dígitos vizinhos.

Começando pelo dígito **mais à direita** (o verificador), dobre um dígito **sim, outro não**. Quando um dígito dobrado passa de 9, subtraia 9. Some todos os dígitos: o número é válido quando o total termina em 0.

Para `79927398713`:

```
dígitos     7  9  9  2  7  3  9  8  7  1  3
dobra?         *     *     *     *     *
vira        7 18  9  4  7  6  9 16  7  2  3
menos 9     7  9  9  4  7  6  9  7  7  2  3   →  total 70: válido
```

**Entrada**

- Linha 1: `t`, a quantidade de números (1 ≤ t ≤ 100)
- Depois `t` linhas com um número inteiro (0 a 10¹⁹ − 1, escrito sem zeros à esquerda)

**Saída**

Para cada número: o número, um espaço e `valid` ou `invalid`.

**Coisas para saber**

- Divida o trabalho em funções: uma que calcula a soma de Luhn, outra que diz se um número é válido. O `main` só lê e imprime.
- Os números vão até 19 dígitos, o que cabe num `unsigned long long` (até cerca de 1,8 × 10¹⁹): leia e imprima com `%llu`.
- `n % 10` é o último dígito e `n / 10` o remove.
