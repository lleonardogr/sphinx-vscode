void main() {
    int r = Integer.parseInt(IO.readln().trim());
    String[] routes = new String[r];
    for (int i = 0; i < r; i++) {
        routes[i] = IO.readln().trim(); // por exemplo 10.0.0.0/8 Office
    }
    int n = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < n; i++) {
        String address = IO.readln().trim();

        // TODO: ache a rota que corresponde com o maior prefixo e imprima endereco -> proximo salto
    }
}
