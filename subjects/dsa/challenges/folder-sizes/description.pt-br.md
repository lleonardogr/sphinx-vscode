# Tamanho das pastas

Ferramentas de uso de disco mostram quanto espaço cada pasta ocupa, incluindo tudo dentro das subpastas, para você ver o que limpar. As pastas formam uma **árvore**, e o total de uma pasta são os próprios arquivos mais os totais das subpastas: é preciso terminar os filhos antes do pai, um percurso em **pós-ordem**.

Leia uma lista de arquivos com caminhos e tamanhos e informe:

- `folders: ` quantas pastas existem (a raiz, onde os caminhos começam, não conta);
- `total size: ` o tamanho de todos os arquivos;
- `folders over limit: ` quantas pastas têm total de pelo menos `limit`;
- `largest folder: ` o caminho da pasta com o maior total (o primeiro em ordem alfabética num empate), e `largest folder size: ` o total dela. Se não houver pastas, imprima `none` e `0`.

Para estes arquivos e um limite de 1000:

```
docs/report.txt 500
docs/old/draft.txt 300
photos/2024/beach.jpg 2000
photos/2024/city.jpg 1500
photos/notes.txt 10
readme.md 5
```

As pastas são docs (800), docs/old (300), photos (3510) e photos/2024 (3500):

```
folders: 4
total size: 4315
folders over limit: 2
largest folder: photos
largest folder size: 3510
```

**Entrada**

- Linha 1: `n` e `limit` (1 ≤ n ≤ 100.000; 1 ≤ limit ≤ 10¹⁵)
- Depois `n` linhas com um caminho e um tamanho (1 a 1.000.000.000). Os caminhos usam `/` entre as pastas; a última parte é o nome do arquivo. Os nomes usam letras, dígitos, `.`, `-` e `_`, e nenhum arquivo aparece duas vezes.

**Saída**

Cinco linhas, como no exemplo.

**Bom saber**

- Duas pastas com o mesmo nome em lugares diferentes são pastas diferentes: docs/old e photos/old.
- Um `Map<String, Folder>` de filhos por pasta forma a árvore; `caminho.split("/")` dá as partes.
- Os totais podem passar de 10¹⁴: use `long`.
