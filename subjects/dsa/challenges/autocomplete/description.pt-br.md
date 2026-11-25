# Autocompletar

Quando você digita "car" numa caixa de busca, ela sugere *card*, *care* e *cart* antes de você terminar. Para fazer isso rápido, as palavras ficam numa **trie**: uma árvore de letras em que cada caminho a partir da raiz forma um prefixo.

Leia as palavras que as pessoas digitaram e depois responda perguntas sobre prefixos: quantas das palavras começam com cada prefixo?

Para as palavras `car card care cart dog dot do car`:

```
car → 5
ca → 5
do → 3
d → 3
x → 0
```

**Entrada**

- Linha 1: `n` (1 ≤ n ≤ 200.000), depois `n` palavras, uma por linha (1 a 10 letras minúsculas; uma palavra pode repetir, e cada vez conta)
- Depois `q` (1 ≤ q ≤ 20.000), depois `q` prefixos, um por linha (1 a 10 letras minúsculas)

**Saída**

Uma linha por prefixo: quantas palavras começam com ele. Uma palavra conta como começando com ela mesma.

**Bom saber**

- `palavra.startsWith(prefixo)` para cada palavra e cada prefixo dá 4 × 10⁹ conferências no maior teste.
- Um nó de trie pode ser um array de 26 filhos mais um contador; `c - 'a'` transforma uma letra no seu índice.
- Ordenar as palavras e fazer busca binária de onde as palavras de um prefixo começam e terminam também é rápido.
