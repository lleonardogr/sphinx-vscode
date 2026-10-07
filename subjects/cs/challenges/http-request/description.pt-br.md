# Lendo um pedido HTTP

Quando você abre uma página, seu navegador manda ao servidor algumas linhas de texto, um **pedido HTTP**:

```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Sphinx

```

A primeira linha é a **linha de pedido**: o **método** (o que fazer), o **caminho** (qual página) e a **versão**. Depois vêm os **cabeçalhos**, um por linha, como `Nome: valor`, e uma **linha vazia** termina o pedido. Ler essas linhas é a primeira coisa que todo servidor web faz.

Leia um pedido e imprima o que ele pede.

**Entrada**

Uma linha de pedido, depois linhas de cabeçalho, depois uma linha vazia.

**Saída**

Quatro linhas: `Method: `, `Path: `, `Host: ` e `Headers: ` com o número de linhas de cabeçalho. Imprima `400 Bad Request` em vez disso se:

- a linha de pedido não tiver exatamente 3 partes separadas por espaços simples;
- o método não for `GET`, `POST`, `PUT`, `DELETE` ou `HEAD`;
- uma linha de cabeçalho não tiver dois-pontos;
- não houver cabeçalho `Host` (nomes de cabeçalho ignoram maiúsculas e minúsculas, então `host:` conta).

**O que você precisa saber**

- `linha.split(" ")` divide a linha de pedido; confira se você obtém exatamente 3 partes.
- Divida um cabeçalho nos **primeiros** dois-pontos, `linha.indexOf(':')`: os valores podem ter dois-pontos, como em `api.example.com:8080`. Tire os espaços em volta do nome e do valor.
- Leia o pedido você mesmo: classes de `java.net` não valem aqui.
