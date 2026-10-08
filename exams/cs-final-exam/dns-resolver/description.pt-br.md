# Resolvedor de DNS

Antes de o navegador se conectar a um site, ele pergunta ao **DNS** o endereço IP do site. Os servidores DNS guardam **registros**:

- um registro **A** dá o endereço IPv4 de um nome. Um site movimentado pode ter vários, um por servidor, para dividir a carga;
- um registro **CNAME** diz que um nome é um **apelido**: para achar o endereço dele, procure outro nome.

Resolver um nome é seguir os CNAMEs até chegar a registros A. Com estes registros:

```
example.com A 93.184.216.34
www.example.com CNAME example.com
shop.example.com CNAME www.example.com
```

`shop.example.com` é resolvido passando por dois apelidos: `shop.example.com -> www.example.com -> example.com -> 93.184.216.34`.

Nomes **ignoram maiúsculas e minúsculas**, então `WWW.Example.com` é o mesmo nome que `www.example.com`. Duas coisas podem dar errado:

- um nome não tem registro nenhum: a resposta é `NXDOMAIN` ("domínio inexistente");
- os CNAMEs andam em círculo, como `a -> b -> a`. Resolvedores de verdade param e informam um erro.

Leia os registros e resolva cada consulta.

**Entrada**

O número de registros `r` (1 a 50), depois `r` linhas como `nome A endereço` ou `nome CNAME outro-nome`. Um nome tem um CNAME ou um ou mais registros A, nunca os dois. Depois o número de consultas `q` (1 a 20) e `q` linhas, cada uma com um nome.

**Saída**

Uma linha por consulta: os nomes visitados, em minúsculas, unidos por ` -> `, e depois

- os endereços dos registros A, na ordem em que foram dados, separados por `, `: `cdn.net -> 151.101.1.1, 151.101.65.1`;
- ou `NXDOMAIN` quando o último nome não tem registro: `mail.example.com -> NXDOMAIN`;
- ou, quando um CNAME leva a um nome já visitado nesta consulta, esse nome e depois `LOOP`: `a.test -> b.test -> a.test -> LOOP`.

**Para saber**

- `name.toLowerCase()` facilita comparar nomes.
- Um `HashMap<String, String>` para os CNAMEs e um `HashMap<String, List<String>>` para os endereços ajudam, mas arrays também funcionam.
