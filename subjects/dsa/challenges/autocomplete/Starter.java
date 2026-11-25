void main() {
    int n = Integer.parseInt(IO.readln().trim());
    String[] words = new String[n];
    for (int i = 0; i < n; i++) {
        words[i] = IO.readln().trim();
    }
    int q = Integer.parseInt(IO.readln().trim());
    for (int i = 0; i < q; i++) {
        String prefix = IO.readln().trim();

        // TODO: print how many words start with prefix, using a trie built from the words
    }
}
