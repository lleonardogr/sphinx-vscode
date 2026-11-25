void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] words = new String[n];
    for (int i = 0; i < n; i++) {
        words[i] = IO.readln().trim();
    }
    int q = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < q; i++) {
        String prefix = IO.readln().trim();

        // TODO: imprima quantas palavras começam com prefix, usando uma trie montada com as palavras
    }
}
