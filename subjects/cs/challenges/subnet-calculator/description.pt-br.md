# Calculadora de sub-rede

Uma rede é um **bloco** de endereços IP consecutivos. Ela é escrita como um endereço e um **prefixo**, como `192.168.1.130/26`: os primeiros 26 bits são a **parte da rede**, igual em todos os endereços do bloco, e os 32 − 26 = 6 bits restantes numeram os dispositivos dentro dele. Então o bloco tem 2⁶ = 64 endereços.

- O **endereço de rede** é o primeiro do bloco (todos os bits de dispositivo 0): `192.168.1.128`.
- O **endereço de broadcast** é o último (todos os bits de dispositivo 1): `192.168.1.191`.
- Os endereços do meio são para os dispositivos: de `192.168.1.129` a `192.168.1.190`, **62** hosts.

Leia um endereço com prefixo e descreva a rede dele.

**Entrada**

Um endereço IPv4, `/` e um prefixo de 8 a 30.

**Saída**

Cinco linhas:

```
Network: <endereço de rede>
Broadcast: <endereço de broadcast>
First host: <rede + 1>
Last host: <broadcast - 1>
Hosts: <quantidade de endereços de host>
```

**O que você precisa saber**

- Trabalhe com o endereço como um único número num `long`: `a × 256³ + b × 256² + c × 256 + d`.
- O bloco tem `2^(32 − prefixo)` endereços, e o endereço de rede é o endereço arredondado para baixo até um múltiplo disso.
- Escreva um método que transforma um número de volta na forma com pontos; classes de `java.net` não valem aqui.
