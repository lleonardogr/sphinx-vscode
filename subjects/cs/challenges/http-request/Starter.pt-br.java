void main() {
    String requestLine = IO.readln(); // por exemplo GET /index.html HTTP/1.1
    String line = IO.readln();
    while (!line.isEmpty()) {
        // TODO: confira a linha de cabeçalho e guarde o Host

        line = IO.readln();
    }
    // TODO: confira a linha de pedido, depois imprima as quatro linhas ou 400 Bad Request
}
