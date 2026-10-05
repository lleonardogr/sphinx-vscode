# Custo do frete

Uma loja virtual calcula o frete com várias regras. Aplique todas, nesta ordem.

**1. Confira o peso.** Peso `0` ou menos imprime `Invalid weight`. Mais de `30` kg imprime `Too heavy`. Nos dois casos, pare aí.

**2. Preço base pelo peso:**

| Peso | Preço base |
|------|-----------:|
| até 1 kg | 8.00 |
| mais de 1 kg, até 5 kg | 12.50 |
| mais de 5 kg, até 30 kg | 20.00 |

**3. Distância.** Mais de `500` km acrescenta **50%** ao preço.

**4. Expresso.** A entrega `express` **dobra** o preço; a `standard` não muda nada.

**5. Frete grátis.** Pedidos de `200.00` ou mais têm frete grátis na entrega `standard` (o expresso nunca é grátis).

**Entrada**

- Linha 1: o peso em kg (um número decimal)
- Linha 2: a distância em km (um número inteiro)
- Linha 3: `standard` ou `express`
- Linha 4: o valor do pedido (um número decimal)

**Saída**

`Shipping: 12.50` (duas casas decimais), `Shipping: free`, `Invalid weight` ou `Too heavy`.

**O que você precisa saber**

- Uma cadeia `if / else if / else` escolhe a faixa de peso; `if`s separados aplicam os extras um depois do outro.
- Compare Strings com `equals`: `type.equals("express")`.
- `"Shipping: %.2f".formatted(price)` imprime duas casas decimais.
