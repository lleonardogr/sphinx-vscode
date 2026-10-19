void main() {
    int q = Integer.parseInt(IO.readln().trim());
    long found = 0;
    long missing = 0;
    long sum = 0;
    for (int i = 0; i < q; i++) {
        String[] parts = IO.readln().trim().split(" +");
        int op = Integer.parseInt(parts[0]);
        int key = Integer.parseInt(parts[1]);
        int value = Integer.parseInt(parts[2]);

        // TODO: put, get ou remove na sua própria tabela hash, e conte os gets
    }
    IO.println("found: " + found);
    IO.println("missing: " + missing);
    IO.println("sum: " + sum);
    IO.println("size: " + 0); // TODO: o número de chaves na sua tabela
}
