# Divisor de pacotes

A internet não manda um arquivo ou uma mensagem de uma vez. Ela divide os dados em **pacotes**, cada um com um **cabeçalho** (endereços e outras informações) e uma **carga útil** (um pedaço dos dados). Um pacote típico numa rede doméstica pode ter no máximo 1500 bytes, com o cabeçalho.

Leia o tamanho de uma mensagem, o maior tamanho de pacote e o tamanho do cabeçalho, e calcule como a mensagem é enviada.

**Entrada**

Uma linha com três números inteiros: o tamanho da mensagem em bytes (1 a 10⁹), o maior tamanho de pacote e o tamanho do cabeçalho (ambos de 1 a 65.535).

**Saída**

Três linhas:

- `Packets: ` e o número de pacotes;
- `Last packet: N bytes`: o tamanho do último pacote, com o cabeçalho;
- `Total sent: N bytes`: tudo o que foi enviado, com os cabeçalhos.

Se o cabeçalho não deixar espaço para nenhuma carga útil, imprima só `Header too big`.

**O que você precisa saber**

- Carga útil por pacote = tamanho do pacote − cabeçalho. Para pacotes de 1500 bytes com cabeçalho de 40 bytes, são 1460 bytes.
- Com números inteiros, `(a + b - 1) / b` divide e arredonda para cima.
- Use `long` para os totais: uma mensagem de 1 GB é dividida em centenas de milhares de pacotes.
